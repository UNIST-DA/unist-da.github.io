<!doctype html>
<html lang="ko" data-theme="">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>연구실 이름 | Research Laboratory</title>
  <meta name="description" content="연구실 소개, 멤버, 연구(출판/프로젝트), 활동(뉴스/팁&노트) — Liquid Glass 스타일" />
  <meta name="color-scheme" content="light dark" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <style>
    /* ===================== Design Tokens ===================== */
    :root{
      --bg: #0b0d12;             /* page bg (dark) */
      --bg-accent:#0e1322;       /* darker layer */
      --text:#e9edf1;            /* body text */
      --muted:#a7b0bf;
      --primary:#7c96ff;         /* accent */
      --ring: rgba(124,150,255,.35);
      --glass: rgba(255,255,255,.06);
      --glass-border: rgba(255,255,255,.18);
      --card-radius: 18px;
      --shadow-lg: 0 10px 40px rgba(0,0,0,.35);
      --maxw: 1200px;
      --space: clamp(16px, 2vw, 24px);
      --space-lg: clamp(36px, 6vw, 80px);
      --container-pad: calc(var(--space) * 2) var(--space);
    }
    @media (prefers-color-scheme: light){
      :root{
        --bg:#f7f9ff; --bg-accent:#ecf1ff;
        --text:#0e1116; --muted:#616b79;
        --primary:#536dfe; --ring: rgba(83,109,254,.35);
        --glass: rgba(255,255,255,.55);
        --glass-border: rgba(0, 24, 168, .10);
        --shadow-lg: 0 10px 30px rgba(17,40,120,.15);
      }
    }
    html[data-theme="light"]{
      --bg:#f7f9ff; --bg-accent:#ecf1ff; --text:#0e1116; --muted:#616b79;
      --primary:#536dfe; --ring: rgba(83,109,254,.35);
      --glass: rgba(255,255,255,.55); --glass-border: rgba(0,24,168,.10);
      --shadow-lg: 0 10px 30px rgba(17,40,120,.15);
    }
    html[data-theme="dark"]{
      --bg:#0b0d12; --bg-accent:#0e1322; --text:#e9edf1; --muted:#a7b0bf;
      --primary:#7c96ff; --ring: rgba(124,150,255,.35);
      --glass: rgba(255,255,255,.06); --glass-border: rgba(255,255,255,.18);
      --shadow-lg: 0 10px 40px rgba(0,0,0,.35);
    }

    /* ===================== Base ===================== */
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", Arial, sans-serif;
      color:var(--text); background:var(--bg); line-height:1.65; -webkit-font-smoothing:antialiased;
    }
    a{color:var(--primary); text-decoration:none}
    a:hover{text-decoration:underline}
    .wrap{max-width:var(--maxw); margin:0 auto; padding: var(--container-pad); position:relative; z-index:1;}

    .section{padding: var(--space-lg) 0}
    .section .head{margin-bottom: clamp(16px, 2.2vw, 22px)}
    .kicker{display:inline-block; font-weight:700; letter-spacing:.4px; color:var(--primary); margin-bottom: 6px}
    h1,h2,h3{letter-spacing:.2px}
    h1{font-size: clamp(28px, 4vw, 44px); margin:0 0 10px;}
    h2{font-size: clamp(22px, 3vw, 32px); margin:0 0 8px}
    h3{font-size: clamp(18px, 2.2vw, 22px); margin:0 0 6px}
    p.lead{color:var(--muted); max-width: 900px}

    /* ===================== Liquid Background ===================== */
    .liquid-bg{
      position:fixed; inset:0; z-index:0; overflow:hidden; pointer-events:none;
      filter: blur(32px) saturate(120%);
      opacity:.8;
    }
    .blob{position:absolute; width:50vmax; height:50vmax; border-radius:50%;
      background: radial-gradient(closest-side, rgba(124,150,255,.9), transparent 65%);
      animation: float 18s ease-in-out infinite;
      mix-blend-mode: screen;
    }
    .blob.b2{background: radial-gradient(closest-side, rgba(33,212,180,.9), transparent 65%); animation-duration: 22s;}
    .blob.b3{background: radial-gradient(closest-side, rgba(255,105,180,.75), transparent 65%); animation-duration: 26s;}
    @keyframes float{0%{transform: translate(-10%, -10%)}33%{transform: translate(60%, -20%)}66%{transform: translate(0%, 40%)}100%{transform: translate(-10%, -10%)}}

    /* ===================== Topbar / Nav ===================== */
    .topbar{
      position: sticky; top: 10px; z-index: 3; display:flex; gap:12px; align-items:center; justify-content:space-between;
      background: var(--glass); border:1px solid var(--glass-border); backdrop-filter: blur(12px);
      border-radius: 16px; padding: 10px 12px; box-shadow: var(--shadow-lg);
    }
    .brand{display:flex; align-items:center; gap:10px; font-weight:800}
    .brand .logo{width:28px; height:28px; border-radius:8px; background:linear-gradient(135deg, var(--primary), transparent); box-shadow: inset 0 0 0 2px var(--glass-border)}
    .nav{display:flex; gap:6px; flex-wrap:wrap}
    .nav a{display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:12px; font-weight:600;
      background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0));
      border:1px solid var(--glass-border);
    }
    .nav a.active{background: linear-gradient(180deg, rgba(124,150,255,.25), rgba(124,150,255,.08));}

    .theme-toggle{
      background: var(--glass); border:1px solid var(--glass-border); backdrop-filter: blur(10px);
      border-radius: 999px; padding: 8px 10px; box-shadow: var(--shadow-lg); cursor: pointer; user-select: none;
    }

    /* ===================== Hero (About teaser) ===================== */
    .hero{padding-top: clamp(36px, 6vw, 72px); text-align:center}
    .buttons{display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:16px}
    .btn{display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px; font-weight:600; color:var(--text);
      background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0));
      border:1px solid var(--glass-border); backdrop-filter: blur(12px); box-shadow: var(--shadow-lg);
      transition: transform .15s ease
    }
    .btn:hover{transform:translateY(-1px)}
    .btn.primary{background: linear-gradient(180deg, rgba(124,150,255,.25), rgba(124,150,255,.08));}

    /* ===================== Cards & Layout ===================== */
    .grid{display:grid; gap: clamp(14px, 2vw, 22px); grid-template-columns: repeat(1, minmax(0,1fr));}
    @media (min-width: 720px){ .grid{grid-template-columns: repeat(2, minmax(0,1fr));} }
    @media (min-width: 1040px){ .grid{grid-template-columns: repeat(3, minmax(0,1fr));} }

    .card{position:relative; overflow:hidden; border-radius: var(--card-radius); background: var(--glass); border:1px solid var(--glass-border); backdrop-filter: blur(14px); box-shadow: var(--shadow-lg);}
    .card::before{content:""; position:absolute; inset:-50% -20%; transform: rotate(8deg);
      background: radial-gradient(60% 60% at 50% 30%, rgba(255,255,255,.25), transparent 60%),
                  linear-gradient( to bottom, rgba(255,255,255,.08), rgba(255,255,255,0)); mix-blend-mode: overlay; pointer-events:none}
    .card-body{position:relative; padding: clamp(16px, 2.2vw, 22px)}
    .meta{display:flex; gap:10px; flex-wrap:wrap; align-items:center; font-size:.9em; color:var(--muted)}
    .chip{display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background: linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04)); border:1px solid var(--glass-border); backdrop-filter: blur(8px)}

    /* ===================== Members ===================== */
    .people-grid{display:grid; gap: clamp(14px, 2vw, 22px); grid-template-columns: repeat(1, minmax(0,1fr));}
    @media (min-width: 720px){ .people-grid{grid-template-columns: repeat(2, minmax(0,1fr));} }
    @media (min-width: 1040px){ .people-grid{grid-template-columns: repeat(3, minmax(0,1fr));} }
    .person{display:grid; grid-template-columns:64px 1fr; gap:12px; align-items:center}
    .avatar{width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg, var(--primary), transparent); border:1px solid var(--glass-border)}
    .person .name{font-weight:800}
    .person .role{color:var(--muted)}

    /* ===================== Research (Publications & Projects) ===================== */
    .pub-list{display:grid; gap:14px}
    .pub-item{padding:14px; border-radius:14px; border:1px dashed var(--glass-border); background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,0))}
    .pub-title{font-weight:700}
    .pub-authors,.pub-venue{color:var(--muted); font-size:.95em}

    .project-thumb{height:160px; border-radius:14px; background:linear-gradient(135deg, rgba(124,150,255,.25), transparent), linear-gradient(135deg, rgba(33,212,180,.18), transparent); border:1px solid var(--glass-border); margin-bottom:10px}

    /* ===================== Activity (News & Tips/Notes) ===================== */
    .tabs{display:flex; gap:8px; margin-bottom:12px}
    .tab{padding:8px 12px; border-radius:999px; border:1px solid var(--glass-border); background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0)); cursor:pointer; font-weight:600}
    .tab[aria-selected="true"]{background: linear-gradient(180deg, rgba(124,150,255,.25), rgba(124,150,255,.08));}
    .activity-cols{display:grid; gap: clamp(14px, 2vw, 22px); grid-template-columns: 1fr}
    @media (min-width: 1040px){ .activity-cols{grid-template-columns: 1.2fr .8fr} }

    .news-list,.tips-list{display:grid; gap:12px}
    .news-item,.tip-item{padding:12px 14px; border:1px solid var(--glass-border); border-radius:14px; background:var(--glass)}
    .news-item time{color:var(--muted); font-size:.9em}

    /* ===================== Footer ===================== */
    footer{ text-align:center; color:var(--muted); padding: 40px 0; }

    /* No backdrop-filter fallback */
    @supports not ((backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px))){
      .btn, .card, .theme-toggle, .topbar{ background: rgba(255,255,255,.12); }
    }
  </style>
</head>
<body>
  <!-- Liquid background -->
  <div class="liquid-bg" aria-hidden="true">
    <div class="blob b1" style="top:-10vmax; left:-10vmax"></div>
    <div class="blob b2" style="bottom:-10vmax; right:-5vmax"></div>
    <div class="blob b3" style="top:20vmax; left:35vmax"></div>
  </div>

  <div class="wrap">
    <!-- Topbar / Nav (목차: About – Members – Research – Activity) -->
    <div class="topbar" role="navigation" aria-label="사이트 내비게이션">
      <div class="brand">
        <div class="logo" aria-hidden="true"></div>
        <span>연구실 이름</span>
      </div>
      <nav class="nav" id="mainNav">
        <a href="#about" data-link="about">About</a>
        <a href="#members" data-link="members">Members</a>
        <a href="#research" data-link="research">Research</a>
        <a href="#activity" data-link="activity">Activity</a>
      </nav>
      <button class="theme-toggle" id="themeBtn" title="테마 전환 (Light/Dark)">🌓</button>
    </div>

    <!-- Hero / About (메인 페이지 홍보/소개) -->
    <section id="about" class="section hero" aria-labelledby="about-title">
      <span class="kicker">About</span>
      <h1 id="about-title">[연구실 이름]은 데이터·딥러닝 기반의 <em>시계열, 확률적 모델링, 실시간 시스템</em>을 연구합니다.</h1>
      <p class="lead">
        우리는 Mixture Density Network, 연속시간 Transformer, 확산모형 등의 최신 방법론을 활용하여
        <strong>이상탐지, 변화점 검출, 확률적 예측</strong> 문제를 다룹니다. 학제 간 협업과 재현 가능한 코드를 지향하며,
        오픈소스와 실전 애플리케이션을 연결합니다.
      </p>
      <div class="buttons" aria-label="주요 링크">
        <a class="btn primary" href="#research">연구 살펴보기</a>
        <a class="btn" href="#members">사람들 보기</a>
        <a class="btn" href="#activity">소식 & 노트</a>
      </div>
    </section>

    <!-- Members (요약 카드 + 역할/분야 태그) -->
    <section id="members" class="section" aria-labelledby="members-title">
      <div class="head">
        <span class="kicker">Members</span>
        <h2 id="members-title">연구실 구성원</h2>
        <p class="lead">간단한 소개와 역할을 확인하고, 상세프로필은 멤버 페이지에서 볼 수 있도록 구성하세요.</p>
      </div>
      <div class="people-grid">
        <!-- PI -->
        <article class="card" aria-label="PI">
          <div class="card-body person">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <div class="name">홍길동, Ph.D. <span class="chip">PI</span></div>
              <div class="role">확률적 시계열 · MDN · 실시간 ML</div>
              <div class="meta"><a href="#">프로필</a> · <a href="mailto:pi@example.com">이메일</a></div>
            </div>
          </div>
        </article>
        <!-- Student sample -->
        <article class="card" aria-label="석사과정">
          <div class="card-body person">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <div class="name">김학생 <span class="chip">M.S.</span></div>
              <div class="role">연속시간 Transformer · 불규칙 시계열</div>
              <div class="meta"><a href="#">프로필</a> · <a href="#">GitHub</a></div>
            </div>
          </div>
        </article>
        <article class="card" aria-label="박사과정">
          <div class="card-body person">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <div class="name">이연구 <span class="chip">Ph.D.</span></div>
              <div class="role">확산모형 · 변분추론</div>
              <div class="meta"><a href="#">프로필</a> · <a href="#">Google Scholar</a></div>
            </div>
          </div>
        </article>
      </div>
      <div class="buttons" style="margin-top:16px">
        <a class="btn" href="#">전체 멤버 보기</a>
      </div>
    </section>

    <!-- Research (Publications + Projects 포함) -->
    <section id="research" class="section" aria-labelledby="research-title">
      <div class="head">
        <span class="kicker">Research</span>
        <h2 id="research-title">연구 (Publications & Projects)</h2>
        <p class="lead">논문과 프로젝트를 한 곳에서 요약 제공하고, 상세는 전용 페이지에서 확인할 수 있게 구성합니다.</p>
      </div>

      <div class="grid">
        <!-- Publications summary card -->
        <article class="card">
          <div class="card-body">
            <h3>Publications</h3>
            <div class="pub-list">
              <div class="pub-item">
                <div class="pub-title">Machine Learning Method to Detect Changing States in Quasar Light Curves. I.</div>
                <div class="pub-authors">A. Author, B. Author, <strong>You</strong>, et al.</div>
                <div class="pub-venue">2025 · Journal/Conference</div>
                <div class="meta"><span class="chip">MDN</span><span class="chip">CDE</span><a class="chip" href="#">PDF</a><a class="chip" href="#">Code</a></div>
              </div>
              <div class="pub-item">
                <div class="pub-title">Real-time Point Anomaly Detection via Recurrent MDN</div>
                <div class="pub-authors">C. Researcher, D. Researcher</div>
                <div class="pub-venue">2024 · Conference Name</div>
                <div class="meta"><span class="chip">RMDN</span><span class="chip">Streaming</span><a class="chip" href="#">PDF</a></div>
              </div>
            </div>
            <div class="buttons" style="margin-top:12px"><a class="btn" href="#">더 보기</a></div>
          </div>
        </article>

        <!-- Projects summary card -->
        <article class="card">
          <div class="card-body">
            <h3>Projects</h3>
            <div class="project-thumb" aria-hidden="true"></div>
            <p>실시간 이상탐지 데모 (MDN/RMDN 기반 CDE 추정), 연속시간 Transformer로 불규칙 시계열 예측, 확산 기반 확률적 예측 등.</p>
            <div class="meta">
              <span class="chip">Python</span>
              <span class="chip">Deep Learning</span>
              <span class="chip">Time-series</span>
              <a class="chip" href="#">Repos</a>
            </div>
            <div class="buttons" style="margin-top:12px"><a class="btn" href="#">프로젝트 모아보기</a></div>
          </div>
        </article>

        <!-- Research Areas card -->
        <article class="card">
          <div class="card-body">
            <h3>Research Areas</h3>
            <p>• Conditional Density Estimation (CDE), Mixture Density Networks (MDN/RMDN)<br>
               • Unsupervised/Streaming Anomaly & Change-point Detection<br>
               • Continuous-time Models (SDEs, Neural SDE, CT-Transformer), Diffusion models
            </p>
            <div class="meta"><span class="chip">Theory→System</span><span class="chip">Realtime</span><span class="chip">Open-source</span></div>
          </div>
        </article>
      </div>
    </section>

    <!-- Activity (Lab-news + Tips/Notes 공간) -->
    <section id="activity" class="section" aria-labelledby="activity-title">
      <div class="head">
        <span class="kicker">Activity</span>
        <h2 id="activity-title">연구실 활동</h2>
        <p class="lead">Lab-news 뿐 아니라 개인 생각, 선배들의 연구실 생활 팁, 글감 메모 등도 함께 모읍니다.</p>
      </div>

      <div class="activity-cols">
        <!-- Left: News -->
        <div>
          <div class="tabs" role="tablist" aria-label="뉴스/공지 탭">
            <button class="tab" role="tab" aria-selected="true" data-tab="news">Lab News</button>
            <button class="tab" role="tab" aria-selected="false" data-tab="events">Seminars & Events</button>
          </div>
          <div id="panel-news" class="news-list" role="tabpanel" aria-labelledby="news" tabindex="0">
            <article class="news-item">
              <time datetime="2025-08-01">2025-08-01</time>
              <h3>신입 랩멤버 모집 (Fall 2025)</h3>
              <p>시계열/확률모델/실시간 시스템에 관심 있는 학생을 찾습니다. 지원 안내는 링크 참고.</p>
              <div class="meta"><a class="chip" href="#">지원 안내</a></div>
            </article>
            <article class="news-item">
              <time datetime="2025-07-15">2025-07-15</time>
              <h3>논문 채택 소식</h3>
              <p>연속시간 Transformer 기반 예측 논문이 Top Conference에 채택되었습니다.</p>
              <div class="meta"><a class="chip" href="#">게시물</a></div>
            </article>
          </div>
          <div id="panel-events" class="news-list" role="tabpanel" hidden tabindex="0">
            <article class="news-item">
              <time datetime="2025-09-05">2025-09-05</time>
              <h3>게스트 세미나: Robust Realtime Anomaly Detection</h3>
              <p>산업 파트너와 공동 세미나. 실시간 스트리밍 환경에서의 강건한 이상탐지.</p>
              <div class="meta"><a class="chip" href="#">등록</a></div>
            </article>
          </div>
        </div>

        <!-- Right: Tips & Notes (개인 생각/팁 공간) -->
        <aside>
          <div class="card">
            <div class="card-body">
              <h3>Tips & Notes</h3>
              <p class="lead">개인적으로 적을 생각들, 선배들의 연구실 팁, 자주 보는 레퍼런스 링크를 여기에 모읍니다.</p>
              <div class="tips-list">
                <div class="tip-item">
                  <strong>실험 로그를 구조화하기</strong>
                  <p>Weights & Biases 혹은 MLFlow로 공통 템플릿을 사용하세요. 실시간 태그: <code>streaming:true</code>, <code>latency:&lt;ms&gt;</code>.</p>
                </div>
                <div class="tip-item">
                  <strong>코드리뷰 팁</strong>
                  <p>PR은 300줄 이내, 주요 실험/결과는 README에 요약. 재현 스크립트는 <code>scripts/repro.sh</code> 고정.</p>
                </div>
              </div>
              <div class="buttons" style="margin-top:12px">
                <a class="btn" href="#">모든 노트 보기</a>
                <a class="btn" href="#">기여 가이드</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <footer id="contact" class="section" aria-labelledby="contact-title">
      <div class="head" style="text-align:center">
        <span class="kicker">Contact</span>
        <h2 id="contact-title">문의</h2>
        <p class="lead">이메일: contact@example.com · 주소: 서울시 어딘가 123, 연구동 4층 401호</p>
        <p><a class="btn" href="#">오시는 길</a> <a class="btn" href="#">채용/지원</a></p>
      </div>
      <p style="text-align:center; color:var(--muted); margin-top:30px">© 2025 [연구실 이름] · <a href="#">GitHub</a> · <a href="#">Scholar</a></p>
    </footer>
  </div>

  <script>
    // ============ Light/Dark toggle with persistence ============
    (function(){
      const key = 'theme';
      const btn = document.getElementById('themeBtn');
      const root = document.documentElement;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      function applyTheme(v){ root.setAttribute('data-theme', v); try{ localStorage.setItem(key, v); }catch(e){} }
      function currentTheme(){ const saved = localStorage.getItem(key); if(saved==='light'||saved==='dark') return saved; return prefersDark ? 'dark' : 'light'; }
      applyTheme(currentTheme());
      btn.addEventListener('click', ()=> applyTheme(root.getAttribute('data-theme')==='dark' ? 'light' : 'dark'));
    })();

    // ============ Intersection-based nav highlight ============
    const links = document.querySelectorAll('#mainNav a');
    const map = new Map(Array.from(links).map(a => [a.dataset.link, a]));
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          map.forEach(el=>el.classList.remove('active'));
          const id = e.target.id; const link = map.get(id);
          if(link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    ['about','members','research','activity'].forEach(id=>{ const el = document.getElementById(id); if(el) obs.observe(el); });

    // ============ Activity tabs (News / Events) ============
    const tabBtns = document.querySelectorAll('.tab');
    const panels = {
      news: document.getElementById('panel-news'),
      events: document.getElementById('panel-events')
    };
    tabBtns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        tabBtns.forEach(b=>b.setAttribute('aria-selected','false'));
        btn.setAttribute('aria-selected','true');
        const k = btn.dataset.tab;
        Object.keys(panels).forEach(p=> panels[p].hidden = (p!==k));
        panels[k].hidden = false; panels[k].focus();
      });
    });

    // ============ Smooth scroll for in-page links ============
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
      });
    });
  </script>
</body>
</html>
