'use strict';
// Each tomato is drawn in a 128x128 box. Body centre (64,72), radius ~44.
// Eyes sit at (48,70) and (80,70). Stem grows from (64,30).
const INK = '#3a2a24';
const SKINS = ['#e8402f','#f05a3a','#d9372a','#ff6a4d','#e04b2b','#f26b47','#cf3a26','#ff7857',
               '#e55638','#f0452e','#d64631','#ff5c3c','#e8503a','#f2603f','#cc3b2b','#ff6e52'];
const NAMES = ['Sunny Sal','Captain Ketchup','Rosie Vine','Big Red','Pico','Sauce Boss','Cherry Lou',
               'Professor Pulp','Marinara Mae','Tiny Tim','Beefsteak Bruno','Heirloom Hank',
               'Salsa Sam','Lady Bruschetta','Roma Ray','Gazpacho Gus'];
const HATS = ['sunhat','pirate','bow','crown','cap','glasses','beanie','monocle',
              'chef','flower','headband','shades','party','halo','bandana','tophat'];
const ACCENTS = ['#2f7fd6','#7b4fb8','#f2b632','#2fa36b','#ec5f9a','#3c9fcf','#f28c28','#5c6bc0'];

function stem(){
  return `<g fill="#4e9a3e" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round">
    <path d="M64 34c-8-9-20-8-25-3 9 1 14 4 19 9z"/>
    <path d="M64 34c8-9 20-8 25-3-9 1-14 4-19 9z"/>
    <path d="M64 36c-4-6-6-12-2-18 5 6 6 12 2 18z"/>
    <path d="M58 40c4-3 8-3 12 0-3 3-9 3-12 0z"/>
  </g>`;
}
function body(skin){
  return `<ellipse cx="64" cy="74" rx="45" ry="42" fill="${skin}" stroke="${INK}" stroke-width="2.6"/>
    <path d="M28 66c2-12 12-22 24-24" fill="none" stroke="#ffb09a" stroke-width="5" stroke-linecap="round" opacity=".75"/>
    <ellipse cx="42" cy="58" rx="6" ry="3.5" fill="#fff" opacity=".55"/>`;
}
function eyes(i){
  const iris = ['#1f7a8c','#6a4fb0','#8a5a2a','#3d7bbd','#2e8b57'][i%5];
  const wink = i%7===3;
  const one = (x,isRight)=>{
    if(wink && isRight) return `<path d="M${x-7} 70q7-9 14 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} 70)">
      <ellipse rx="7.5" ry="9" fill="#fffaf2" stroke="${INK}" stroke-width="1.4"/>
      <ellipse cy="-.5" rx="5.5" ry="7.5" fill="${iris}"/>
      <ellipse cy="-1.5" rx="3.4" ry="5" fill="${INK}"/>
      <circle cx="-2" cy="-4" r="2.3" fill="#fff"/>
    </g>`;
  };
  return one(48,false)+one(80,true);
}
function mouth(i){
  const kinds = [
    `<path d="M52 90q12 10 24 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
    `<path d="M50 88q14 16 28 0z" fill="#6b1d1d" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M57 90h14" stroke="#fff" stroke-width="3"/>`,
    `<ellipse cx="64" cy="92" rx="5" ry="6" fill="#6b1d1d" stroke="${INK}" stroke-width="2.2"/>`,
    `<path d="M54 92q10-6 20 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
    `<path d="M52 89q6 7 12 0t12 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
  ];
  return kinds[i%kinds.length] + `<circle cx="36" cy="86" r="5" fill="#ff8a76" opacity=".5"/><circle cx="92" cy="86" r="5" fill="#ff8a76" opacity=".5"/>`;
}
function hat(i){
  const a = ACCENTS[i%ACCENTS.length];
  const p = (d,fill=a)=>`<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`;
  const line = (d,w=2.4)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/>`;
  switch(HATS[i]){
    case 'sunhat': return p('M16 44h96l-10-6H26z','#f2d07a')+p('M34 40q0-22 30-22t30 22z','#f2d07a')+p('M34 40h60v4H34z',a);
    case 'pirate': return p('M22 44q42-16 84 0l-6-6q-36-12-72 0z',INK)+p('M34 40q8-22 30-22t30 22z',INK)+`<circle cx="64" cy="30" r="5" fill="#fff"/><path d="M58 36h12M64 36v6" stroke="#fff" stroke-width="3"/>`;
    case 'bow': return p('M78 32l16-10v22z')+p('M110 32l-16-10v22z')+`<circle cx="94" cy="32" r="4" fill="${INK}"/>`;
    case 'crown': return p('M36 44l6-20 10 12 12-16 12 16 10-12 6 20z','#f2b632')+`<circle cx="52" cy="36" r="2.5" fill="#e8402f"/><circle cx="64" cy="34" r="2.5" fill="#2f7fd6"/><circle cx="76" cy="36" r="2.5" fill="#2fa36b"/>`;
    case 'cap': return p('M34 44q0-24 30-24t30 24z')+p('M60 42h50l-4 6H60z')+`<circle cx="64" cy="20" r="3" fill="${INK}"/>`;
    case 'glasses': return `<g fill="none" stroke="${INK}" stroke-width="2.6"><circle cx="48" cy="70" r="12"/><circle cx="80" cy="70" r="12"/><path d="M60 70h8M36 68l-10-4M92 68l10-4"/></g>`;
    case 'beanie': return p('M32 46q0-26 32-26t32 26z')+p('M30 42h68v8H30z','#fff8e6')+`<circle cx="64" cy="20" r="5" fill="#fff8e6" stroke="${INK}" stroke-width="2"/>`;
    case 'monocle': return `<circle cx="80" cy="70" r="12" fill="#fff3" stroke="${INK}" stroke-width="2.6"/>`+line('M90 78q8 12 4 24');
    case 'chef': return p('M38 46V30q-8-8 2-14 6-12 24-8 18-4 24 8 10 6 2 14v16z','#fff8e6')+line('M38 46h52',2.6);
    case 'flower': return `<g transform="translate(94 34)">${[0,60,120,180,240,300].map(r=>`<ellipse rx="5" ry="9" transform="rotate(${r}) translate(0 -8)" fill="${a}" stroke="${INK}" stroke-width="1.6"/>`).join('')}<circle r="4.5" fill="#f2b632" stroke="${INK}" stroke-width="1.6"/></g>`;
    case 'headband': return p('M24 48q40-14 80 0v6q-40-14-80 0z')+p('M98 44l12-8-2 12 8 4z');
    case 'shades': return `<g stroke="${INK}" stroke-width="2.4"><rect x="34" y="60" width="26" height="18" rx="6" fill="${INK}"/><rect x="68" y="60" width="26" height="18" rx="6" fill="${INK}"/><path d="M60 68h8M34 66l-8-4M94 66l8-4" fill="none"/></g><path d="M38 64h8M72 64h8" stroke="#fff" stroke-width="2" opacity=".6"/>`;
    case 'party': return p('M64 10l18 36H46z')+`<g fill="#fff8e6"><circle cx="58" cy="36" r="2.5"/><circle cx="70" cy="28" r="2.5"/><circle cx="64" cy="20" r="2"/></g><circle cx="64" cy="10" r="4" fill="#f2b632" stroke="${INK}" stroke-width="2"/>`;
    case 'halo': return `<ellipse cx="64" cy="16" rx="24" ry="6" fill="none" stroke="#f2b632" stroke-width="4"/><ellipse cx="64" cy="16" rx="24" ry="6" fill="none" stroke="${INK}" stroke-width="1.5" opacity=".5"/>`;
    case 'bandana': return p('M26 50q38-14 76 0v6q-38-14-76 0z')+p('M100 48l14-10-4 14 10 6-16-2z')+`<g fill="#fff8e6"><circle cx="40" cy="51" r="1.6"/><circle cx="56" cy="47" r="1.6"/><circle cx="72" cy="47" r="1.6"/><circle cx="88" cy="51" r="1.6"/></g>`;
    case 'tophat': return p('M30 44h68v6H30z',INK)+p('M40 44V14h48v30z',INK)+p('M40 36h48v6H40z',a);
  }
  return '';
}
function tomato(i, back){
  const skin = SKINS[i];
  if(back){
    return `<svg viewBox="0 0 128 128" aria-hidden="true"><ellipse cx="64" cy="74" rx="45" ry="42" fill="${skin}" stroke="${INK}" stroke-width="2.6"/>
      <path d="M64 36q-12 20 0 40" fill="none" stroke="#b52e20" stroke-width="3" stroke-linecap="round" opacity=".5"/>${stem()}</svg>`;
  }
  return `<svg viewBox="0 0 128 128" aria-hidden="true">${body(skin)}${stem()}${eyes(i)}${mouth(i)}${hat(i)}</svg>`;
}
