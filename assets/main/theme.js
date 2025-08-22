/* =========================================================
   DA-LAB Theme + Galaxy (side gutters only)
   - Theme persistence (localStorage)
   - Galaxy canvas stars + milky way
   ========================================================= */

(() => {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const cvs  = document.getElementById('galaxy-canvas');
  const ctx  = cvs.getContext('2d', { alpha: true });

  /* -----------------------
     1) THEME APPLY/EARLY
     ----------------------- */
  const key = 'da_theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme){
    if (!theme) return;
    root.setAttribute('data-theme', theme);
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark');
    // 갤럭시 런/스탑
    if (theme === 'dark') startGalaxy();
    else stopGalaxy();
  }

  // 초기 테마
  const saved = localStorage.getItem(key);
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  // 버튼 토글
  if (btn){
    btn.addEventListener('click', () => {
      const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      localStorage.setItem(key, next);
      applyTheme(next);
    });
  }

  /* -----------------------
     2) GALAXY CANVAS
     ----------------------- */
  let running = false, stars = [], rafId = null;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssPx(name){
    // "--w" 같은 CSS 변수(px)를 정수로 반환
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
    cvs.width  = Math.floor(window.innerWidth * DPR);
    cvs.height = Math.floor(window.innerHeight * DPR);
    cvs.style.width  = window.innerWidth + 'px';
    cvs.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function makeStars(){
    stars.length = 0;
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    const sideArea = (g * h) * 2;
    // 밀도: 0.16 ~ 0.22 px당 별 (reduceMotion이면 더 적게)
    const density = reduceMotion ? 0.00009 : 0.00018;
    const N = Math.max(80, Math.floor(sideArea * density));
    const layers = [
      { speed: 0.015, size:[0.6,1.0], alpha:[0.45,0.85] }, // far
      { speed: 0.030, size:[0.8,1.6], alpha:[0.55,0.95] }, // mid
      { speed: 0.060, size:[1.0,2.1], alpha:[0.65,1.0] }   // near
    ];
    for (let i=0;i<N;i++){
      const L = layers[i % layers.length];
      const left = Math.random() < 0.5;
      const x = left ? Math.random() * g : (w - g) + Math.random() * g;
      const y = Math.random() * h;
      const sz = L.size[0] + Math.random() * (L.size[1]-L.size[0]);
      const sp = L.speed * (0.6 + Math.random()*0.8); // 0.6~1.4배
      const a0 = L.alpha[0] + Math.random() * (L.alpha[1]-L.alpha[0]);
      const tw = 0.3 + Math.random()*0.7; // twinkle speed
      const hue = 200 + Math.random()*40; // 차가운 푸른 톤
      stars.push({x,y,sz,sp,a:a0, tw, t:Math.random()*Math.PI*2, left, hue});
    }
  }

  function drawMilkyWay(t){
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    ctx.save();
    // 좌우 gutter만 그리도록 clip
    ctx.beginPath();
    ctx.rect(0, 0, g, h);
    ctx.rect(w-g, 0, g, h);
    ctx.clip();

    // 부드러운 성운 띠 (왼쪽 위->오른쪽 아래 대각)
    const offset = t * 0.01;
    // 왼쪽 성운
    let grad = ctx.createRadialGradient(g*0.5 + offset*20, h*0.30, 20, g*0.5 + offset*20, h*0.30, g*1.1);
    grad.addColorStop(0.00,'rgba(140,180,255,0.18)');
    grad.addColorStop(0.35,'rgba(120,160,255,0.10)');
    grad.addColorStop(0.70,'rgba(80,110,200,0.04)');
    grad.addColorStop(1.00,'rgba(50,70,120,0.00)');
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,w,h);

    // 오른쪽 성운 (살짝 다른 톤/위치)
    grad = ctx.createRadialGradient(w - g*0.5 - offset*12, h*0.65, 20, w - g*0.5 - offset*12, h*0.65, g*1.0);
    grad.addColorStop(0.00,'rgba(200,200,255,0.14)');
    grad.addColorStop(0.40,'rgba(170,190,255,0.08)');
    grad.addColorStop(0.80,'rgba(110,140,220,0.03)');
    grad.addColorStop(1.00,'rgba(60,80,160,0.00)');
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,w,h);

    ctx.restore();
    ctx.globalCompositeOperation='source-over';
  }

  function drawStars(t){
    const w = window.innerWidth, h = window.innerHeight, g = gutter();
    ctx.save();
    // 좌우 gutter만 그리도록 clip
    ctx.beginPath();
    ctx.rect(0, 0, g, h);
    ctx.rect(w-g, 0, g, h);
    ctx.clip();

    for (const s of stars){
      // 수직 드리프트(천천히)
      s.y += s.sp;
      if (s.y > h + 5) s.y = -5; // 위로 재배치

      // 트윙클(깜빡임)
      s.t += s.tw * 0.02;
      const twinkle = 0.6 + Math.sin(s.t) * 0.4; // 0.2~1.0
      const a = s.a * twinkle;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue}, 100%, 85%, ${a})`;
      ctx.arc(s.x, s.y, s.sz, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  function loop(t){
    if (!running) return;
    ctx.clearRect(0,0,cvs.width, cvs.height);
    drawMilkyWay(t || 0);
    drawStars(t || 0);
    rafId = requestAnimationFrame(loop);
  }

  const onResize = () => { resize(); makeStars(); };
  window.addEventListener('resize', onResize);

  function startGalaxy(){
    if (running || !cvs) return;
    running = true;
    onResize();
    if (reduceMotion){
      // 정지 상태의 은은한 성운만 (별/애니메이션 최소화)
      ctx.clearRect(0,0,cvs.width, cvs.height);
      drawMilkyWay(0);
      drawStars(0); // 초기 프레임만
      running = false;
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  function stopGalaxy(){
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0,0,cvs.width, cvs.height);
  }

  // 만약 현재 상태가 다크면 즉시 시작
  if (root.getAttribute('data-theme') === 'dark') startGalaxy();
})();
