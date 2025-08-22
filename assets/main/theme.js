/* =========================================================
   DA-LAB Galaxy — FULL-BG version (no gutter clip)
   - Fills entire viewport (gaps included)
   - Always animates; honors reduced motion by softening speed/density
   ========================================================= */
(() => {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const cvs  = document.getElementById('galaxy-canvas');
  const ctx  = cvs ? cvs.getContext('2d', { alpha: true }) : null;

  // ---- Galaxy parameters (full background) ----
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const prefersReduced = window.matchMedia &&
                         window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduce-motion일 때도 "애니메이션 유지"하되 완만하게
  const STAR_DENSITY = prefersReduced ? 0.00018 : 0.00035; // px당 별
  const LAYERS = prefersReduced
    ? [
        { sp:0.012, driftX:0.006, sz:[0.7,1.2], al:[0.45,0.85] },
        { sp:0.022, driftX:0.010, sz:[0.9,1.7], al:[0.55,0.95] },
      ]
    : [
        { sp:0.022, driftX:0.012, sz:[0.6,1.1], al:[0.45,0.85] },
        { sp:0.048, driftX:0.018, sz:[0.9,1.8], al:[0.55,0.95] },
        { sp:0.085, driftX:0.026, sz:[1.1,2.3], al:[0.65,1.00] },
      ];

  const SHOOT_MIN = prefersReduced ? 4500 : 2800;
  const SHOOT_MAX = prefersReduced ? 9000 : 6800;
  const SHOOT_SPEED = prefersReduced ? 0.9 : 1.3;

  let running = false, stars = [], meteors = [], rafId = null, nextMeteorAt = 0;

  function resize(){
    if (!cvs || !ctx) return;
    cvs.width  = Math.floor(window.innerWidth * DPR);
    cvs.height = Math.floor(window.innerHeight * DPR);
    cvs.style.width  = window.innerWidth + 'px';
    cvs.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function makeStars(){
    if (!ctx) return;
    stars.length = 0;
    const w = window.innerWidth, h = window.innerHeight;
    const area = Math.max(1, w * h);
    const N = Math.max(160, Math.floor(area * STAR_DENSITY));
    for (let i=0;i<N;i++){
      const L = LAYERS[i % LAYERS.length];
      const x = Math.random()*w, y = Math.random()*h;
      const sz = L.sz[0] + Math.random()*(L.sz[1]-L.sz[0]);
      const sp = L.sp*(0.8+Math.random()*0.6);
      const driftX = (Math.random()<0.5 ? -1:1)*L.driftX*(0.6+Math.random()*0.8);
      const a0 = L.al[0] + Math.random()*(L.al[1]-L.al[0]);
      const tw = 0.25 + Math.random()*0.75;
      const hue= 195 + Math.random()*50;
      stars.push({x,y,sz,sp,driftX,a:a0, tw, t:Math.random()*6.283, hue});
    }
  }

  function drawMilkyWay(t){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;
    const off = (t||0)*0.01;

    // 배경 전역 성운 2장 (대각/반대 대각)
    let grad = ctx.createRadialGradient(w*0.25+off*22, h*0.30, 20, w*0.25+off*22, h*0.30, Math.max(w,h)*0.6);
    grad.addColorStop(0,'rgba(160,190,255,0.18)');
    grad.addColorStop(0.45,'rgba(120,160,255,0.10)');
    grad.addColorStop(1,'rgba(40,60,120,0)');
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    grad = ctx.createRadialGradient(w*0.78-off*16, h*0.65, 20, w*0.78-off*16, h*0.65, Math.max(w,h)*0.55);
    grad.addColorStop(0,'rgba(220,220,255,0.14)');
    grad.addColorStop(0.50,'rgba(170,190,255,0.08)');
    grad.addColorStop(1,'rgba(60,80,160,0)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    ctx.globalCompositeOperation='source-over';
  }

  function drawStars(){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;

    for (const s of stars){
      s.y += s.sp;
      s.x += s.driftX;
      if (s.x < -2) s.x += (w+4);
      else if (s.x > w+2) s.x -= (w+4);
      if (s.y > h + 3) s.y = -3;

      s.t += s.tw * 0.018;
      const twinkle = 0.55 + Math.sin(s.t) * 0.45;
      const a = s.a * twinkle;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue},100%,85%,${a})`;
      ctx.arc(s.x, s.y, s.sz, 0, Math.PI*2);
      ctx.fill();
    }

    // meteors
    for (let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 1;
      const grd = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*10, m.y - m.vy*10);
      grd.addColorStop(0, `rgba(255,255,255,${0.9*m.alpha})`);
      grd.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.strokeStyle = grd; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx*12, m.y - m.vy*12); ctx.stroke();
      if (m.life <= 0 || m.y < -60 || m.y > h+60 || m.x < -60 || m.x > w+60) {
        meteors.splice(i,1);
      }
    }
  }

  function spawnMeteorIfNeeded(ts){
    if (ts < nextMeteorAt) return;
    const w = window.innerWidth, h = window.innerHeight;

    // 화면 상단 임의 위치에서 좌하향/우하향으로
    const x = Math.random()*w, y = -20 - Math.random()*40;
    const dir = Math.random()<0.5 ? 1 : -1;
    const angle = (Math.PI/2.7) * dir; // 좌/우로 기울어진 하향
    const speed = SHOOT_SPEED * (3 + Math.random()*2);
    const vx = Math.cos(angle)*speed, vy = Math.sin(angle)*speed + speed*0.6;
    meteors.push({x,y,vx,vy,life: 50 + Math.floor(Math.random()*30), alpha: 0.9});

    nextMeteorAt = ts + (SHOOT_MIN + Math.random()*(SHOOT_MAX - SHOOT_MIN));
  }

  function loop(ts){
    if (!running) return;
    ctx.clearRect(0,0,cvs.width,cvs.height);
    drawMilkyWay(ts);
    drawStars();
    spawnMeteorIfNeeded(performance.now());
    rafId = requestAnimationFrame(loop);
  }

  function startGalaxy(){
    if (!cvs || !ctx) return;
    if (running) return; running = true;
    resize(); makeStars(); meteors = []; nextMeteorAt = performance.now() + 1300;
    rafId = requestAnimationFrame(loop);  // 항상 애니메이션
  }
  function stopGalaxy(){
    running=false; if (rafId) cancelAnimationFrame(rafId);
    if (ctx) ctx.clearRect(0,0,cvs.width,cvs.height);
    meteors = [];
  }

  window.addEventListener('resize', () => {
    resize(); makeStars();
    if (!running && ctx){ drawMilkyWay(0); drawStars(); }
  });

  // ---- Theme wiring ----
  const key = 'da_theme';
  const prefersDark = window.matchMedia &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark');
    if (cvs) cvs.style.opacity = (theme === 'dark') ? '1' : '0';
    if (theme === 'dark') startGalaxy(); else stopGalaxy();
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
