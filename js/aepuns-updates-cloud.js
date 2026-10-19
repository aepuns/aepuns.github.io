(()=>{
'use strict';
const API='https://aepuns-secrets-api.sheav06.workers.dev';
const feed=document.getElementById('updates-feed');
if(!feed)return;
const attachment=(url,title)=>{
  if(!url)return null;
  let u;try{u=new URL(url,location.href)}catch{return null}
  if(!['http:','https:'].includes(u.protocol))return null;
  let id=null;
  if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)) id=u.searchParams.get('v')||(u.pathname.startsWith('/shorts/')?u.pathname.split('/')[2]:null);
  else if(u.hostname==='youtu.be')id=u.pathname.split('/')[1];
  if(id&&/^[a-zA-Z0-9_-]{11}$/.test(id)){
    const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id;f.title=title;f.loading='lazy';f.allowFullscreen=true;f.style.cssText='display:block;width:100%;aspect-ratio:16/9;border:0;margin-top:16px';return f;
  }
  if(/\.(png|jpe?g|webp|gif|avif)$/i.test(u.pathname)){
    const img=new Image();img.src=u.href;img.alt=title;img.loading='lazy';img.style.cssText='display:block;width:100%;height:auto;object-fit:contain;margin-top:16px';return img;
  }
  const a=document.createElement('a');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent='View attachment';return a;
};
fetch(API+'/site/content?kind=updates',{cache:'no-store'})
 .then(r=>{if(!r.ok)throw Error('Cloudflare content API returned '+r.status);return r.json()})
 .then(data=>{
    if(!Array.isArray(data.items))throw Error('Unexpected Cloudflare content');
    const published=data.items.filter(x=>x.status!=='Unpublished'&&x.published!==false).sort((a,b)=>Number(b.sort_order||0)-Number(a.sort_order||0));
    const frag=document.createDocumentFragment();
    for(const x of published){
      const article=document.createElement('article');article.className='update-entry';
      const time=document.createElement('time');const date=x.published_at?new Date(x.published_at):null;
      if(date&&!Number.isNaN(date.getTime()))time.textContent=date.toLocaleDateString();
      const heading=document.createElement('h2');heading.textContent=x.title||'';
      const body=document.createElement('p');body.textContent=x.body||'';body.style.whiteSpace='pre-wrap';
      article.append(time,heading,body);
      let media=x.media;if(media&&typeof media==='string'&&media.trim().startsWith('{')){try{const parsed=JSON.parse(media);media=parsed.url||parsed.src||parsed.href||''}catch{media=''}}
      const node=attachment(media,x.title||'Update attachment');if(node)article.append(node);
      frag.append(article);
    }
    feed.replaceChildren(frag);
    const status=document.getElementById('updates-status');if(status)status.textContent=published.length?'':'No updates yet.';
    console.info('Aepuns Updates: loaded '+published.length+' published entries from Cloudflare');
  })
  .catch(e=>console.warn('Aepuns Updates: Cloudflare unavailable; retained GitHub fallback:',e.message));
})();
