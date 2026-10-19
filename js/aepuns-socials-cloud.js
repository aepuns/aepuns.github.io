(()=>{'use strict';const API='https://aepuns-secrets-api.sheav06.workers.dev';const list=document.querySelector('.social-links');if(!list)return;
fetch(API+'/site/content?kind=socials',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Social API '+r.status);return r.json()}).then(data=>{
if(!Array.isArray(data.items)||!data.items.length)return;
const items=data.items.filter(x=>x&&x.published!==false&&String(x.status||'').toLowerCase()!=='unpublished').sort((a,b)=>Number(a.sort_order??0)-Number(b.sort_order??0));
if(!items.length)return;const frag=document.createDocumentFragment();
for(const item of items){
const target=item.url||item.href||item.link||item.destination;let href;try{href=new URL(target,location.href);if(!['http:','https:'].includes(href.protocol))continue}catch{continue}
const li=document.createElement('li'),a=document.createElement('a'),platform=document.createElement('span'),tile=document.createElement('span'),img=new Image(),name=document.createElement('span'),desc=document.createElement('small');
a.href=href.href;a.target='_blank';a.rel='noopener noreferrer';platform.className='platform';tile.className='icon-tile';
let media=item.icon_url||item.icon||item.image||item.media||item.image_url||'';
if(typeof media==='string'&&media.startsWith('{')){try{const obj=JSON.parse(media);media=obj.url||obj.src||obj.path||''}catch{media=''}}
if(media){try{const source=new URL(media,location.href);if(['http:','https:'].includes(source.protocol))img.src=source.href}catch{}}
if(!img.src){const fallback=[...list.querySelectorAll('li')].find(el=>el.querySelector('.platform')?.textContent.trim().toLowerCase()===String(item.title||item.name||'').trim().toLowerCase());if(fallback)img.src=fallback.querySelector('img')?.src||''}
if(img.src){img.alt='';tile.append(img);platform.append(tile)}
name.textContent=String(item.title||item.name||item.platform||'Link');platform.append(name);desc.textContent=String(item.description||item.subtitle||item.body||'');
a.append(platform,desc);li.append(a);frag.append(li);
}if(frag.childNodes.length)list.replaceChildren(frag);
}).catch(e=>console.warn('Socials static fallback:',e.message))})();