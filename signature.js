// Builds the email signature HTML: tables + inline CSS, so it works in Gmail/Outlook/Apple Mail.
const ORANGE = '#f7a645';
const THEMES = {
  light: { bg: '#ffffff', text: '#111111', divider: '1px solid #111111' },
  dark: { bg: '#13100e', text: '#ffffff', divider: '0' },
};
// Times as fallback (not Georgia, which is wider and wraps the address onto two lines).
const SERIF = "Garamond, 'Times New Roman', Times, serif";
const SANS = 'Helvetica, Arial, sans-serif';
// Desktop size. On narrower screens the signature shrinks; text keeps its size (10-18px is
// already the readable minimum) and wraps instead.
const WIDTH = 600;
const LOGO_HEIGHT = 128;
const pct = (px) => +((px / WIDTH) * 100).toFixed(3) + '%';

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
    phone && link('tel:' + phone.replace(/[^\d+]/g, ''), escapeHtml(phone).replace(/ /g, '&nbsp;').replace(/-/g, '&#8209;'), 'underline'),
    site && link(site, escapeHtml(site.replace(/^https?:\/\//i, '').replace(/\/$/, '')), 'underline'),
  ]
    .filter(Boolean)
    .join('&nbsp;&nbsp;|&nbsp; ');

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

  // Fluid layout without @media (most email clients strip <style> from signatures):
  // the table is 600px but never wider than the screen (max-width:100%), the logo columns are
  // percentages of the 600px design and the images follow their column (width:100%, height:auto).
  // Outlook desktop ignores max-width/height:auto and uses the width/height attributes, which
  // describe the same 600px layout, so it keeps the fixed version.
  const logoCell = (width, style, img) =>
    `<td width="${width}" valign="middle" style="width:${pct(width)};${style}">${img}</td>`;
  const logo = (file, width, alt) =>
    `<img src="${escapeHtml(baseUrl)}${file}" width="${width}" height="${LOGO_HEIGHT}" alt="${alt}" style="display:block;border:0;width:100%;max-width:${width}px;height:auto">`;

  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${WIDTH}" bgcolor="${theme.bg}" style="width:${WIDTH}px;max-width:100%;border-collapse:collapse;background:${theme.bg}">` +
    `<tr>` +
    logoCell(140, `background:${ORANGE}" bgcolor="${ORANGE}`, logo('logo-vallado.png', 140, 'Vallado')) +
    `<td valign="middle" bgcolor="${theme.bg}" style="padding:0 8px 0 16px;background:${theme.bg};color:${theme.text};overflow-wrap:anywhere;word-break:break-word">${info}</td>` +
    logoCell(154, `background:#ffffff;border-left:${theme.divider}" bgcolor="#ffffff`, logo('logo-sponsor.png', 154, 'The Leading Hotels of the World')) +
    `</tr>` +
    (tagline
      ? `<tr><td colspan="3" align="center" bgcolor="${theme.bg}" style="padding:10px 12px 9px;background:${theme.bg};font-family:${SERIF};font-style:italic;font-size:15px;line-height:20px;color:${ORANGE}">${escapeHtml(tagline).replace(/\r?\n/g, '<br>')}</td></tr>`
      : '') +
    `</table>`
  );
}

if (typeof module !== 'undefined') module.exports = { build };
