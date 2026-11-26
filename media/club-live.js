(function(){
 var app='https://app.poker-clubkk.ru',first=null;
 var track=document.querySelector('#track'),template=track.querySelector('.film').cloneNode(true);
 var status=document.querySelector('#club-data-status'),retry=document.querySelector('#club-data-retry');
 function appURL(path){return path&&path.charAt(0)==='/'&&path.charAt(1)!=='/'?app+path:path}
 function set(selector,value){var el=document.querySelector(selector);if(el)el.textContent=value}
 function moscowDay(t){return new Date(t).toLocaleDateString('en-CA',{timeZone:'Europe/Moscow'})}
 function dayWord(at){var day=moscowDay(at);return day===moscowDay(Date.now())?'Сегодня':day===moscowDay(Date.now()+864e5)?'Завтра':''}
 function whenText(at){var word=dayWord(at);return (word?word+', ':'')+new Date(at).toLocaleString('ru-RU',{timeZone:'Europe/Moscow',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})+' МСК'}
 function num(n){return Number(n||0).toLocaleString('ru-RU')}
 var FACT_ICONS={stack:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="6.5" rx="7.5" ry="3"/><path d="M4.5 6.5v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-5"/><path d="M4.5 11.5v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-5"/></svg>',blinds:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8.5" cy="15" r="4.5"/><circle cx="15.5" cy="9" r="5.5"/><circle cx="15.5" cy="9" r="2.2"/></svg>',hourglass:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h10M7 21h10"/><path d="M8 3c0 5 4 5.5 4 9s-4 4-4 9"/><path d="M16 3c0 5-4 5.5-4 9s4 4 4 9"/></svg>'}
 function facts(t){var out=[],blind=(t.blinds||[]).filter(function(l){return !l.break})[0];if(t.entry_points>0)out.push(['Стек',num(t.entry_points)+' фишек','stack',num(t.entry_points)]);if(blind){out.push(['Блайнды',num(blind.sb)+' / '+num(blind.bb),'blinds',num(blind.sb)+' / '+num(blind.bb)]);out.push(['Уровень',blind.min+' мин','hourglass',blind.min+' мин'])}return out}
 document.addEventListener('click',function(e){var join=e.target.closest('#join'),film=e.target.closest('.film');if(join||film){e.preventDefault();e.stopImmediatePropagation();location.href=join?(first?app+'/tournament-'+first.id:app+'/tournaments'):(film.dataset.clubUrl||app+'/tournaments')}},true);
 var active=null;
 async function load(){
 if(active)return;
 active=new AbortController();var timer=setTimeout(function(){active&&active.abort()},8000);
 document.documentElement.dataset.clubState='loading';
 if(status){status.hidden=false;status.firstElementChild.textContent='Получаем расписание клуба…'}if(retry)retry.hidden=true;
 try{
  var response=await fetch('api/public.json' /*FIXED-GH1: на GitHub Pages нет сервера /api — берём снимок данных из файла*/,{cache:'no-store',signal:active.signal});if(!response.ok)throw new Error('API unavailable');
  var data=await response.json();window.KK_PUBLIC=data;
  var club=data.clubs[0],address=club?club.city+', '+club.address:'Краснодар, ул. 1 Мая, 498';
  function makeMedia(m){
   var legacy={'video-1.mp4':'chip-merge-v2','video-2.mp4':'winning-card-v2','table-1.jpg':'chip-merge-v2','aces.jpg':'card-reveal-v2','chips.jpg':'chip-deal-v2','globe-orbit.svg':'chip-merge-v2','chip-stack.svg':'chip-deal-v2','card-wave.svg':'card-reveal-v2','chip-constellation.svg':'winning-card-v2'};
   var demo=m.src&&m.src.match(/^(?:\.\/|\/)media\/(?:scenes\/)?([^/?#]+)$/),scene=demo&&legacy[demo[1]];
   if(scene)m={type:'img',src:'/media/scenes/'+scene+'.svg'};
   var motions={'chip-merge-v2.svg':'deal','chip-deal-v2.svg':'merge','card-reveal-v2.svg':'fan','winning-card-v2.svg':'roll'};
   var name=m.src&&m.src.split('/').pop().split('?')[0],motion=motions[name];
   if(motion){var view=document.createElement('kk-motion-cover');view.setAttribute('scene',motion);return view}
   var el=document.createElement(m.type==='video'?'video':'img');el.src=m.src;
   if(m.type==='video'){el.muted=true;el.autoplay=false;el.loop=true;el.playsInline=true;el.preload='none';el.poster=m.poster||'';if(window.vio)window.vio.observe(el)}else{el.alt='';el.loading='lazy';el.decoding='async'}return el
  }
  if(club){
   set('#find .addr',club.address);set('#find .contact',[club.directions,club.hours,club.phone,club.email,club.support].filter(Boolean).join(' · ')||'Подробности входа и контакты уточните у организатора.');
   document.querySelectorAll('#find .maps a').forEach(function(a,i){a.href=i===0?'https://yandex.ru/maps/?ll=39.019806%2C45.094105&z=17&pt=39.019806%2C45.094105%2Cpm2rdm':['','https://2gis.ru/krasnodar/search/','https://www.google.com/maps/search/?api=1&query='][i]+encodeURIComponent('Краснодар, ул. 1 Мая, 498')})
  }
  document.querySelectorAll('.club-live-banners').forEach(function(el){el.remove()});
  if(data.banners.length){
   var section=document.createElement('section');section.className='sec club-live-banners';section.setAttribute('aria-label','Новости клуба');
   data.banners.sort(function(a,b){return a.order-b.order}).forEach(function(b){var a=document.createElement(b.link?'a':'div');a.className='club-live-banner';if(b.link)a.href=appURL(b.link);var media=b.media||{type:'img',src:b.image};if(media.src)a.append(makeMedia(media));var span=document.createElement('span');span.className='kick';span.textContent=b.label;var h=document.createElement('h3');h.textContent=b.title;var p=document.createElement('p');p.textContent=b.description;a.append(span,h,p);section.append(a)});
   document.querySelector('#strip').before(section)
  }
  var upcoming=data.live?data.tournaments.filter(function(t){return t.status!=='completed'}):[];first=upcoming[0]||null;
  window.KK_LIVE_NEXT=first||{at:Date.now(),taken:0,seats:1};
  document.querySelector('#cd').style.visibility=first?'visible':'hidden';
  if(first){
   if(first.media&&first.media.src){var cover=document.querySelector('#cover');if(cover)cover.replaceChildren(makeMedia(first.media))}
   set('#next h2',first.title);set('#next [data-tour-date]',whenText(first.at));set('#next .meta div:nth-child(2) b',address);set('#next .meta div:nth-child(4) b',first.format);document.querySelectorAll('#next .meta .live-fact').forEach(function(el){el.remove()});facts(first).forEach(function(f){var box=document.createElement('div'),label=document.createElement('small'),value=document.createElement('b');box.className='live-fact';label.textContent=f[0];value.textContent=f[1];box.append(label,value);document.querySelector('#next .meta').append(box)});
   var em=document.querySelector('#next .avs em'),count=document.createElement('b');count.id='seatn';count.textContent=first.taken;em.replaceChildren(count,document.createTextNode(' из '+first.seats+' мест занято'));document.querySelector('#seatbar').style.width=(first.taken/first.seats*100)+'%';
  }else{document.querySelectorAll('#next .meta .live-fact').forEach(function(el){el.remove()});set('#next h2','Новые игры скоро');set('#next [data-tour-date]','Расписание готовится');set('#seatn','0');set('#next .meta div:nth-child(4) b','—');document.querySelector('#seatbar').style.width='0%'}
  track.replaceChildren();
  (upcoming.length?upcoming:[null]).forEach(function(t,i){var el=template.cloneNode(true);el.style.transform='';el.style.opacity='';el.dataset.clubUrl=t?app+'/tournament-'+t.id:app+'/tournaments';el.querySelector('h3').textContent=t?t.title:'Расписание готовится';el.querySelector('p').textContent=t?whenText(t.at):'Новые турниры появятся здесь';if(t&&facts(t).length){var info=document.createElement('p');info.className='club-live-facts';facts(t).forEach(function(f){var item=document.createElement('span');item.title=f[0];item.insertAdjacentHTML('beforeend',FACT_ICONS[f[2]]);item.append(document.createTextNode(f[3]));info.append(item)});el.querySelector('p').after(info)}el.querySelector('.poster>b').textContent=String(i+1).padStart(2,'0');el.querySelector('.seats i').style.setProperty('--w',t?t.taken/t.seats*100+'%':'0%');el.querySelector('small').textContent=t?t.taken+' / '+t.seats+' мест':'Следите за новостями';var media=el.querySelector('.poster>kk-motion-cover,.poster>img,.poster>video');if(media&&t&&t.media&&t.media.src){media.replaceWith(makeMedia(t.media))}track.append(el)});
  var rating=data.ratings.season;
  document.querySelectorAll('#rating .pl').forEach(function(el){var i=el.classList.contains('p1')?0:el.classList.contains('p2')?1:2,p=rating[i];el.querySelector('small').textContent=p?p.n:'—';var avatar=el.querySelector('.a');if(p){avatar.style.visibility='visible';avatar.style.backgroundImage='url('+(p.avatar_image||'/media/art/kk-avatars-v3.webp')+')';avatar.style.backgroundSize=p.avatar_image?'cover':'400% 200%';avatar.style.backgroundPosition=p.avatar_image?'center':(p.avatar%4/3*100)+'% '+(Math.floor(p.avatar/4)*100)+'%'}else avatar.style.visibility='hidden'});
  document.querySelectorAll('#rating .row').forEach(function(el,i){var p=rating[i+3];el.classList.remove('me');el.querySelector('span').textContent=p?p.n:'Место свободно';el.querySelector('em').textContent=p?Number(p.p).toLocaleString('ru-RU'):'—'});
  set('#rating>.kick',data.season||'Рейтинг сезона');
  var profile=document.querySelector('#profile');
  if(profile){profile.querySelectorAll('.stats b').forEach(function(el){el.textContent='—'});set('#profile .prof p','Профиль на этом устройстве · вход игрока скоро');profile.querySelectorAll('.lvl,.med').forEach(function(el){el.style.opacity='.3'});var level=profile.querySelector('.prof+div');if(level)level.textContent='Серверная статистика появится после входа игрока'}
  document.querySelectorAll('#quests .q').forEach(function(el){el.style.opacity='.45';el.querySelector('.pts').textContent='Скоро';el.querySelector('.ring>span:not(.ambient-ring-orbit)').textContent='—';el.querySelector('p').textContent='Условия готовятся'});
  var stats=data.stats||{};document.querySelectorAll('#nums b[data-n]').forEach(function(el,i){el.dataset.n=[rating.length,stats.completed||0,stats.awards||0][i];el.textContent=Number(el.dataset.n).toLocaleString('ru-RU')});set('#nums .num:nth-child(2) p','турниров проведено');
  document.documentElement.dataset.clubState='ready';if(status)status.hidden=true;
  if(window.ScrollTrigger)ScrollTrigger.refresh();
 }catch(error){
  document.documentElement.dataset.clubState='error';
  if(status){status.hidden=false;status.firstElementChild.textContent='Не удалось обновить расписание. Проверьте соединение и попробуйте ещё раз.'}if(retry)retry.hidden=false;
  if(!window.KK_PUBLIC){set('#next h2','Расписание недоступно');set('#next [data-tour-date]','Попробуйте позже');var title=track.querySelector('h3');if(title)title.textContent='Расписание недоступно'}
 }finally{clearTimeout(timer);active=null}
 }
 if(retry)retry.addEventListener('click',load);
 load();
})();
