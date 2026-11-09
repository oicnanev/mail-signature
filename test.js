// node test.js
const assert = require('assert');
const { build } = require('./assinatura.js');

const d = { nome: 'Ana <b>X</b>', cargo: 'Dir', telefone: '+351 912 345 678', site: 'www.x.pt', morada: 'Rua A', instagram: '', facebook: 'javascript:alert(1)', linkedin: 'https://l.in/a', frase: 'Olá\nMundo' };

const claro = build(d, 'claro', 'https://h.pt/i/');
const escuro = build(d, 'escuro', 'https://h.pt/i/');

assert(!claro.includes('<b>X</b>'), 'o nome tem de ser escapado');
assert(claro.includes('ANA &lt;B&gt;X&lt;/B&gt;'), 'nome escapado e em maiúsculas');
assert(!claro.includes('href="javascript:'), 'sem esquema javascript:');
assert(!claro.includes('instagram') && !claro.includes('>IG<'), 'rede sem link não aparece');
assert(claro.includes('>FB<') && claro.includes('>LK<'), 'redes com link aparecem');
assert(claro.includes('href="tel:+351912345678"') && claro.includes('href="https://www.x.pt"'), 'tel e site normalizados');
assert(claro.includes('Olá<br>Mundo'), 'a frase quebra a linha');
assert(claro.includes('src="https://h.pt/i/logo-vallado.png"'), 'usa o endereço base das imagens');
assert(claro.includes('#ffffff') && !claro.includes('#13100e'), 'tema claro');
assert(escuro.includes('#13100e'), 'tema escuro');
assert(!build({ ...d, frase: '' }).includes('font-style:italic'), 'sem frase, sem linha da frase');
console.log('ok');
