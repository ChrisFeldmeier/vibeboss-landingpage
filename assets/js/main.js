/* VibeBoss.ai · Interaktionen, Sprache, Theme, Motion */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- Theme (Dark / Light) ---------- */
  const themeMeta = $('meta[name=theme-color]');
  const applyTheme = t => { root.dataset.theme = t; themeMeta && (themeMeta.content = t === 'dark' ? '#050605' : '#f6f8f0'); };
  applyTheme(root.dataset.theme || 'dark');
  $('#themeBtn').addEventListener('click', () => { const t = root.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(t); store.set('vb-theme', t); });

  /* ---------- Sprache (DE / EN) ----------
     Deutsch steht im HTML, Englisch im Attribut data-en. */
  const i18n = $$('[data-en]');
  i18n.forEach(el => { el.dataset.de = el.innerHTML; });
  const titles = { de: 'VibeBoss.ai – Aus Code werden Videos. Automatisch.', en: 'VibeBoss.ai – Turn code into videos. Automatically.' };
  let resplit = () => {};
  const applyLang = (lang, animate) => {
    root.lang = lang;
    i18n.forEach(el => { el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.de; });
    $('#langLabel').textContent = lang.toUpperCase();
    document.title = titles[lang];
    resplit(animate);
  };
  $('#langBtn').addEventListener('click', () => { const l = root.lang === 'de' ? 'en' : 'de'; store.set('vb-lang', l); applyLang(l, true); });

  /* ---------- Menü ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  const setMenu = open => {
    menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', !open); menuBtn.setAttribute('aria-expanded', open);
    $('use', menuBtn).setAttribute('href', open ? '#i-x' : '#i-menu'); document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* ---------- FAQ: immer nur eine Antwort offen ---------- */
  const qas = $$('.qa');
  qas.forEach(d => d.addEventListener('toggle', () => { if (d.open) qas.forEach(o => o !== d && (o.open = false)); }));

  /* ---------- Toast (Video-Platzhalter, Anmeldung) ---------- */
  const toast = $('#toast'); let toastT;
  const say = (de, en) => { toast.textContent = root.lang === 'en' ? en : de; toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 2600); };
  $$('[data-video]').forEach(b => b.addEventListener('click', () => say('Das Beispielvideo folgt in Kürze.', 'The sample video is coming soon.')));
  $$('[data-signup]').forEach(b => b.addEventListener('click', e => { if (b.getAttribute('href') === '#') { e.preventDefault(); say('Die Anmeldung öffnet in Kürze.', 'Sign-up opens soon.'); } }));

  /* ---------- Editor-Mockup: Szenen durchschalten ---------- */
  const scenes = $$('.ed__scenes li'), head = $('#edHead'), prog = $('#edProg'), time = $('#edTime');
  const starts = [3, 8, 16, 22, 27]; let cur = 0, auto;
  const setScene = i => {
    cur = i; scenes.forEach((s, k) => s.classList.toggle('on', k === i));
    if (head) head.style.left = (i * 20 + 14) + '%';
    if (prog) prog.style.width = (starts[i] / 28 * 100) + '%';
    if (time) time.textContent = '0:' + String(starts[i]).padStart(2, '0') + ' / 0:28';
  };
  const play = () => { clearInterval(auto); auto = setInterval(() => setScene((cur + 1) % scenes.length), 2600); };
  scenes.forEach((s, i) => s.addEventListener('click', () => { setScene(i); play(); }));
  $('#genBtn') && $('#genBtn').addEventListener('click', () => { setScene(0); play(); say('Neue Variante wird generiert …', 'Generating a new variant …'); });
  if (scenes.length && !reduced) play();

  // Marken-Panel: Farbe und Schrift wählbar
  $$('#swatches button').forEach(b => b.addEventListener('click', () => {
    $$('#swatches button').forEach(o => o.classList.toggle('on', o === b));
    $('.brand__logo').style.setProperty('--brand', getComputedStyle(b).getPropertyValue('--c'));
  }));
  $$('.fonts b').forEach(b => b.addEventListener('click', () => $$('.fonts b').forEach(o => o.classList.toggle('on', o === b))));

  /* ---------- Endlos-Animationen pausieren, wenn Section nicht sichtbar ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('off', !e.isIntersecting)), { rootMargin: '200px 0px' });
  $$('main > section').forEach(s => io.observe(s));

  /* ---------- Motion (GSAP) ---------- */
  const boot = () => {
    const lang = store.get('vb-lang') || root.lang || 'de';
    const hasGsap = window.gsap && window.ScrollTrigger && !reduced;
    if (!hasGsap) { applyLang(lang === 'en' ? 'en' : 'de'); return; }
    gsap.registerPlugin(ScrollTrigger);

    // Überschriften in Wörter teilen (Masken-Reveal)
    const splitNode = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part;
          w.appendChild(wi); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') splitNode(n);
    });
    const heads = $$('[data-split]');
    resplit = animate => heads.forEach(h => {
      splitNode(h);
      if (animate) gsap.from($$('.wi', h), { yPercent: 110, duration: .8, ease: 'expo.out', stagger: .03 });
    });
    applyLang(lang === 'en' ? 'en' : 'de');
    heads.forEach(h => gsap.from($$('.wi', h), { yPercent: 115, rotate: 3, duration: 1.05, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: h, start: 'top 90%', once: true } }));

    // Reveals
    const presets = { up: { y: 40, opacity: 0 }, fade: { opacity: 0 }, scale: { scale: .92, y: 30, opacity: 0 } };
    $$('[data-a]').forEach(el => gsap.from(el, { ...presets[el.dataset.a], duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    $$('[data-stagger]').forEach(g => gsap.from(g.children, { y: 34, opacity: 0, duration: .95, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: g, start: 'top 90%', once: true } }));


    // Details
    gsap.from('.pvis .chip', { scale: .6, opacity: 0, duration: .8, ease: 'back.out(1.8)', stagger: .12, scrollTrigger: { trigger: '.pvis', start: 'top 75%', once: true } });
    gsap.from('.dia__hub', { scale: 0, duration: 1, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.dia', start: 'top 75%', once: true } });
    gsap.from('.dia__player, .dia__port', { x: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .15, delay: .25, scrollTrigger: { trigger: '.dia', start: 'top 75%', once: true } });
    gsap.from('.doc i', { scaleX: 0, duration: .7, ease: 'power3.out', stagger: .06, scrollTrigger: { trigger: '.doc', start: 'top 88%', once: true } });
    gsap.from('.bub', { scale: .5, opacity: 0, duration: .7, ease: 'back.out(2)', stagger: .14, scrollTrigger: { trigger: '.ed__stage', start: 'top 72%', once: true } });
    gsap.from('.fmt figure', { rotateY: 25, transformPerspective: 900, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.fmt', start: 'top 85%', once: true } });
    gsap.from('.fan__c', { x: -80, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: -.1, scrollTrigger: { trigger: '.fan', start: 'top 82%', once: true } });


    ScrollTrigger.refresh();
  };
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot, { once: true });
})();
