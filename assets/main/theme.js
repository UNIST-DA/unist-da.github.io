/* =========================================================
   DA-LAB Galaxy — FULL-BG (Dramatic preset)
   ========================================================= */
(() => {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const cvs  = document.getElementById('galaxy-canvas');
  const ctx  = cvs ? cvs.getContext('2d', { alpha: true }) : null;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  // ==== 튜닝값 (강하게) ====
  const STAR_DENSITY = prefersReduced ? 0.00035 : 0.00070; // px당 별(기존 대비 ↑)
  const LAYERS = prefersReduced
    ? [
        { sp:0.030, driftX:0.020, sz:[0.9,1.7], al:[0.55,0.95] },
        { sp:0.060, driftX:0.030, sz:[1.1,2.2], al:[0.65,1.00] },
      ]
    : [
        { sp:0.050, driftX:0.060, sz:[0.9,1.7], al:[0.55,0.95] }, // far
        { sp:0.110, driftX:0.090, sz:[1.1,2.3], al:[0.65,1.00] }, // mid
        { sp:0.180, driftX:0.120, sz:[1.2,2.6], al:[0.70,1.00] }, // near
      ];
  const TWINKLE_SPEED = prefersReduced ? 0.030 : 0.045; // 트윙클 속도 배율(↑)
  const TWINKLE_AMP   = 0.55;                           // 트윙클 진폭(↑)

  const SHOOT_MIN = prefersReduced ? 2200 : 1200;       // 유성 빈도↑
  const SHOOT_MAX = prefersReduced ? 4200 : 3200;
  const SHOOT_SPEED = prefersReduced ? 1.2 : 1.8;       // 유성 속도↑

  // 전역 바람(좌우 흔들림) – 느린 사인파
  const WIND_STRENGTH = prefersReduced ? 0.20 : 0.35;   // px/frame 스케일
  const WIND_FREQ     = 0.0008;                         // Hz ~ (ms 기준)

  let running = false, stars = [], meteors = [];
  let rafId = null, nextMeteorAt = 0;

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
    const area = Math.max(1, w*h);
    const N = Math.max(220, Math.floor(area * STAR_DENSITY));
    for (let i=0;i<N;i++){
      const L = LAYERS[i % LAYERS.length];
      const x = Math.random()*w, y = Math.random()*h;
      const sz = L.sz[0] + Math.random()*(L.sz[1]-L.sz[0]);
      const sp = L.sp*(0.85+Math.random()*0.5);                 // 개별 속도 편차
      const driftX = (Math.random()<0.5 ? -1:1)*L.driftX*(0.7+Math.random()*0.8);
      const a0 = L.al[0] + Math.random()*(L.al[1]-L.al[0]);
      const tw = 0.6 + Math.random()*1.2;                        // 트윙클 주파수 다양화
      const hue= 190 + Math.random()*60;                         // 청~청보라
      stars.push({x,y,sz,sp,driftX,a:a0, tw, t:Math.random()*6.283, hue});
    }
  }

  function drawMilkyWay(t){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;
    const off = (t||0)*0.012; // 살짝 더 빠르게

    let grad = ctx.createRadialGradient(w*0.22+off*28, h*0.28, 20, w*0.22+off*28, h*0.28, Math.max(w,h)*0.62);
    grad.addColorStop(0,'rgba(170,195,255,0.22)');
    grad.addColorStop(0.45,'rgba(130,165,255,0.12)');
    grad.addColorStop(1,'rgba(40,60,120,0)');
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    grad = ctx.createRadialGradient(w*0.80-off*18, h*0.66, 20, w*0.80-off*18, h*0.66, Math.max(w,h)*0.58);
    grad.addColorStop(0,'rgba(230,230,255,0.16)');
    grad.addColorStop(0.50,'rgba(175,195,255,0.09)');
    grad.addColorStop(1,'rgba(60,80,160,0)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    ctx.globalCompositeOperation='source-over';
  }

  function drawStars(ts){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;

    // 글로벌 바람 (좌우) – time 기반
    const wind = Math.sin(ts * WIND_FREQ) * WIND_STRENGTH;

    for (const s of stars){
      // 수직 하강 + 수평 드리프트 + 글로벌 바람
      s.y += s.sp;
      s.x += s.driftX + wind;

      // 화면 밖 래핑
      if (s.x < -3) s.x += (w+6);
      else if (s.x > w+3) s.x -= (w+6);
      if (s.y > h + 4) s.y = -4;

      // 트윙클 (속도/진폭 강화)
      s.t += s.tw * TWINKLE_SPEED;
      const twinkle = 1 - TWINKLE_AMP + Math.sin(s.t) * TWINKLE_AMP; // (1-amp)~1+amp
      const a = s.a * twinkle;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue},100%,85%,${a})`;
      ctx.arc(s.x, s.y, s.sz, 0, Math.PI*2);
      ctx.fill();
    }

    // Meteors
    for (let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 1;
      const grd = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*12, m.y - m.vy*12);
      grd.addColorStop(0, `rgba(255,255,255,${0.95*m.alpha})`);
      grd.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.strokeStyle = grd; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx*14, m.y - m.vy*14); ctx.stroke();
      if (m.life <= 0 || m.y < -80 || m.y > h+80 || m.x < -80 || m.x > w+80) {
        meteors.splice(i,1);
      }
    }
  }

  function spawnMeteorIfNeeded(ts){
    if (ts < nextMeteorAt) return;
    const w = window.innerWidth;

    // 상단 임의 위치에서 좌/우로 기울어진 하강
    const x = Math.random()*w, y = -30 - Math.random()*40;
    const dir = Math.random()<0.5 ? 1 : -1;
    const angle = (Math.PI/2.5) * dir;
    const speed = SHOOT_SPEED * (3 + Math.random()*2.2);
    const vx = Math.cos(angle)*speed, vy = Math.sin(angle)*speed + speed*0.8;
    meteors.push({x,y,vx,vy,life: 48 + Math.floor(Math.random()*28), alpha: 0.9});
    nextMeteorAt = ts + (SHOOT_MIN + Math.random()*(SHOOT_MAX - SHOOT_MIN));
  }

  function loop(ts){
    if (!running) return;
    ctx.clearRect(0,0,cvs.width,cvs.height);
    drawMilkyWay(ts);
    drawStars(ts);
    spawnMeteorIfNeeded(performance.now());
    rafId = requestAnimationFrame(loop);
  }

  function startGalaxy(){
    if (!cvs || !ctx) return;
    if (running) return; running = true;
    resize(); makeStars(); meteors = []; nextMeteorAt = performance.now() + 900;
    rafId = requestAnimationFrame(loop);
  }
  function stopGalaxy(){
    running=false; if (rafId) cancelAnimationFrame(rafId);
    if (ctx) ctx.clearRect(0,0,cvs.width,cvs.height);
    meteors = [];
  }

  window.addEventListener('resize', () => {
    resize(); makeStars();
    if (!running && ctx){ drawMilkyWay(0); drawStars(0); }
  });

  // ==== 테마 연결 ====
  const key = 'da_theme';
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

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
