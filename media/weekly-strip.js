(function(){
 'use strict';
 window.KKWeeklyStrip={setup:function(){
  var viewport=document.getElementById('stripViewport'),track=document.getElementById('track');
  var timeline=null,trigger=null,proxy={offset:0},lastDriven=0,pending=null;
  function distance(){return Math.max(0,track.scrollWidth-viewport.clientWidth)}
  function clamp(value){return Math.max(0,Math.min(distance(),value))}
  function paint(){
   lastDriven=clamp(proxy.offset);
   // Avoid assigning during native touch momentum when both inputs already agree.
   if(Math.abs(viewport.scrollLeft-lastDriven)>.75)viewport.scrollLeft=lastDriven;
  }
  function sync(progress){
   pending=null;
   if(window.KK_RETURNING_HOME)return;
   window.scrollTo({top:trigger.start+progress*(trigger.end-trigger.start),behavior:'instant'});
   window.ScrollTrigger.update();
   var scrub=trigger.getTween();if(scrub)scrub.progress(1);
   timeline.progress(progress);
  }
  function enter(){if(window.KK_RETURNING_HOME){pending=null;return}if(pending!==null&&timeline){var p=pending;sync(p)}}
  function finishScrub(){if(trigger&&trigger.isActive){var tween=trigger.getTween();if(tween)tween.progress(1)}}
  viewport.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)>Math.abs(e.deltaY))finishScrub()},{passive:true});
  viewport.addEventListener('scroll',function(){
   if(window.KK_RETURNING_HOME){pending=null;return}
   if(!timeline||!distance()||Math.abs(viewport.scrollLeft-lastDriven)<1)return;
   var progress=clamp(viewport.scrollLeft)/distance();
   if(trigger.isActive)sync(progress);
   else{pending=progress;timeline.progress(progress)}
  },{passive:true});

  // Touch and trackpad scrolling stay native. Add the same gesture for a mouse.
  var pointer=null,dragged=false;
  viewport.addEventListener('pointerdown',function(e){
   finishScrub();
   dragged=false;
   if(e.pointerType!=='mouse'||e.button!==0)return;
   pointer={id:e.pointerId,x:e.clientX,y:e.clientY,left:viewport.scrollLeft};
  });
  viewport.addEventListener('pointermove',function(e){
   if(!pointer||pointer.id!==e.pointerId)return;
   var dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
   if(!dragged){
    if(Math.abs(dx)<7||Math.abs(dx)<=Math.abs(dy))return;
    dragged=true;viewport.setPointerCapture(e.pointerId);viewport.classList.add('is-dragging');
   }
   e.preventDefault();viewport.scrollLeft=clamp(pointer.left-dx);
  });
  function release(){pointer=null;viewport.classList.remove('is-dragging')}
  viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);
  viewport.addEventListener('lostpointercapture',release);
  viewport.addEventListener('pointerleave',function(){if(!dragged)release()});
  viewport.addEventListener('click',function(e){if(dragged){e.preventDefault();e.stopImmediatePropagation();dragged=false}},true);
  viewport.querySelectorAll('img').forEach(function(img){img.draggable=false});

  return {track:track,attach:function(gsap,ScrollTrigger){
   timeline=gsap.timeline({scrollTrigger:{id:'weekly-strip',trigger:'#strip',start:'top top',end:function(){return '+='+Math.max(1,distance()*1.4)},scrub:1,pin:true,invalidateOnRefresh:true,onEnter:enter,onEnterBack:enter,onRefresh:function(){if(pending!==null&&timeline)timeline.progress(pending)}}});
   trigger=timeline.scrollTrigger;
   timeline.fromTo(proxy,{offset:0},{offset:distance,ease:'none',onUpdate:paint},0).to('#prog',{width:'100%',ease:'none'},0);
   return timeline;
  }};
 }};
})();
