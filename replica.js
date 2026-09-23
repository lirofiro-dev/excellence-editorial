/* Standalone navigation and explicit email handoff; no Wix runtime. */
function updateScrollbarWidth(){document.body.style.setProperty('--scrollbar-width',`${Math.max(0,window.innerWidth-document.documentElement.clientWidth)}px`);}
updateScrollbarWidth();window.addEventListener('resize',updateScrollbarWidth);

function createMobileHeader(){
  const page=document.body.dataset.page||'index';
  const header=document.createElement('header');
  header.className='mobile-header';
  header.innerHTML=`<a href="index.html" aria-label="Ir al inicio"><img class="mobile-header__logo" src="assets/bd6fd1_a212ac800b834d38961d80bcb0938b9a~mv2.png" alt="Excellence Editorial"></a><button class="mobile-header__toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation" aria-label="Abrir menú"><span aria-hidden="true">☰</span></button><nav class="mobile-header__nav" id="mobile-navigation" aria-label="Navegación móvil"><a href="index.html#comp-mckbp4q6">Colegios</a><a href="libros.html">Libros</a><a href="index.html#comp-mcphjuzc">Talleres</a><a href="index.html#comp-mcpnldwh">Capacitaciones</a><a href="contacto.html">Contacto</a></nav>`;
  document.body.prepend(header);
  const toggle=header.querySelector('.mobile-header__toggle');
  const icon=toggle.querySelector('span');
  const close=()=>{header.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');icon.textContent='☰';};
  toggle.addEventListener('click',()=>{
    const open=!header.classList.contains('is-open');
    header.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
    icon.textContent=open?'×':'☰';
  });
  header.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
  window.addEventListener('resize',()=>{if(window.innerWidth>=768)close();});
  const current=header.querySelector(page==='libros'?'a[href="libros.html"]':page==='contacto'?'a[href="contacto.html"]':'a[href="index.html#comp-mckbp4q6"]');
  current?.setAttribute('aria-current','page');
}
createMobileHeader();
// Reuse the original per-component keyframes, delays, easing and directions.
// Keep static content visible when JavaScript, CSS inspection or observation
// is unavailable. Observe the untransformed layout box, not a clipped frame.
function restoreOriginalAnimations(){
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!('IntersectionObserver' in window))return;
  const ids=new Set();
  function collect(rules){
    for(const rule of rules){
      if(rule.selectorText?.includes('[data-motion-enter="done"]')){
        for(const match of rule.selectorText.matchAll(/#(comp-[\w-]+):not\(\[data-motion-enter="done"\]\)/g))ids.add(match[1]);
      }
      if(rule.cssRules)collect(rule.cssRules);
    }
  }
  for(const sheet of document.styleSheets){try{collect(sheet.cssRules);}catch{/* Ignore inaccessible optional stylesheets. */}}
  const elements=[...ids].map(id=>document.getElementById(id)).filter(Boolean);
  const timers=new Map();
  function finish(element){
    clearTimeout(timers.get(element));timers.delete(element);
    element.dataset.motionEnter='done';delete element.dataset.replicaMotion;
  }
  const seconds=value=>value.trim().endsWith('ms')?parseFloat(value):parseFloat(value)*1000;
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const element=entry.target;observer.unobserve(element);
      if(preference.matches){finish(element);continue;}
      element.style.setProperty('--motion-width',`${element.offsetWidth}px`);
      element.style.setProperty('--motion-height',`${element.offsetHeight}px`);
      delete element.dataset.replicaMotion;element.dataset.motionEnter='playing';
      const style=getComputedStyle(element);
      const durations=style.animationDuration.split(',').map(seconds);
      const delays=style.animationDelay.split(',').map(seconds);
      const deadline=Math.max(0,...durations.map((duration,i)=>duration+delays[i%delays.length]));
      timers.set(element,setTimeout(()=>finish(element),deadline+100));
    }
  },{threshold:0});
  for(const element of elements){element.dataset.replicaMotion='waiting';observer.observe(element);}
  preference.addEventListener('change',event=>{
    if(event.matches){observer.disconnect();elements.forEach(finish);}
  });
  window.addEventListener('pagehide',()=>{observer.disconnect();elements.forEach(finish);},{once:true});
}
restoreOriginalAnimations();
document.querySelectorAll('[data-destination]').forEach(button=>button.addEventListener('click',()=>{window.location.href=button.dataset.destination;}));
function showEmailNotice(address){
  document.querySelector('.replica-notice')?.remove();
  const notice=document.createElement('div');notice.className='replica-notice';notice.setAttribute('role','status');
  const message=document.createElement('p');message.textContent='Este formulario prepara un correo; no lo envía automáticamente. Revisa el mensaje en tu aplicación de correo y pulsa Enviar. Si no se abre, escríbenos a ';
  const link=document.createElement('a');link.href='mailto:'+address;link.textContent=address;message.append(link);
  const close=document.createElement('button');close.type='button';close.textContent='Entendido';close.addEventListener('click',()=>notice.remove());notice.append(message,close);document.body.append(notice);
}
document.querySelectorAll('form[data-email]').forEach(form=>{
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form);const contact=Boolean(form.querySelector('textarea'));
    const subject=contact?'Solicitud de ejemplares — Excellence Editorial':'Solicitud de suscripción — Excellence Editorial';
    const body=contact?`Nombre: ${data.get('first-name')||''} ${data.get('last-name')||''}\nCorreo: ${data.get('email')||''}\n\n${data.get('message')||''}`:`Deseo recibir información de Excellence Editorial.\nMi correo: ${data.get('email')||''}`;
    showEmailNotice(form.dataset.email);
    window.location.href=`mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
