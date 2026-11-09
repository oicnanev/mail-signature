// node test.js
const assert = require('assert');
const { build } = require('./signature.js');

const data = {
  name: 'Ana <b>X</b>', role: 'Dir', phone: '+351 912 345 678', site: 'www.x.pt', address: 'Rua A',
  instagram: '', facebook: 'javascript:alert(1)', linkedin: 'https://l.in/a', tagline: 'Olá\nMundo',
};

const light = build(data, 'light', 'https://h.pt/i/');
const dark = build(data, 'dark', 'https://h.pt/i/');

assert(!light.includes('<b>X</b>'), 'name must be escaped');
assert(light.includes('ANA &lt;B&gt;X&lt;/B&gt;'), 'name escaped and uppercased');
assert(!light.includes('href="javascript:'), 'no javascript: scheme');
assert(!light.includes('instagram') && !light.includes('>IG<'), 'social without link is hidden');
assert(light.includes('>FB<') && light.includes('>LK<'), 'socials with link are shown');
assert(light.includes('href="tel:+351912345678"') && light.includes('href="https://www.x.pt"'), 'phone and site normalised');
assert(light.includes('Olá<br>Mundo'), 'tagline keeps line breaks');
assert(light.includes('src="https://h.pt/i/logo-vallado.png"'), 'uses the images base URL');
assert(light.includes('#ffffff') && !light.includes('#13100e'), 'light theme');
assert(dark.includes('#13100e'), 'dark theme');
assert(!build({ ...data, tagline: '' }).includes('font-style:italic'), 'no tagline, no tagline row');
console.log('ok');
