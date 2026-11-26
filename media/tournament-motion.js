/* Approved still-life covers: drawing routines from the owner-reviewed preview. */
const W=900,H=738,TAU=Math.PI*2;
function ease(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function ramp(t,a,b){return ease((t-a)/(b-a))}
function round(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}
const noise=document.createElement('canvas');noise.width=450;noise.height=369;
const nc=noise.getContext('2d');const im=nc.createImageData(450,369);let seed=7319;
function rng(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
for(let i=0;i<im.data.length;i+=4){const n=rng()*30;im.data[i]=12+n*.25;im.data[i+1]=35+n*.65;im.data[i+2]=36+n*.6;im.data[i+3]=255}nc.putImageData(im,0,0);
function bg(c){
 c.fillStyle='#060b0c';c.fillRect(0,0,W,H);
 const g=c.createRadialGradient(570,480,25,500,430,640);g.addColorStop(0,'#123c3d');g.addColorStop(.45,'#0a2528');g.addColorStop(1,'#020405');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.save();c.globalAlpha=.24;c.globalCompositeOperation='soft-light';c.drawImage(noise,0,0,W,H);c.restore();
 c.save();c.globalAlpha=.09;c.strokeStyle='#b2c6bd';c.lineWidth=.45;
 for(let y=0;y<H;y+=4){c.beginPath();c.moveTo(0,y);c.lineTo(W,y+2);c.stroke()}c.restore();
 const dark=c.createLinearGradient(0,0,0,H);dark.addColorStop(0,'#0009');dark.addColorStop(.36,'#0004');dark.addColorStop(.68,'#0000');dark.addColorStop(1,'#0008');c.fillStyle=dark;c.fillRect(0,0,W,H);
 c.save();c.strokeStyle='#d7bc6b';c.globalAlpha=.13;c.lineWidth=2;c.beginPath();c.ellipse(660,476,410,190,-.23,0,TAU);c.stroke();c.restore();
}
function shadow(c,x,y,rx,ry,alpha=.45){c.save();c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,`rgba(0,0,0,${alpha})`);g.addColorStop(1,'#0000');c.fillStyle=g;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore()}
function paintChip(c,x,y,r=63,gold=false,angle=0,tilt=.47){
 c.save();c.translate(x,y);c.rotate(angle);
 const side=c.createLinearGradient(-r,0,r,0);side.addColorStop(0,gold?'#5a3c10':'#041b1d');side.addColorStop(.3,gold?'#c39742':'#176066');side.addColorStop(.65,gold?'#6d4a1a':'#082d31');side.addColorStop(1,'#010a0c');
 c.fillStyle=side;c.beginPath();c.ellipse(0,8,r,r*tilt,0,0,TAU);c.fill();c.fillRect(-r,0,2*r,8);
 for(let j=0;j<3;j++){c.strokeStyle=j===1?'#d9c48870':'#0009';c.lineWidth=1;c.beginPath();c.ellipse(0,3+j*2.2,r-.5,r*tilt,0,0,Math.PI);c.stroke()}
 c.save();c.scale(1,tilt);
 let g=c.createLinearGradient(-r,-r,r,r);g.addColorStop(0,gold?'#f4df98':'#397578');g.addColorStop(.35,gold?'#b89145':'#0e484d');g.addColorStop(1,gold?'#6c4c1e':'#032a2e');c.fillStyle=g;c.beginPath();c.arc(0,0,r,0,TAU);c.fill();
 c.strokeStyle=gold?'#ffe8a6':'#d6c47e';c.lineWidth=2;c.beginPath();c.arc(0,0,r-2,0,TAU);c.stroke();
 for(let i=0;i<12;i++){const a=i*TAU/12;c.save();c.rotate(a);c.fillStyle=i%2?'#efe1ad':'#ada178';c.globalAlpha=.8;round(c,-4,-r+5,8,12,1);c.fill();c.restore()}
 c.strokeStyle=gold?'#4f381e':'#a9bd9d';c.lineWidth=1;c.beginPath();c.arc(0,0,r*.67,0,TAU);c.stroke();c.beginPath();c.arc(0,0,r*.61,0,TAU);c.stroke();
 c.fillStyle=gold?'#2a2920':'#e1cb84';c.textAlign='center';c.textBaseline='middle';c.font=`600 ${r*.38}px Georgia`;c.fillText('KK',0,2);
 c.restore();c.restore();
}
function pile(c,x,y,n,r=62,gold=false){shadow(c,x+10,y+22,r*1.6,30);for(let j=0;j<n;j++)chip(c,x+Math.sin(j*2.4)*.9,y-j*9,r,gold)}
function paintCard(c,x,y,angle,face=1,rank='A',suit='♠',scale=1){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);
 const sx=Math.max(.025,Math.abs(Math.cos(face*Math.PI)));c.scale(sx,1);const w=146,h=206;
 c.shadowColor='#000a';c.shadowBlur=20;c.shadowOffsetX=10;c.shadowOffsetY=15;
 const g=c.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,'#f5eedc');g.addColorStop(.55,'#dedaca');g.addColorStop(1,'#b7b9ad');c.fillStyle=g;round(c,-w/2,-h/2,w,h,10);c.fill();c.shadowColor='transparent';c.strokeStyle='#fff7';c.lineWidth=1;c.stroke();
 if(face<.5){
  c.fillStyle='#123c40';round(c,-w/2+8,-h/2+8,w-16,h-16,5);c.fill();c.strokeStyle='#bba261';c.lineWidth=1;round(c,-w/2+13,-h/2+13,w-26,h-26,3);c.stroke();
  c.save();round(c,-w/2+17,-h/2+17,w-34,h-34,1);c.clip();c.strokeStyle='#9aaf9660';c.lineWidth=.8;
  for(let k=-250;k<250;k+=13){c.beginPath();c.moveTo(k,-110);c.lineTo(k+220,110);c.stroke();c.beginPath();c.moveTo(k,110);c.lineTo(k+220,-110);c.stroke()}c.restore();
  c.fillStyle='#123c40';c.beginPath();c.ellipse(0,0,28,35,0,0,TAU);c.fill();c.strokeStyle='#d7bd7b';c.stroke();c.fillStyle='#e7cc86';c.font='26px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText('KK',0,1);
 }else{
  c.fillStyle=suit==='♥'||suit==='♦'?'#8c2529':'#132b2c';c.textAlign='left';c.font='27px Georgia';c.fillText(rank,-w/2+12,-h/2+33);c.font='22px Georgia';c.fillText(suit,-w/2+12,-h/2+57);c.textAlign='center';c.textBaseline='middle';c.font='76px Georgia';c.fillText(suit,0,6);
  c.save();c.rotate(Math.PI);c.textAlign='left';c.textBaseline='alphabetic';c.font='27px Georgia';c.fillText(rank,-w/2+12,-h/2+33);c.font='22px Georgia';c.fillText(suit,-w/2+12,-h/2+57);c.restore();
 }
 const sheen=c.createLinearGradient(-90,-110,70,100);sheen.addColorStop(0,'#fff2');sheen.addColorStop(.4,'#fff0');sheen.addColorStop(1,'#0001');c.fillStyle=sheen;round(c,-w/2,-h/2,w,h,10);c.fill();c.restore();
}
/* FIXED-3b(v2): отрисовка разделена — drawContent рисует только содержимое сцены,
   а draw() сохраняет прежнее поведение целиком (фон + контент + виньетка). */
function drawContent(c,story,t){
 if(story==='deal'){
  pile(c,740,365,7,51);chip(c,777,465,48,true,-.1);chip(c,716,491,48,false,.17);
  const a=ramp(t,.3,1.15),b=ramp(t,.8,1.65);
  if(a>0)card(c,114+(427-114)*a,840+(459-840)*a,-.55+(.37*a),ramp(t,2,2.65),'K','♥',1.16);
  if(b>0)card(c,820+(576-820)*b,820+(466-820)*b,.65-.48*b,ramp(t,2.7,3.35),'K','♠',1.16);
 }
 if(story==='merge'){
  const start=1.05,step=.43;let moved=0,lifted=0;
  for(let i=0;i<5;i++){if(t>=start+i*step+.62)moved++;if(t>=start+i*step)lifted++}
  pile(c,364,504,5-lifted,70,false);pile(c,610,504,5+moved,70,false);
  for(let i=0;i<5;i++){
   const p=(t-start-i*step)/.62;if(p<0||p>=1)continue;
   const u=ease(p),x=364+(610-364)*u,y=(504-(4-i)*9)*(1-u)+(504-(5+i)*9)*u-Math.sin(Math.PI*u)*100;
   shadow(c,x,532,95,28,.25);chip(c,x,y,70,false,Math.sin(Math.PI*u)*.09);
  }
  const settle=t>3.4&&t<4?Math.sin((t-3.4)*25)*Math.exp(-(t-3.4)*9)*.035:0;
  if(settle)chip(c,610,423,70,false,settle);
  chip(c,757,577,45,true,-.12);
 }
 if(story==='fan'){
  pile(c,745,418,5,46);const ranks=['10','J','Q','K','A'];
  for(let i=0;i<5;i++){
   const p=ramp(t,.65+i*.18,1.9+i*.18),a=(i-2)*.18*p;
   const x=482+(i-2)*72*p,y=510+Math.abs(i-2)*21*p;
   const reveal=ramp(t,2.3+i*.2,2.95+i*.2),lift=i===4?ramp(t,3.75,4.4)*25:0;
   card(c,x,y-lift,a,reveal,ranks[i],'♠',1.08);
  }
 }
 if(story==='roll'){
  card(c,544,481,-.2,1,'K','♠',1.03);card(c,636,478,.16,1,'K','♥',1.03);pile(c,765,537,4,44);
  const move=ramp(t,.35,2.65),x=-80+470*move,y=510+Math.sin(move*Math.PI)*18;
  const fall=ramp(t,2.65,3.9),wobble=fall<1?Math.sin(fall*18)*.1*(1-fall):0;
  shadow(c,x+15,y+40,75,24,.5);c.save();c.translate(x,y);c.rotate((1-fall)*-.18+wobble);c.scale(.22+.78*fall,1);chip(c,0,0,82,true,(1-move)*-7,.98-.51*fall);c.restore();
 }
}
function vignette(c){const v=c.createRadialGradient(W*.55,H*.55,200,W*.5,H*.5,610);v.addColorStop(0,'#0000');v.addColorStop(1,'#000b');c.fillStyle=v;c.fillRect(0,0,W,H)}
function draw(c,story,t){
 c.clearRect(0,0,W,H);c.drawImage(background,0,0);drawContent(c,story,t);vignette(c);
 const fade=t>8.1?Math.min(1,(t-8.1)/.55):t<.25?1-t/.25:0;
 if(fade){c.fillStyle=`rgba(3,8,9,${fade})`;c.fillRect(0,0,W,H)}
}

const background=document.createElement('canvas');background.width=W;background.height=H;bg(background.getContext('2d'));
const chipCache=new Map(),cardCache=new Map();
function chip(c,x,y,r=63,gold=false,angle=0,tilt=.47){
 if(tilt!==.47){paintChip(c,x,y,r,gold,angle,tilt);return}
 const key=r+':'+gold;let sprite=chipCache.get(key);
 if(!sprite){sprite=document.createElement('canvas');sprite.width=Math.ceil(r*2+64);sprite.height=Math.ceil(r*2*tilt+72);paintChip(sprite.getContext('2d'),sprite.width/2,sprite.height/2-5,r,gold,0,tilt);chipCache.set(key,sprite)}
 c.save();c.translate(x,y);c.rotate(angle);c.drawImage(sprite,-sprite.width/2,-sprite.height/2+5);c.restore();
}
function card(c,x,y,angle,face=1,rank='A',suit='♠',scale=1){
 const front=face>=.5,key=front?rank+suit:'back';let sprite=cardCache.get(key);
 if(!sprite){sprite=document.createElement('canvas');sprite.width=232;sprite.height=302;paintCard(sprite.getContext('2d'),108,140,0,front?1:0,rank,suit,1);cardCache.set(key,sprite)}
 c.save();c.translate(x,y);c.rotate(angle);c.scale(scale*Math.max(.025,Math.abs(Math.cos(face*Math.PI))),scale);c.drawImage(sprite,-108,-140);c.restore();
}

const scenes={
 'chip-merge-v2.svg':'deal','chip-deal-v2.svg':'merge','card-reveal-v2.svg':'fan','winning-card-v2.svg':'roll',
 'video-1.mp4':'deal','video-2.mp4':'roll','table-1.jpg':'deal','aces.jpg':'fan','chips.jpg':'merge',
 'globe-orbit.svg':'deal','chip-stack.svg':'merge','card-wave.svg':'fan','chip-constellation.svg':'roll',
};
export function motionSceneFor(source){
 const match=typeof source==='string'&&source.match(/media\/(?:scenes\/)?([^/?#]+)(?:[?#].*)?$/) /*FIXED-GH2: без привязки к началу пути — работает и в подпапке /KK/ на GitHub Pages, и на боевом домене*/;
 return match&&scenes[match[1]]||null;
}
const labels={deal:'Две карты раздаются и открываются',merge:'Фишки собираются из двух стопок в одну',fan:'Карты раскрываются в выигрышную комбинацию',roll:'Золотая фишка катится и ложится возле карт'};
const active=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let raf=0;
function schedule(){if(!raf&&!document.hidden&&active.size&&!reduced.matches)raf=requestAnimationFrame(tick)}
function tick(now){
 raf=0;
 for(const view of active){
  if(!view.isConnected){active.delete(view);continue}
  view.elapsed=(view.elapsed+Math.min(.06,(now-(view.last||now))/1000))%9;
  view.last=now;view.paint(view.elapsed);
 }
 schedule();
}
const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
 for(const entry of entries){
  const view=entry.target;view.last=0;
  if(entry.isIntersecting){active.add(view);view.paint(reduced.matches?5:view.elapsed)}
  else active.delete(view);
 }
 schedule();
},{rootMargin:'80px'}):null;
const resize='ResizeObserver' in window?new ResizeObserver(entries=>{for(const entry of entries)entry.target.fit()}):null;
class TournamentMotionCover extends HTMLElement{
 static observedAttributes=['scene'];
 constructor(){
  super();this.elapsed=1;this.last=0;
  const shadow=this.attachShadow({mode:'open'});
  shadow.innerHTML='<style>:host{display:block;overflow:hidden;background:#060b0c;position:relative}canvas{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}slot{display:none}</style><canvas aria-hidden="true"></canvas><slot></slot>';
  this.canvas=shadow.querySelector('canvas');this.ctx=this.canvas.getContext('2d',{alpha:false});
 }
 connectedCallback(){
  this.setAttribute('role','img');this.updateLabel();this.fit();
  resize?.observe(this);
  if(observer)observer.observe(this);else{active.add(this);schedule()}
 }
 disconnectedCallback(){observer?.unobserve(this);resize?.unobserve(this);active.delete(this);this.last=0}
 attributeChangedCallback(){this.updateLabel();if(this.isConnected)this.paint(reduced.matches?5:this.elapsed)}
 updateLabel(){this.setAttribute('aria-label',labels[this.getAttribute('scene')]||labels.deal)}
 fit(){
  const rect=this.getBoundingClientRect();
  const density=Math.min(window.devicePixelRatio||1,2),width=Math.min(1000,Math.max(360,Math.round(rect.width*density)));
  /* FIXED-3a (исправлено): было canvas.height=width*460/900 — всегда 900:460, а блоки .cover (390x230) и .poster (240x200) другие, отсюда обрезка и растяжение карт до +63%. Стало: высота = реальная высота блока. */
  if(this.canvas.width!==width||this.canvas.height!==Math.round(rect.height*density)){this.canvas.width=width;this.canvas.height=Math.max(200,Math.round(rect.height*density))}
  this.paint(reduced.matches?5:this.elapsed);
 }
 paint(t){
  if(!this.ctx)return;
  /* FIXED-3b (v2, исправлено): было scale(width/900, height/460)+translate(0,-220) — разный масштаб по X/Y = кривое растяжение.
     Первая версия v1 здесь центрировала кадр с ошибкой в формуле — на высоких блоках (десктоп) снизу оставалось чёрное поле.
     Стало (v2): контент — единый масштаб по ширине, кадр центрируется на картах (мировая y≈450):
     bitmap_y = s*world_y + ty, где ty = canvas.height/2 - 450*s. */
  /* FIXED-3c: если блок заметно выше сцены 900:738 (десктопная колонка «Ближайший турнир»),
     пустота НЕ остаётся: фон дорисовывается тем же фоновым полотном в режиме cover на весь блок,
     контент клипится по кадру сцены 900x738, чтобы карты из «закадровых» позиций раздачи не вылезали в заливке. */
  const cv=this.canvas,ctx=this.ctx,scene=this.getAttribute('scene')||'deal',t2=reduced.matches?5:t;
  const s=cv.width/900,cov=Math.max(cv.width/900,cv.height/738),ty=cv.height/2-450*s;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.save();ctx.setTransform(cov,0,0,cov,(cv.width-900*cov)/2,(cv.height-738*cov)/2);ctx.drawImage(background,0,0);ctx.restore();
  ctx.save();ctx.setTransform(s,0,0,s,0,ty);ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();drawContent(ctx,scene,t2);ctx.restore();
  ctx.save();ctx.setTransform(cov,0,0,cov,(cv.width-900*cov)/2,(cv.height-738*cov)/2);vignette(ctx);ctx.restore();
  const fade=reduced.matches?0:(t>8.1?Math.min(1,(t-8.1)/.55):t<.25?1-t/.25:0);
  if(fade){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=`rgba(3,8,9,${fade})`;ctx.fillRect(0,0,cv.width,cv.height)}
 }
}
if(!customElements.get('kk-motion-cover'))customElements.define('kk-motion-cover',TournamentMotionCover);
document.addEventListener('visibilitychange',()=>{for(const view of active)view.last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0}else schedule()});
reduced.addEventListener('change',()=>{for(const view of active){view.last=0;view.paint(reduced.matches?5:view.elapsed)}schedule()});
// The homepage API may replace its static images after the page has loaded.
// Upgrade only its own unmanaged media nodes; React renders the element itself.
function upgradeHomeImages(){
 if(!document.querySelector('#strip'))return;
 document.querySelectorAll('#cover>img,.poster>img,.club-live-banner>img').forEach(img=>{
  const scene=motionSceneFor(img.getAttribute('src'));if(!scene)return;
  const view=document.createElement('kk-motion-cover');view.setAttribute('scene',scene);
  if(img.className)view.className=img.className;
  if(img.getAttribute('style'))view.setAttribute('style',img.getAttribute('style'));
  img.replaceWith(view);view.append(img);
 });
}
upgradeHomeImages();
if(document.querySelector('#strip'))new MutationObserver(upgradeHomeImages).observe(document.body,{subtree:true,childList:true});
