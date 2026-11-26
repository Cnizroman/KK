(function(){
 'use strict';
 var selector='.motion-art,.ornament,.ambient-ring-orbit',watched=new Set();
 function visibility(){document.documentElement.classList.toggle('art-motion-paused',document.hidden)}
 document.addEventListener('visibilitychange',visibility);visibility();
 if(!('IntersectionObserver' in window))return;
 var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){entry.target.toggleAttribute('data-ambient-paused',!entry.isIntersecting)})},{rootMargin:'80px'});
 function elements(root){if(root.nodeType!==1)return [];return (root.matches(selector)?[root]:[]).concat(Array.from(root.querySelectorAll(selector)))}
 function add(root){elements(root).forEach(function(el){if(!watched.has(el)){watched.add(el);observer.observe(el)}})}
 function remove(root){elements(root).forEach(function(el){if(!el.isConnected&&watched.has(el)){observer.unobserve(el);watched.delete(el)}})}
 function start(){
  add(document.body);
  new MutationObserver(function(records){records.forEach(function(record){record.removedNodes.forEach(remove);record.addedNodes.forEach(add)})}).observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
