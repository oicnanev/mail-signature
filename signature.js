// Builds the email signature HTML: tables + inline CSS, so it works in Gmail/Outlook/Apple Mail.
const ORANGE = '#f7a645';
const THEMES = {
  light: { bg: '#ffffff', text: '#111111', divider: '1px solid #111111' },
  dark: { bg: '#13100e', text: '#ffffff', divider: '0' },
};
// Times as fallback (not Georgia, which is wider and wraps the address onto two lines).
const SERIF = "Garamond, 'Times New Roman', Times, serif";
const SANS = 'Helvetica, Arial, sans-serif';

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// "www.x.pt" -> "https://www.x.pt"; empty stays empty. "javascript:..." never keeps its scheme.
const toUrl = (u) => {
  u = String(u ?? '').trim();
  return !u ? '' : /^https?:\/\//i.test(u) ? u : 'https://' + u.replace(/^\/+/, '');
};

function build(data, themeName = 'light', baseUrl = 'img/') {
  const theme = THEMES[themeName] || THEMES.light;
  const paragraph = (style, html) => `<p style="margin:0;${style}">${html}</p>`;
  const link = (url, html, decoration) =>
    `<a href="${escapeHtml(url)}" style="color:${theme.text};text-decoration:${decoration}">${html}</a>`;

  const phone = (data.phone ?? '').trim();
  const site = toUrl(data.site);
  const contacts = [
    phone && link('tel:' + phone.replace(/[^\d+]/g, ''), escapeHtml(phone), 'underline'),
    site && link(site, escapeHtml(site.replace(/^https?:\/\//i, '').replace(/\/$/, '')), 'underline'),
  ]
    .filter(Boolean)
    .join('&nbsp;&nbsp;|&nbsp;&nbsp;');

  const socials = [['IG', data.instagram], ['FB', data.facebook], ['LK', data.linkedin]]
    .filter(([, url]) => toUrl(url))
    .map(
      ([label, url]) =>
        `<td width="26" height="26" align="center" valign="middle" bgcolor="${ORANGE}" style="width:26px;height:26px;border-radius:13px;background:${ORANGE};font-family:${SANS};font-size:11px;line-height:26px">` +
        `<a href="${escapeHtml(toUrl(url))}" style="color:${theme.text};text-decoration:none">${label}</a></td>`
    )
    .join('<td width="8" style="width:8px;font-size:0;line-height:0">&nbsp;</td>');

  const info = [
    (data.name ?? '').trim() &&
      paragraph(`font-family:${SERIF};font-size:18px;line-height:20px;letter-spacing:0.3px`, escapeHtml(data.name.trim().toUpperCase())),
    (data.role ?? '').trim() &&
      paragraph(`font-family:${SERIF};font-size:10px;line-height:14px`, escapeHtml(data.role.trim().toUpperCase())),
    contacts && paragraph(`font-family:${SERIF};font-size:11px;line-height:16px;margin-top:14px`, contacts),
    (data.address ?? '').trim() &&
      paragraph(`font-family:${SERIF};font-size:11px;line-height:16px;margin-top:6px`, escapeHtml(data.address.trim())),
    socials &&
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px"><tr>${socials}</tr></table>`,
  ]
    .filter(Boolean)
    .join('');

  const tagline = (data.tagline ?? '').trim();

  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="${theme.bg}" style="width:600px;border-collapse:collapse;background:${theme.bg}">` +
    `<tr>` +
    `<td width="140" valign="top" bgcolor="${ORANGE}" style="width:140px;background:${ORANGE}">` +
    `<img src="${escapeHtml(baseUrl)}logo-vallado.png" width="140" height="128" alt="Vallado" style="display:block;border:0"></td>` +
    `<td valign="middle" bgcolor="${theme.bg}" style="padding:0 8px 0 16px;background:${theme.bg};color:${theme.text}">${info}</td>` +
    `<td width="154" valign="middle" bgcolor="#ffffff" style="width:154px;background:#ffffff;border-left:${theme.divider}">` +
    `<img src="${escapeHtml(baseUrl)}logo-sponsor.png" width="154" height="128" alt="The Leading Hotels of the World" style="display:block;border:0"></td>` +
    `</tr>` +
    (tagline
      ? `<tr><td colspan="3" align="center" bgcolor="${theme.bg}" style="padding:10px 12px 9px;background:${theme.bg};font-family:${SERIF};font-style:italic;font-size:15px;line-height:20px;color:${ORANGE}">${escapeHtml(tagline).replace(/\r?\n/g, '<br>')}</td></tr>`
      : '') +
    `</table>`
  );
}

if (typeof module !== 'undefined') module.exports = { build };
