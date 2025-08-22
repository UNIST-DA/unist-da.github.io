/* =========================================================
   DA-LAB Theme + Galaxy (side gutters only)
   - Theme persistence (localStorage)
   - Galaxy canvas stars + milky way
   ========================================================= */

(() => {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const cvs  = document.getElementById('galaxy-canvas');
  const ctx  = cvs ? cvs.getContext('2d', { alpha: true }) : null;

  // =====(A) Galaxy variables/functions FIRST (TDZ 방지) =====
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running = false, stars = [], rafId = null;

  function cssPx(name){
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    return parseFloat(v.replace('px','')) || 0;
  }
  function gutter(){
    const W = cssPx('--w') || 1100;
    const pad = cssPx('--page-pad') || 40;
    const g = (window.innerWidth - (W + pad)) / 2;
    return Math.max(16, Math.min(340, g));
  }
  function resize(){
    if (!cvs || !ctx) return;
    cvs.width  = Math.floor(window.innerWidth * DPR);
    cvs.height = Math.floor(window.innerHeight * DPR);
    cvs.style.width  = window.innerWidth + 'px';
    cvs.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  function makeStars(){
    if (!cvs || !ctx) return;
    stars.length = 0;
    const h = window.innerHeight, g = gutter();
    const sideArea = (g * h) * 2;
    const density = reduceMotion ? 0.00009 : 0.00018;
    const N = Math.max(80, Math.floor(sideArea * density));
    const L = [
      { sp:0.015, sz:[0.6,1.0], al:[0.45,0.85] },
      { sp:0.030, sz:[0.8,1.6], al:[0.55,0.95] },
      { sp:0.060, sz:[1.0,2.1], al:[0.65,1.00] },
    ];
    for (let i=0;i<N;i++){
      const k = L[i%3], left = Math.random()<0.5, gW=g;
      const x = left ? Math.random()*gW : (window.innerWidth-gW)+Math.random()*gW;
      const y = Math.random()*h;
      const sz = k.sz[0] + Math.random()*(k.sz[1]-k.sz[0]);
      const sp = k.sp*(0.6+Math.random()*0.8);
      const a0 = k.al[0] + Math.random()*(k.al[1]-k.al[0]);
      const tw = 0.3 + Math.random()*0.7;
      const hue= 200 + Math.random()*40;
      stars.push({x,y,sz,sp,a:a0,tw,t:Math.random()*6.283,hue});
    }
  }
  function clipGutters(ctx){
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    ctx.beginPath(); ctx.rect(0,0,g,h); ctx.rect(w-g,0,g,h); ctx.clip();
  }
  function drawMilkyWay(t){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    ctx.save(); clipGutters(ctx);
    const off = (t||0)*0.01;
    let grad = ctx.createRadialGradient(g*0.5+off*20, h*0.30, 20, g*0.5+off*20, h*0.30, g*1.1);
    grad.addColorStop(0,'rgba(140,180,255,0.18)');
    grad.addColorStop(0.35,'rgba(120,160,255,0.10)');
    grad.addColorStop(0.70,'rgba(80,110,200,0.04)');
    grad.addColorStop(1,'rgba(50,70,120,0)');
    ctx.globalCompositeOperation='lighter'; ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    grad = ctx.createRadialGradient(w-g*0.5-off*12, h*0.65, 20, w-g*0.5-off*12, h*0.65, g*1.0);
    grad.addColorStop(0,'rgba(200,200,255,0.14)');
    grad.addColorStop(0.40,'rgba(170,190,255,0.08)');
    grad.addColorStop(0.80,'rgba(110,140,220,0.03)');
    grad.addColorStop(1,'rgba(60,80,160,0)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);
    ctx.restore(); ctx.globalCompositeOperation='source-over';
  }
  function drawStars(t){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    ctx.save(); clipGutters(ctx);
    for (const s of stars){
      s.y += s.sp; if (s.y > h+5) s.y = -5;
      s.t += s.tw*0.02; const tw = 0.6 + Math.sin(s.t)*0.4;
      const a = s.a * tw;
      ctx.beginPath(); ctx.fillStyle=`hsla(${s.hue},100%,85%,${a})`;
      ctx.arc(s.x,s.y,s.sz,0,6.283); ctx.fill();
    }
    ctx.restore();
  }
  function loop(t){
    if (!running) return;
    ctx.clearRect(0,0,cvs.width,cvs.height);
    drawMilkyWay(t); drawStars(t);
    rafId = requestAnimationFrame(loop);
  }
  function startGalaxy(){
    if (!cvs || !ctx) return;
    if (running) return; running = true;
    resize(); makeStars();
    if (reduceMotion){ drawMilkyWay(0); drawStars(0); running=false; return; }
    rafId = requestAnimationFrame(loop);
  }
  function stopGalaxy(){
    if (!ctx) return;
    running=false; if (rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0,0,cvs.width,cvs.height);
  }
  window.addEventListener('resize', () => { resize(); makeStars(); if (!running && ctx){ drawMilkyWay(0); drawStars(0);} });

  // =====(B) Theme apply AFTER galaxy is defined =====
  const key = 'da_theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme){
    if (!theme) return;
    root.setAttribute('data-theme', theme);
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark');
    if (theme === 'dark') startGalaxy();
    else stopGalaxy();
    if (cvs) cvs.style.opacity = (theme === 'dark') ? '1' : '0';
  }

  const saved = localStorage.getItem(key);
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  if (btn){
    btn.addEventListener('click', () => {
      const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      localStorage.setItem(key, next);
      applyTheme(next);
    });
  }
})();
