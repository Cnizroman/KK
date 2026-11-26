(function(){
  var OK='cc_cookie_ok',DECLINE='cc_cookie_decline',POLICY='https://app.poker-clubkk.ru/cookies'
  function read(key){try{return window.localStorage.getItem(key)}catch(e){return null}}
  function write(key,value){try{window.localStorage.setItem(key,value);return true}catch(e){return false}}
  function drop(key){try{window.localStorage.removeItem(key)}catch(e){}}
  var METRIKA=114672576,metrikaLoaded=false
  function loadMetrika(){
    if(metrikaLoaded)return
    metrikaLoaded=true
    ;(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym')
    window.ym(METRIKA,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false})
  }
  var accepted=read(OK)==='1',declined=read(DECLINE)==='1'
  window.KK_ANALYTICS_ALLOWED=accepted&&!declined
  if(accepted&&!declined)loadMetrika()
  if(accepted||declined)return
  var css='.kk-cookie{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483000;max-width:560px;margin:0 auto;padding:16px 18px;border:1px solid rgba(230,201,115,.45);border-radius:14px;background:#07515d;color:#f5e8bd;font:400 14px/1.5 "Golos Text",system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.55)}'
   +'.kk-cookie p{margin:0 0 12px}.kk-cookie a{color:#e6c973;text-decoration:underline;text-underline-offset:3px}'
   +'.kk-cookie-actions{display:flex;flex-wrap:wrap;gap:10px}'
   +'.kk-cookie button{flex:1 1 140px;min-height:44px;padding:10px 16px;border-radius:999px;font-family:inherit;font-weight:600;font-size:14px;line-height:1.2;cursor:pointer;border:1px solid #e6c973;-webkit-tap-highlight-color:transparent}'
   +'.kk-cookie .kk-cookie-accept{background:#e6c973;color:#10211f}.kk-cookie .kk-cookie-necessary{background:transparent;color:#f5e8bd}'
   +'.kk-cookie button:focus-visible{outline:2px solid #f5e8bd;outline-offset:3px}'
  function show(){
    var style=document.createElement('style');style.textContent=css;document.head.appendChild(style)
    var box=document.createElement('div');box.className='kk-cookie';box.setAttribute('role','region');box.setAttribute('aria-label','Уведомление о cookie')
    box.innerHTML='<p>Мы используем cookie, чтобы сайт работал, и, если вы разрешите, аналитические cookie, чтобы улучшать его. Подробнее — в <a href="'+POLICY+'" target="_blank" rel="noopener">Политике cookie</a>.</p><div class="kk-cookie-actions"><button type="button" class="kk-cookie-accept">Принять</button><button type="button" class="kk-cookie-necessary">Только необходимые</button></div>'
    function choose(allow){
      if(allow){write(OK,'1');drop(DECLINE)}else{write(DECLINE,'1');drop(OK)}
      window.KK_ANALYTICS_ALLOWED=allow
      if(allow)loadMetrika()
      box.remove();style.remove()
      try{window.dispatchEvent(new CustomEvent('kk-cookie-choice',{detail:{analytics:allow}}))}catch(e){}
    }
    box.querySelector('.kk-cookie-accept').addEventListener('click',function(){choose(true)})
    box.querySelector('.kk-cookie-necessary').addEventListener('click',function(){choose(false)})
    document.body.appendChild(box)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show);else show()
})();
