(()=>{'use strict';
const API='https://aepuns-secrets-api.sheav06.workers.dev';
const root=document.querySelector('.bio-content');if(!root)return;
fetch(API+'/site/content?kind=about',{cache:'no-store'})
.then(r=>{if(!r.ok)throw Error('About API '+r.status);return r.json()})
.then(data=>{
 if(!Array.isArray(data.items)||!data.items.length)return;
 const items=data.items.filter(x=>x&&x.published!==false&&String(x.status||'').toLowerCase()!=='unpublished');
 if(!items.length)return;
 // Control Center stores descending positions; display in reading order.
 items.sort((a,b)=>{const footer=x=>String(x.title||x.name||x.slug||'').trim().toLowerCase()==='footer'||/^more later lol\s*:\)$/i.test(String(x.body||'').trim());if(footer(a)!==footer(b))return footer(a)?1:-1;return Number(b.sort_order??0)-Number(a.sort_order??0)});
 const fragment=document.createDocumentFragment();
 for(const x of items){
 const raw=x.body??x.text??x.content??x.description??'';
 const parts=Array.isArray(raw)?raw.map(String):String(raw).split(/\n\s*\n/);
 for(const part of parts){if(!part.trim())continue;const p=document.createElement('p');p.textContent=part;p.style.whiteSpace='pre-wrap';if(String(x.title||x.name||x.slug||'').trim().toLowerCase()==='footer'||/^more later lol\s*:\)$/i.test(part.trim()))p.classList.add('bio-footer');fragment.append(p)}
 }
 if(fragment.childNodes.length)root.replaceChildren(fragment);
}).catch(e=>console.warn('About: preserving static content:',e.message));
})();