/* =========================================================
   DA-LAB Galaxy — FULL-BG (Meteor Shower preset)
   - No wave/wind wobble
   - Frequent meteor bursts
   ========================================================= */
(() => {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const cvs  = document.getElementById('galaxy-canvas');
  const ctx  = cvs ? cvs.getContext('2d', { alpha: true }) : null;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  /* ===== Stars (드라마틱 유지) ===== */
  const STAR_DENSITY = prefersReduced ? 0.00035 : 0.00070; // px당 별
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
  const TWINKLE_SPEED = prefersReduced ? 0.026 : 0.040;
  const TWINKLE_AMP   = 0.50;

  /* ===== Meteors (유성우) ===== */
  const SHOOT_MIN = prefersReduced ? 700 : 400;   // 더 자주
  const SHOOT_MAX = prefersReduced ? 1600 : 1200;
  const SHOOT_SPEED = prefersReduced ? 1.4 : 2.0; // 더 빠르게
  const BURST_MIN = 2;                             // 버스트 최소/최대 개수
  const BURST_MAX = 4;

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
      const sp = L.sp*(0.85+Math.random()*0.5);
      const driftX = (Math.random()<0.5 ? -1:1)*L.driftX*(0.7+Math.random()*0.8);
      const a0 = L.al[0] + Math.random()*(L.al[1]-L.al[0]);
      const tw = 0.6 + Math.random()*1.2;
      const hue= 190 + Math.random()*60;
      stars.push({x,y,sz,sp,driftX,a:a0, tw, t:Math.random()*6.283, hue});
    }
  }

  function drawMilkyWay(t){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;
    const off = (t||0)*0.012;

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

    for (const s of stars){
      s.y += s.sp;
      s.x += s.driftX;

      // 화면 래핑
      if (s.x < -3) s.x += (w+6);
      else if (s.x > w+3) s.x -= (w+6);
      if (s.y > h + 4) s.y = -4;

      // 트윙클
      s.t += s.tw * TWINKLE_SPEED;
      const twinkle = 1 - TWINKLE_AMP + Math.sin(s.t) * TWINKLE_AMP;
      const a = s.a * twinkle;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue},100%,85%,${a})`;
      ctx.arc(s.x, s.y, s.sz, 0, Math.PI*2);
      ctx.fill();
    }

    // 유성 그리기 (꼬리 더 길게/선명하게)
    for (let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 1;
      const grd = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*18, m.y - m.vy*18);
      grd.addColorStop(0, `rgba(255,255,255,${0.95*m.alpha})`);
      grd.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.strokeStyle = grd; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx*18, m.y - m.vy*18); ctx.stroke();
      if (m.life <= 0 || m.y < -100 || m.y > h+100 || m.x < -120 || m.x > w+120) {
        meteors.splice(i,1);
      }
    }
  }

  function spawnMeteorBurst(ts){
    const w = window.innerWidth, h = window.innerHeight;

    // 버스트 개수
    const k = Math.floor(BURST_MIN + Math.random()*(BURST_MAX - BURST_MIN + 1));

    for (let i=0;i<k;i++){
      // 70%: 상단에서 내려오는 유형, 30%: 좌/우에서 대각선으로 가로지르는 유형
      const topType = Math.random() < 0.7;

      if (topType){
        const x = Math.random()*w, y = -30 - Math.random()*60;
        const dir = Math.random()<0.5 ? 1 : -1;
        const angle = (Math.PI/2.6) * dir;
        const speed = SHOOT_SPEED * (3.2 + Math.random()*2.4);
        const vx = Math.cos(angle)*speed, vy = Math.sin(angle)*speed + speed*0.9;
        meteors.push({x,y,vx,vy,life: 52 + Math.floor(Math.random()*30), alpha: 0.95});
      } else {
        // 사이드 스윕: 좌/우에서 등장, 화면을 가로지름
        const fromLeft = Math.random() < 0.5;
        const x = fromLeft ? -40 : w + 40;
        const y = Math.random() * (h*0.7);
        const angle = fromLeft ? (Math.PI * (0.92)) : (Math.PI * (0.08)); // 거의 수평
        const speed = SHOOT_SPEED * (3.0 + Math.random()*2.0);
        const vx = Math.cos(angle)*speed * (fromLeft ? 1 : -1);
        const vy = speed * (0.2 + Math.random()*0.4);
        meteors.push({x,y,vx,vy,life: 60 + Math.floor(Math.random()*32), alpha: 0.9});
      }
    }

    nextMeteorAt = ts + (SHOOT_MIN + Math.random()*(SHOOT_MAX - SHOOT_MIN));
  }

  function loop(ts){
    if (!running) return;
    ctx.clearRect(0,0,cvs.width,cvs.height);
    drawMilkyWay(ts);
    drawStars(ts);
    if (ts >= nextMeteorAt) spawnMeteorBurst(ts);
    rafId = requestAnimationFrame(loop);
  }

  function startGalaxy(){
    if (!cvs || !ctx) return;
    if (running) return; running = true;
    resize(); makeStars(); meteors = []; nextMeteorAt = performance.now() + 800;
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

  /* ===== Theme wiring ===== */
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
