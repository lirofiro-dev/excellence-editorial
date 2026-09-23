const routePaths={home:'/',colegios:'/colegios/',libros:'/libros/',talleres:'/talleres/',capacitaciones:'/capacitaciones/',alianzas:'/alianzas/',contacto:'/contacto/'};
const routeTitles={home:'Excellence Editorial',colegios:'Colegios | Excellence Editorial',libros:'Libros | Excellence Editorial',talleres:'Talleres | Excellence Editorial',capacitaciones:'Capacitaciones | Excellence Editorial',alianzas:'Alianzas | Excellence Editorial',contacto:'Contacto | Excellence Editorial'};
const desktopTargets={home:'comp-mcqs63ou',colegios:'comp-mckbp4q6',talleres:'comp-mcphjuzc',capacitaciones:'comp-mcpnldwh',alianzas:'comp-mcpnh92y'};

function routeFromPath(pathname){
  const clean=pathname.replace(/\/index\.html$/,'/').replace(/\/+/g,'/');
  if(clean.endsWith('/libros.html')||clean.endsWith('/libros/'))return'libros';
  if(clean.endsWith('/contacto.html')||clean.endsWith('/contacto/'))return'contacto';
  for(const name of ['colegios','talleres','capacitaciones','alianzas'])if(clean.endsWith(`/${name}/`))return name;
  return'home';
}

const currentRoute=routeFromPath(location.pathname);

function normalizeAddress(){
  const legacy=/\/(index|libros|contacto)\.html$/i.test(location.pathname);
  const webProtocol=location.protocol==='http:'||location.protocol==='https:';
  if(legacy&&webProtocol)history.replaceState(null,'',routePaths[currentRoute]+location.search);
  document.title=routeTitles[currentRoute];
  if(webProtocol){
    const publicUrl=`${location.origin}${routePaths[currentRoute]}`;
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',publicUrl);
    let canonical=document.querySelector('link[rel="canonical"]');
    if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}
    canonical.href=publicUrl;
  }
}

function cleanDestination(value){
  if(!value)return value;
  const normalized=value.replace(/^https?:\/\/[^/]+\//,'');
  const map={
    'index.html':'/',
    'index.html#comp-mckbp4q6':'/colegios/',
    'index.html#comp-mcphjuzc':'/talleres/',
    'index.html#comp-mcpnldwh':'/capacitaciones/',
    'index.html#comp-mcpnh92y':'/alianzas/',
    'libros.html':'/libros/',
    'contacto.html':'/contacto/'
  };
  return map[normalized]||value;
}

function normalizeLinks(){
  document.querySelectorAll('a[href]').forEach(link=>{
    const clean=cleanDestination(link.getAttribute('href'));
    if(clean)link.setAttribute('href',clean);
  });
  document.querySelectorAll('[data-destination]').forEach(button=>{
    button.dataset.destination=cleanDestination(button.dataset.destination);
  });
}

function updateScrollbarWidth(){
  document.body.style.setProperty('--scrollbar-width',`${Math.max(0,window.innerWidth-document.documentElement.clientWidth)}px`);
}

function mobileHeader(){
  const header=document.createElement('header');
  header.className='mobile-header';
  header.innerHTML=`
    <a href="/" aria-label="Ir al inicio"><img class="mobile-header__logo" src="assets/bd6fd1_a212ac800b834d38961d80bcb0938b9a~mv2.png" alt="Excellence Editorial"></a>
    <button class="mobile-header__toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation" aria-label="Abrir menú"><span aria-hidden="true">☰</span></button>
    <nav class="mobile-header__nav" id="mobile-navigation" aria-label="Navegación móvil">
      <a href="/colegios/" data-nav="colegios">Colegios</a>
      <a href="/libros/" data-nav="libros">Libros</a>
      <a href="/talleres/" data-nav="talleres">Talleres</a>
      <a href="/capacitaciones/" data-nav="capacitaciones">Capacitaciones</a>
      <a href="/alianzas/" data-nav="alianzas">Alianzas</a>
      <a href="/contacto/" data-nav="contacto">Contacto</a>
    </nav>`;
  document.body.prepend(header);
  const toggle=header.querySelector('.mobile-header__toggle');
  const icon=toggle.querySelector('span');
  const close=()=>{
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir menú');
    icon.textContent='☰';
  };
  toggle.addEventListener('click',()=>{
    const open=!header.classList.contains('is-open');
    header.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
    icon.textContent=open?'×':'☰';
  });
  header.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  header.querySelector(`[data-nav="${currentRoute}"]`)?.setAttribute('aria-current','page');
  document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
  window.addEventListener('resize',()=>{if(window.innerWidth>900)close();});
  return header;
}

const announcement=`<div class="mobile-announcement">¡Nuestra colección <strong>2027</strong> de libros de inglés ya está aquí! <a href="/libros/">Aprende en grande.</a></div>`;

const newsletter=`
  <section class="mobile-newsletter mobile-reveal">
    <h2>Conocé más sobre Excellence Editorial</h2>
    <p>Dejanos tu correo y te contactaremos con información para tu institución.</p>
    <form class="mobile-form" data-email="info@excellenceeditorial.com" method="post">
      <input name="email" type="email" aria-label="Correo electrónico" placeholder="Ingresa tu correo aquí" required>
      <button type="submit">¡Únete!</button>
    </form>
  </section>`;

const mobileFooter=`
  <footer class="mobile-footer">
    <strong>Excellence Editorial</strong>
    <a href="mailto:info@excellenceeditorial.com">info@excellenceeditorial.com</a><br>
    <span>© 2027 Excellence Editorial.</span>
  </footer>`;

function homeMobile(){
  return`${announcement}
  <main>
    <section class="mobile-section mobile-section--cream mobile-reveal" data-route="home">
      <img class="mobile-signature" src="assets/index/Logos%20%26%20Tarjetas%20%285%29_edited.png" alt="Libros hechos con el corazón">
      <h1 class="mobile-title">Hechos con el corazón para el <em>niño guatemalteco</em>.</h1>
      <p class="mobile-subtitle">Libros de inglés creados en Guatemala para acompañar el aprendizaje de nuestros niños y jóvenes.</p>
      <a class="mobile-button" href="/libros/">¡Conoce más!</a>
      <img class="mobile-hero__art" src="assets/index/bd6fd1_c1fa4e05ac4d4c5c831d32585fac4c1f~mv2.png" alt="Estudiante de Excellence Editorial">
    </section>

    <section class="mobile-section mobile-section--purple mobile-section--tight mobile-reveal">
      <blockquote class="mobile-quote">“Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world.”<cite>Harriet Tubman</cite></blockquote>
    </section>

    <section class="mobile-section mobile-reveal" data-route="colegios">
      <p class="mobile-kicker">Para los colegios de nuestro país</p>
      <h2 class="mobile-title">Acompañamos a los <em>colegios</em> de Guatemala.</h2>
      <p class="mobile-subtitle">En Excellence Editorial apoyamos a los colegios privados en su meta de mantener y elevar el nivel de inglés de sus instituciones.</p>
      <div class="mobile-grid">
        <article class="mobile-card">
          <h3>Material educativo exclusivo</h3>
          <p>Creado específicamente para las aulas de nuestro país por docentes guatemaltecos con más de 20 años de experiencia y arraigado a nuestra cultura.</p>
        </article>
        <article class="mobile-card">
          <h3>Respaldo durante todo el año</h3>
          <p>Acompañamos a cada institución mediante talleres, capacitaciones y asesoría pedagógica integral.</p>
        </article>
        <article class="mobile-card">
          <h3>Solidez metodológica</h3>
          <p>Nuestros libros se alinean con altos estándares y pasan por un riguroso proceso editorial y de revisión docente.</p>
        </article>
      </div>
    </section>

    <section class="mobile-section mobile-section--lavender mobile-reveal" data-route="talleres">
      <p class="mobile-kicker">Febrero – Septiembre</p>
      <h2 class="mobile-title"><em>Talleres</em> para docentes</h2>
      <div class="mobile-grid">
        <article class="mobile-card"><h3>Metodologías activas y motivadoras</h3><p>Exploramos aprendizaje cooperativo, juegos de rol y rutinas de pensamiento rápido que mantienen al estudiante involucrado y pueden aplicarse en la siguiente lección.</p></article>
        <article class="mobile-card"><h3>Comprensión del estudiante guatemalteco</h3><p>Trabajamos con casos reales y ejercicios de empatía para conectar las actividades con los intereses, realidades y estilos de aprendizaje del alumno.</p></article>
        <article class="mobile-card"><h3>Solución de retos cotidianos</h3><p>Compartimos estrategias prácticas para grupos numerosos, recursos limitados y niveles heterogéneos, con herramientas listas para utilizar en el aula.</p></article>
      </div>
    </section>

    <section class="mobile-section mobile-section--dark mobile-reveal" data-route="capacitaciones">
      <p class="mobile-kicker">Enero – Mayo</p>
      <h2 class="mobile-title"><em>Capacitaciones</em> y acompañamiento</h2>
      <div class="mobile-grid">
        <article class="mobile-card"><h3>Integración estratégica del material</h3><p>Mostramos cómo insertar cada sección del libro en la planificación diaria, secuenciar contenidos y aprovechar ilustraciones y ejercicios graduados.</p></article>
        <article class="mobile-card"><h3>Alineación con la práctica docente</h3><p>Vinculamos la metodología actual del profesor con las herramientas del libro, sin alterar el estilo que ya funciona en su aula.</p></article>
        <article class="mobile-card"><h3>Evaluación y soporte continuo</h3><p>Orientamos la creación de evaluaciones basadas en el libro y mantenemos encuentros periódicos para resolver dudas y brindar retroalimentación.</p></article>
      </div>
    </section>

    <section class="mobile-section mobile-section--cream mobile-reveal" data-route="alianzas">
      <p class="mobile-kicker">Alianzas</p>
      <h2 class="mobile-title">Crecemos junto a cada <em>institución</em>.</h2>
      <p class="mobile-subtitle">Creamos alianzas con los colegios para acompañar sus proyectos educativos. Ofrecemos materiales y apoyo pedagógico, con condiciones de colaboración adaptadas a cada institución.</p>
      <a class="mobile-button" href="/contacto/">¡Contáctanos!</a>
    </section>
  </main>${newsletter}${mobileFooter}`;
}

function booksMobile(){
  return`${announcement}
  <main>
    <section class="mobile-section mobile-section--cream mobile-reveal" data-route="libros">
      <p class="mobile-kicker">Colección 2027</p>
      <h1 class="mobile-title">Cada página refleja más de <em>20 años</em> de experiencia docente.</h1>
      <p class="mobile-subtitle">Nuestros libros, creados por docentes guatemaltecos, están diseñados para que los niños de nuestro país aprendan inglés de forma natural a partir de su lengua materna.</p>
      <img class="mobile-hero__art" src="assets/libros/bd6fd1_adcaccdd0d574918a40b1f834c51fb92~mv2.png" alt="Niños aprendiendo con Excellence Editorial">
    </section>

    <section class="mobile-section mobile-section--lavender mobile-reveal">
      <p class="mobile-kicker">Preprimaria, primaria, básicos y bachillerato</p>
      <h2 class="mobile-title">Una colección para cada <em>etapa</em>.</h2>
      <div class="mobile-book-list">
        <figure class="mobile-book"><figcaption>Libro 1</figcaption><img src="assets/catalogo/preprimaria.png" alt="Portada Pre School, preprimaria — Libro 1"></figure>
        <figure class="mobile-book"><figcaption>Libro 4</figcaption><img src="assets/catalogo/primaria.png" alt="Portada Elementary, primaria — Libro 4"></figure>
        <figure class="mobile-book"><figcaption>Libro 11</figcaption><img src="assets/catalogo/bachillerato.png" alt="Portada High School, bachillerato — Libro 11"></figure>
      </div>
      <div class="mobile-stat"><div><strong>8</strong><span>unidades</span></div><div><strong>4</strong><span>secciones</span></div></div>
    </section>

    <section class="mobile-section mobile-reveal">
      <p class="mobile-kicker">Nuestra metodología</p>
      <h2 class="mobile-title">Aprendizaje claro y <em>progresivo</em>.</h2>
      <div class="mobile-grid mobile-grid--two">
        <article class="mobile-card"><h3>Vocabulary</h3><p>Potenciamos el léxico con láminas que agrupan palabras por campos semánticos, activan la memoria visual y conectan el vocabulario con saberes previos.</p></article>
        <article class="mobile-card"><h3>Grammar</h3><p>Presentamos la estructura con un enfoque espiral y guiamos al estudiante de la observación a la producción autónoma mediante ejercicios graduados.</p></article>
        <article class="mobile-card"><h3>Reading</h3><p>Utilizamos narrativas secuenciadas que invitan a inferir, anticipar y relacionar eventos para fortalecer la comprensión lógica del texto.</p></article>
        <article class="mobile-card"><h3>Conversation</h3><p>Modelamos diálogos que ayudan a formular y responder preguntas esenciales, fomentando una fluidez auténtica.</p></article>
      </div>
    </section>

    <section class="mobile-section mobile-section--purple mobile-reveal">
      <p class="mobile-kicker">Nuestro compromiso</p>
      <h2 class="mobile-title">Libros accesibles para <em>todos</em>.</h2>
      <p class="mobile-subtitle">Nuestros materiales reflejan el compromiso de Excellence Editorial con los colegios y las familias guatemaltecas.</p>
      <a class="mobile-button mobile-button--light" href="/contacto/">Solicitá ejemplares</a>
    </section>

    <section class="mobile-section mobile-section--tight mobile-reveal">
      <blockquote class="mobile-quote">“La noche había caído. Yo había soltado las herramientas y me importaba bien poco el martillo, el perno, la sed y la muerte. ¡Había en una estrella, en un planeta —el mío, la Tierra—, un principito a quien consolar!”<cite>Antoine de Saint-Exupéry, El principito</cite></blockquote>
    </section>
  </main>${newsletter}${mobileFooter}`;
}

function contactMobile(){
  return`<main>
    <section class="mobile-section mobile-section--dark mobile-reveal" data-route="contacto">
      <p class="mobile-kicker">Contacto</p>
      <h1 class="mobile-title">Escríbenos.</h1>
      <p class="mobile-subtitle">Contáctanos por WhatsApp o por correo electrónico si tienes alguna duda; responderemos lo antes posible.</p>
      <div class="mobile-contact-list">
        <a class="mobile-contact-link" href="https://wa.me/50251349037" target="_blank" rel="noreferrer noopener"><img src="assets/contacto/bd6fd1_1f8c6aef61a44070a6cf2b8dda305384~mv2.png" alt="WhatsApp"><span><strong>WhatsApp</strong><span>+502 5134 9037</span></span></a>
        <a class="mobile-contact-link" href="mailto:info@excellenceeditorial.com"><img src="assets/contacto/bd6fd1_db55b83642e7449e8e267ddb12e876b3~mv2.png" alt="Correo"><span><strong>Correo electrónico</strong><span>info@excellenceeditorial.com</span></span></a>
      </div>
    </section>

    <section class="mobile-section mobile-section--lavender mobile-reveal">
      <p class="mobile-kicker">Ejemplares</p>
      <h2 class="mobile-title">Solicitá nuestros <em>libros</em>.</h2>
      <form class="mobile-form" data-email="info@excellenceeditorial.com" method="post">
        <div class="mobile-form__row">
          <div class="mobile-field"><label for="mobile-first-name">Nombre</label><input id="mobile-first-name" name="first-name" type="text" autocomplete="given-name"></div>
          <div class="mobile-field"><label for="mobile-last-name">Apellido</label><input id="mobile-last-name" name="last-name" type="text" autocomplete="family-name"></div>
        </div>
        <div class="mobile-field"><label for="mobile-email">Correo electrónico</label><input id="mobile-email" name="email" type="email" autocomplete="email" required></div>
        <div class="mobile-field"><label for="mobile-message">Mensaje</label><textarea id="mobile-message" name="message"></textarea></div>
        <button class="mobile-button" type="submit">Enviar</button>
      </form>
    </section>
  </main>${newsletter}${mobileFooter}`;
}

function createMobileSite(header){
  const site=document.createElement('div');
  site.className='mobile-site';
  site.innerHTML=currentRoute==='libros'?booksMobile():currentRoute==='contacto'?contactMobile():homeMobile();
  header.insertAdjacentElement('afterend',site);
  return site;
}

function setupMobileAnimations(site){
  const elements=[...site.querySelectorAll('.mobile-reveal')];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window)){
    elements.forEach(element=>element.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.12});
  elements.forEach(element=>observer.observe(element));
}

function restoreOriginalAnimations(){
  if(matchMedia('(max-width:900px)').matches)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!('IntersectionObserver'in window))return;
  const ids=new Set();
  function collect(rules){
    for(const rule of rules){
      if(rule.selectorText?.includes('[data-motion-enter="done"]')){
        for(const match of rule.selectorText.matchAll(/#(comp-[\w-]+):not\(\[data-motion-enter="done"\]\)/g))ids.add(match[1]);
      }
      if(rule.cssRules)collect(rule.cssRules);
    }
  }
  for(const sheet of document.styleSheets){try{collect(sheet.cssRules);}catch{}}
  const elements=[...ids].map(id=>document.getElementById(id)).filter(Boolean);
  const timers=new Map();
  const seconds=value=>value.trim().endsWith('ms')?parseFloat(value):parseFloat(value)*1000;
  function finish(element){
    clearTimeout(timers.get(element));
    timers.delete(element);
    element.dataset.motionEnter='done';
    delete element.dataset.replicaMotion;
  }
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const element=entry.target;
      observer.unobserve(element);
      element.style.setProperty('--motion-width',`${element.offsetWidth}px`);
      element.style.setProperty('--motion-height',`${element.offsetHeight}px`);
      delete element.dataset.replicaMotion;
      element.dataset.motionEnter='playing';
      const style=getComputedStyle(element);
      const durations=style.animationDuration.split(',').map(seconds);
      const delays=style.animationDelay.split(',').map(seconds);
      const deadline=Math.max(0,...durations.map((duration,index)=>duration+delays[index%delays.length]));
      timers.set(element,setTimeout(()=>finish(element),deadline+100));
    }
  },{threshold:0});
  elements.forEach(element=>{element.dataset.replicaMotion='waiting';observer.observe(element);});
}

function scrollToCurrentRoute(site){
  if(!['colegios','talleres','capacitaciones','alianzas'].includes(currentRoute))return;
  const findTarget=()=>matchMedia('(max-width:900px)').matches?site.querySelector(`[data-route="${currentRoute}"]`):document.getElementById(desktopTargets[currentRoute]);
  requestAnimationFrame(()=>requestAnimationFrame(()=>findTarget()?.scrollIntoView({block:'start'})));
}

function setupCleanRouteTracking(site){
  if(!['http:','https:'].includes(location.protocol)||!['home','colegios','talleres','capacitaciones','alianzas'].includes(currentRoute)||!('IntersectionObserver'in window))return;
  setTimeout(()=>{
    const mobile=matchMedia('(max-width:900px)').matches;
    const entries=mobile?[...site.querySelectorAll('[data-route]')]:Object.entries(desktopTargets).map(([route,id])=>{const element=document.getElementById(id);if(element)element.dataset.cleanRoute=route;return element;}).filter(Boolean);
    const observer=new IntersectionObserver(changes=>{
      const visible=changes.filter(change=>change.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      const route=visible.target.dataset.route||visible.target.dataset.cleanRoute;
      if(route&&location.pathname!==routePaths[route])history.replaceState(null,'',routePaths[route]);
    },{threshold:[.35,.55,.75]});
    entries.forEach(element=>observer.observe(element));
  },900);
}

function showEmailNotice(address){
  document.querySelector('.replica-notice')?.remove();
  const notice=document.createElement('div');
  notice.className='replica-notice';
  notice.setAttribute('role','status');
  const message=document.createElement('p');
  message.textContent='Este formulario prepara un correo; no lo envía automáticamente. Revisa el mensaje en tu aplicación de correo y pulsa Enviar. Si no se abre, escríbenos a ';
  const link=document.createElement('a');
  link.href=`mailto:${address}`;
  link.textContent=address;
  message.append(link);
  const close=document.createElement('button');
  close.type='button';
  close.textContent='Entendido';
  close.addEventListener('click',()=>notice.remove());
  notice.append(message,close);
  document.body.append(notice);
}

function setupForms(){
  document.querySelectorAll('form[data-email]').forEach(form=>{
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const data=new FormData(form);
      const contact=Boolean(form.querySelector('textarea'));
      const subject=contact?'Solicitud de ejemplares — Excellence Editorial':'Solicitud de información — Excellence Editorial';
      const body=contact?`Nombre: ${data.get('first-name')||''} ${data.get('last-name')||''}\nCorreo: ${data.get('email')||''}\n\n${data.get('message')||''}`:`Deseo recibir información de Excellence Editorial.\nMi correo: ${data.get('email')||''}`;
      showEmailNotice(form.dataset.email);
      location.href=`mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });
}

normalizeAddress();
normalizeLinks();
updateScrollbarWidth();
window.addEventListener('resize',updateScrollbarWidth);
const header=mobileHeader();
const mobileSite=createMobileSite(header);
setupMobileAnimations(mobileSite);
restoreOriginalAnimations();
scrollToCurrentRoute(mobileSite);
setupCleanRouteTracking(mobileSite);
document.querySelectorAll('[data-destination]').forEach(button=>button.addEventListener('click',()=>{location.href=button.dataset.destination;}));
setupForms();
