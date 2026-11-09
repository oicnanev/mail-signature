// Gera o HTML da assinatura de email: tabelas + CSS inline, para funcionar em Gmail/Outlook/Apple Mail.
const LARANJA = '#f7a645';
const TEMAS = {
  claro: { bg: '#ffffff', texto: '#111111', divisoria: '1px solid #111111' },
  escuro: { bg: '#13100e', texto: '#ffffff', divisoria: '0' },
};
// Times como recurso (e não Georgia, que é mais larga e quebra a morada em duas linhas).
const SERIF = "Garamond, 'Times New Roman', Times, serif";
const SANS = 'Helvetica, Arial, sans-serif';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// "www.x.pt" -> "https://www.x.pt"; vazio fica vazio. "javascript:..." nunca fica como esquema.
const href = (u) => {
  u = String(u ?? '').trim();
  return !u ? '' : /^https?:\/\//i.test(u) ? u : 'https://' + u.replace(/^\/+/, '');
};

function build(d, tema = 'claro', base = 'img/') {
  const t = TEMAS[tema] || TEMAS.claro;
  const p = (style, html) => `<p style="margin:0;${style}">${html}</p>`;
  const link = (url, html, deco) =>
    `<a href="${esc(url)}" style="color:${t.texto};text-decoration:${deco}">${html}</a>`;

  const tel = (d.telefone ?? '').trim();
  const site = href(d.site);
  const contactos = [
    tel && link('tel:' + tel.replace(/[^\d+]/g, ''), esc(tel), 'underline'),
    site && link(site, esc(site.replace(/^https?:\/\//i, '').replace(/\/$/, '')), 'underline'),
  ]
    .filter(Boolean)
    .join('&nbsp;&nbsp;|&nbsp;&nbsp;');

  const redes = [['IG', d.instagram], ['FB', d.facebook], ['LK', d.linkedin]]
    .filter(([, u]) => href(u))
    .map(
      ([sigla, u]) =>
        `<td width="26" height="26" align="center" valign="middle" bgcolor="${LARANJA}" style="width:26px;height:26px;border-radius:13px;background:${LARANJA};font-family:${SANS};font-size:11px;line-height:26px">` +
        `<a href="${esc(href(u))}" style="color:${t.texto};text-decoration:none">${sigla}</a></td>`
    )
    .join('<td width="8" style="width:8px;font-size:0;line-height:0">&nbsp;</td>');

  const info = [
    (d.nome ?? '').trim() &&
      p(`font-family:${SERIF};font-size:18px;line-height:20px;letter-spacing:0.3px`, esc(d.nome.trim().toUpperCase())),
    (d.cargo ?? '').trim() &&
      p(`font-family:${SERIF};font-size:10px;line-height:14px`, esc(d.cargo.trim().toUpperCase())),
    contactos && p(`font-family:${SERIF};font-size:11px;line-height:16px;margin-top:14px`, contactos),
    (d.morada ?? '').trim() && p(`font-family:${SERIF};font-size:11px;line-height:16px;margin-top:6px`, esc(d.morada.trim())),
    redes &&
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px"><tr>${redes}</tr></table>`,
  ]
    .filter(Boolean)
    .join('');

  const frase = (d.frase ?? '').trim();

  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="${t.bg}" style="width:600px;border-collapse:collapse;background:${t.bg}">` +
    `<tr>` +
    `<td width="140" valign="top" bgcolor="${LARANJA}" style="width:140px;background:${LARANJA}">` +
    `<img src="${esc(base)}logo-vallado.png" width="140" height="128" alt="Vallado" style="display:block;border:0"></td>` +
    `<td valign="middle" bgcolor="${t.bg}" style="padding:0 8px 0 16px;background:${t.bg};color:${t.texto}">${info}</td>` +
    `<td width="154" valign="middle" bgcolor="#ffffff" style="width:154px;background:#ffffff;border-left:${t.divisoria}">` +
    `<img src="${esc(base)}logo-patrocinio.png" width="154" height="128" alt="The Leading Hotels of the World" style="display:block;border:0"></td>` +
    `</tr>` +
    (frase
      ? `<tr><td colspan="3" align="center" bgcolor="${t.bg}" style="padding:10px 12px 9px;background:${t.bg};font-family:${SERIF};font-style:italic;font-size:15px;line-height:20px;color:${LARANJA}">${esc(frase).replace(/\r?\n/g, '<br>')}</td></tr>`
      : '') +
    `</table>`
  );
}

if (typeof module !== 'undefined') module.exports = { build };
