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
assert(light.includes('width="600"') && light.includes('width:600px;max-width:100%'), 'fixed 600px for Outlook, never wider than the screen');
assert(/width:23\.333%[^>]*><img [^>]*logo-vallado\.png[^>]*width:100%;max-width:140px;height:auto/.test(light), 'Vallado logo: 140px column that scales');
assert(/width:25\.667%[^>]*><img [^>]*logo-sponsor\.png[^>]*width:100%;max-width:154px;height:auto/.test(light), 'sponsor logo: 154px column that scales');
assert(light.includes('+351&nbsp;912&nbsp;345&nbsp;678'), 'phone number never splits at spaces');
assert(build({ ...data, phone: '912-345-678' }).includes('912&#8209;345&#8209;678'), 'phone number never splits at hyphens');
assert(light.includes('overflow-wrap:anywhere'), 'long unbroken text wraps instead of widening the signature');
console.log('ok');
