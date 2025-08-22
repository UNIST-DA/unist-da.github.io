/* =========================================================
   DA-LAB Theme + Galaxy (side gutters only) — Enhanced
   - Full gutter coverage (no clamp)
   - Higher density, parallax drift, twinkle
   - Random shooting stars
   ========================================================= */

(() => {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const cvs  = document.getElementById('galaxy-canvas');
  const ctx  = cvs ? cvs.getContext('2d', { alpha: true }) : null;

  /* ---------------------------
     A) Galaxy: variables first
     --------------------------- */
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // === 튜닝 포인트 ===
  const STAR_DENSITY      = reduceMotion ? 0.00010 : 0.00035;  // px 당 별 밀도
  const LAYERS = [
    { sp:0.020, driftX:0.010, sz:[0.6,1.0], al:[0.45,0.85] }, // far
    { sp:0.045, driftX:0.016, sz:[0.9,1.6], al:[0.55,0.95] }, // mid
    { sp:0.080, driftX:0.022, sz:[1.1,2.2], al:[0.65,1.00] }, // near
  ];
  const SHOOTING_MIN_MS = 3000;  // 다음 유성까지 최소 대기
  const SHOOTING_MAX_MS = 7000;  // 최대 대기
  const SHOOTING_SPEED  = 1.2;   // 유성 속도 multiplier

  let running = false, stars = [], meteors = [], rafId = null, nextMeteorAt = 0;

  function cssPx(name){
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    return parseFloat(v.replace('px','')) || 0;
  }

  // 화면 좌우 남는 모든 영역 사용 (상한 제거)
  function gutter(){
    const W = cssPx('--w') || 1100;
    const pad = cssPx('--page-pad') || 40;
    const g = (window.innerWidth - (W + pad)) / 2;
    return Math.max(0, g);  // 상한(clamp) 제거
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
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    const sideArea = Math.max(1, (g * h) * 2);  // 좌+우
    const N = Math.max(120, Math.floor(sideArea * STAR_DENSITY));
    for (let i=0;i<N;i++){
      const L = LAYERS[i % LAYERS.length];
      const left = Math.random() < 0.5;
      const x = left ? Math.random()*g : (w - g) + Math.random()*g;
      const y = Math.random()*h;
      const sz = L.sz[0] + Math.random()*(L.sz[1]-L.sz[0]);
      const sp = L.sp*(0.8+Math.random()*0.6);
      const driftX = (Math.random()<0.5 ? -1 : 1) * L.driftX * (0.5+Math.random()*0.8);
      const a0 = L.al[0] + Math.random()*(L.al[1]-L.al[0]);
      const tw = 0.25 + Math.random()*0.75;
      const hue= 195 + Math.random()*50;        // 청색~청보라
      stars.push({x,y,sz,sp,driftX,a:a0, tw, t:Math.random()*6.283, hue, left});
    }
  }

  function clipGutters(){
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    ctx.beginPath();
    // 좌우 여백만 보이도록 클립. g가 0이면 사실상 아무 것도 안 그림.
    if (g > 0) {
      ctx.rect(0,0,g,h);
      ctx.rect(w-g,0,g,h);
      ctx.clip();
    } else {
      // 여백이 거의 없을 때는 클립만 건너뜀(실질적으로 아무 것도 안 보임)
      ctx.save();
    }
  }

  function drawMilkyWay(t){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    if (g <= 0) return;

    ctx.save();
    clipGutters();

    const off = (t||0)*0.01;

    // 왼쪽 성운
    let grad = ctx.createRadialGradient(g*0.55+off*28, h*0.30, 20, g*0.55+off*28, h*0.30, g*1.25);
    grad.addColorStop(0,'rgba(160,190,255,0.20)');
    grad.addColorStop(0.40,'rgba(130,165,255,0.12)');
    grad.addColorStop(0.80,'rgba(80,110,200,0.05)');
    grad.addColorStop(1,'rgba(50,70,120,0)');
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    // 오른쪽 성운
    grad = ctx.createRadialGradient(w-g*0.50-off*18, h*0.68, 20, w-g*0.50-off*18, h*0.68, g*1.15);
    grad.addColorStop(0,'rgba(220,220,255,0.16)');
    grad.addColorStop(0.45,'rgba(180,200,255,0.09)');
    grad.addColorStop(0.85,'rgba(110,140,220,0.04)');
    grad.addColorStop(1,'rgba(60,80,160,0)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    ctx.restore();
    ctx.globalCompositeOperation='source-over';
  }

  function drawStars(t){
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    if (g <= 0) return;

    ctx.save();
    clipGutters();

    for (const s of stars){
      // 수직 하강 + 수평 드리프트 (좌우 미세 이동)
      s.y += s.sp;
      s.x += s.driftX;

      // gutter 경계 밖으로 나가면 반대편으로 워프
      if (s.left){
        if (s.x < 0) s.x += g;
        if (s.x > g) s.x -= g;
      } else {
        if (s.x < w - g) s.x += g;
        if (s.x > w) s.x -= g;
      }
      if (s.y > h + 5) s.y = -5;

      // 트윙클
      s.t += s.tw * 0.02;
      const twinkle = 0.55 + Math.sin(s.t) * 0.45; // 0.10~1.0
      const a = s.a * twinkle;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue}, 100%, 85%, ${a})`;
      ctx.arc(s.x, s.y, s.sz, 0, Math.PI*2);
      ctx.fill();
    }

    // Shooting stars
    for (let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 1;
      // 그리기 (꼬리)
      const grd = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*10, m.y - m.vy*10);
      grd.addColorStop(0, `rgba(255,255,255,${0.9*m.alpha})`);
      grd.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx*12, m.y - m.vy*12);
      ctx.stroke();

      if (m.life <= 0 ||
          (m.left && m.x > g) ||
          (!m.left && m.x < w - g) ||
          m.y < -50 || m.y > h + 50) {
        meteors.splice(i,1);
      }
    }

    ctx.restore();
  }

  function spawnMeteorIfNeeded(t){
    if (reduceMotion) return;
    if (t < nextMeteorAt) return;

    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    if (g <= 0) { nextMeteorAt = t + 2000; return; }

    // 좌/우 중 하나의 gutter 상단에서 시작하여 대각선으로 흘러내림
    const left = Math.random() < 0.5;
    const x = left ? (Math.random()*g*0.6) : (w - g + Math.random()*g*0.6);
    const y = -10 - Math.random()*40;
    const angle = left ? (Math.PI/2.6) : (Math.PI - Math.PI/2.6); // 대각선
    const speed = SHOOTING_SPEED * (3 + Math.random()*2); // px/frame
    const vx = Math.cos(angle)*speed;
    const vy = Math.sin(angle)*speed;
    meteors.push({x,y,vx,vy,life: 60 + Math.floor(Math.random()*30), alpha: 0.9, left});

    nextMeteorAt = t + (SHOOTING_MIN_MS + Math.random()*(SHOOTING_MAX_MS - SHOOTING_MIN_MS));
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
    resize(); makeStars(); meteors = []; nextMeteorAt = performance.now() + 1500;
    if (reduceMotion){ drawMilkyWay(0); drawStars(0); running=false; return; }
    rafId = requestAnimationFrame(loop);
  }
  function stopGalaxy(){
    if (!ctx) return;
    running=false; if (rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0,0,cvs.width,cvs.height);
    meteors = [];
  }

  window.addEventListener('resize', () => {
    resize(); makeStars();
    if (!running && ctx){ drawMilkyWay(0); drawStars(0); }
  });

  /* ---------------------------
     B) Theme (after galaxy def)
     --------------------------- */
  const key = 'da_theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme){
    if (!theme) return;
    root.setAttribute('data-theme', theme);
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark');
    if (cvs) cvs.style.opacity = (theme === 'dark') ? '1' : '0';
    if (theme === 'dark') startGalaxy();
    else stopGalaxy();
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
