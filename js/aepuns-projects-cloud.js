(()=>{
'use strict';
// Control Center's published Projects feed. Keep the existing HTML if unavailable.
const API='https://aepuns-secrets-api.sheav06.workers.dev';
const panel=document.getElementById('projects-panel');
if(!panel)return;
function mediaNode(value,title){
  if(!value)return null;
  if(typeof value==='string'&&value.trim().startsWith('{')){try{value=JSON.parse(value)}catch{return null}}
  let url=typeof value==='string'?value:(value.url||value.src||value.href||value.path||'');
  if(!url)return null;
  let parsed;try{parsed=new URL(url,location.href)}catch{return null}
  if(!['https:','http:'].includes(parsed.protocol))return null;
  let id=null;
  if(['youtube.com','www.youtube.com','m.youtube.com'].includes(parsed.hostname))id=parsed.searchParams.get('v')||(parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)||[])[1];
  else if(parsed.hostname==='youtu.be')id=parsed.pathname.split('/')[1];
  else if(parsed.hostname==='www.youtube-nocookie.com')id=(parsed.pathname.match(/^\/embed\/([^/]+)/)||[])[1];
  if(id&&/^[A-Za-z0-9_-]{11}$/.test(id)){
    const wrap=document.createElement('div');wrap.className='project-video';
    const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/'+id;iframe.title=title;iframe.loading='lazy';iframe.allowFullscreen=true;iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    wrap.append(iframe);return wrap;
  }
  if(/\.(?:png|jpe?g|gif|webp|avif)$/i.test(parsed.pathname)){
    const img=new Image();img.src=parsed.href;img.alt=title;img.loading='lazy';img.style.cssText='display:block;max-width:100%;height:auto;margin:18px 0';return img;
  }
  const link=document.createElement('a');link.href=parsed.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent='View project';return link;
}
function category(x){
  const raw=String(x.section||x.category||x.group||x.project_status||x.stage||'').trim().toLowerCase();
  if(/complete|completed|done|finished|released|past/.test(raw))return 'complete';
  if(/upcoming|planned|future|next|in.progress|active/.test(raw))return 'upcoming';
  return 'featured';
}
function entry(x){
  const item=document.createElement('article');item.className='project-entry';
  const header=document.createElement('header');header.className='project-entry-header';
  const kicker=x.kicker||x.subtitle||x.label;
  if(kicker){const p=document.createElement('p');p.className='project-kicker';p.textContent=kicker;header.append(p)}
  const title=document.createElement('h2');title.textContent=x.title||x.name||'Untitled project';header.append(title);item.append(header);
  const media=x.media||x.video_url||x.youtube_url||x.video||x.attachment||x.image_url||x.url;
  const mediaEl=mediaNode(media,title.textContent);if(mediaEl)item.append(mediaEl);
  const desc=x.body??x.description??x.summary??'';
  if(desc){const p=document.createElement('p');p.className='project-description';p.textContent=String(desc);item.append(p)}
  return item;
}
function group(name,items){
  if(!items.length)return null;
  const section=document.createElement('section');section.className='project-section';
  const heading=document.createElement('h2');heading.className='projects-section-heading';heading.textContent=name.toUpperCase();section.append(heading);
  for(const item of items)section.append(entry(item));
  return section;
}
fetch(API+'/site/content?kind=projects',{cache:'no-store'})
 .then(r=>{if(!r.ok)throw Error('Projects API returned '+r.status);return r.json()})
 .then(data=>{
   if(!Array.isArray(data.items))throw Error('Unexpected Projects data');
   const items=data.items.filter(x=>x&&x.status!=='Unpublished'&&x.published!==false);
   if(!items.length)return; // Empty or unconfigured feed: preserve the existing page.
   items.sort((a,b)=>Number(a.sort_order??a.order??0)-Number(b.sort_order??b.order??0));
   const featured=[],upcoming=[],complete=[];
   for(const x of items){const c=category(x);(c==='complete'?complete:c==='upcoming'?upcoming:featured).push(x)}
   const frag=document.createDocumentFragment();
   for(const x of featured)frag.append(entry(x));
   for(const s of [group('Upcoming',upcoming),group('Complete',complete)])if(s)frag.append(s);
   // Only replace entries when the Cloudflare feed actually has published projects.
   panel.replaceChildren(frag);
   if(window.twemoji)window.twemoji.parse(panel,{folder:'svg',ext:'.svg'});
   console.info('Aepuns Projects: loaded '+items.length+' entries from Cloudflare');
 })
 .catch(err=>console.warn('Aepuns Projects: retaining static fallback:',err.message));
})();
