// ============================================================
//  PORTFOLIO APP.JS — Multi-page, card tilt,
//  creative loader, typewriter, wave, page transitions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── CREATIVE LOADER — only once per session ──────────────
  const loader = document.getElementById('page-loader');
  if (loader) {
    if (sessionStorage.getItem('loaderShown')) {
      loader.classList.add('hidden');
    } else {
      sessionStorage.setItem('loaderShown', '1');
      initLoader();
    }
  }

  // ── PAGE TRANSITIONS (intercept links) ───────────────────
  initPageTransitions();

  // ── NAV ACTIVE STATE ────────────────────────────────────
  const page = document.body.dataset.page || '';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (
      (page === 'home'  && (href === 'index.html' || href === './')) ||
      (page !== 'home'  && href === page + '.html')
    ) a.classList.add('active');
  });

  // ── NAV SCROLL ──────────────────────────────────────────
  const nav = document.getElementById('main-nav');
  const backTop = document.getElementById('back-top');
  const isMobile = () => window.innerWidth <= 768;
  function onScroll() {
    // On mobile, nav is always opaque — no transparent state
    if (nav) nav.classList.toggle('scrolled', isMobile() || window.scrollY > 40);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE NAV ──────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  // ── BACK TO TOP ─────────────────────────────────────────
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── REVEAL ON SCROLL ────────────────────────────────────
  // Immediately reveal anything already in the viewport so GSAP can't hide it later
  function revealInView() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
    });
  }
  revealInView();
  window.addEventListener('load', revealInView);

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── 3D CARD TILT ────────────────────────────────────────
  document.querySelectorAll('.tilt-card').forEach(card => applyTilt(card));

  // ── PAGE-SPECIFIC INIT ───────────────────────────────────
  switch (page) {
    case 'home':           initHero(); initStatCounters(); break;
    case 'about':          renderExperience(); renderSkills(); renderEducation(); break;
    case 'projects':       renderProjects(); break;
    case 'certifications': renderCertifications(); break;
    case 'blog':           renderBlog(); break;
  }

  // ── CONTACT FORM ────────────────────────────────────────
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';
      const endpoint = PORTFOLIO.contactFormEndpoint;
      const data = {
        name: form.name.value, email: form.email.value,
        subject: form.subject.value, message: form.message.value,
        timestamp: new Date().toISOString()
      };
      if (!endpoint) {
        status.className = 'form-status error';
        status.textContent = 'Form not yet configured. Email: ' + PORTFOLIO.email;
        btn.disabled = false; btn.textContent = 'Send Message'; return;
      }
      try {
        await fetch(endpoint, { method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        status.className = 'form-status success';
        status.textContent = "Message sent! I'll get back to you soon.";
        form.reset();
      } catch {
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please email directly.';
      }
      btn.disabled = false; btn.textContent = 'Send Message';
    });
  }

  // ── LUCIDE ICONS INIT ────────────────────────────────────
  if (window.lucide) window.lucide.createIcons();

  // ── PHASE 2 GLOBAL INTERACTIONS ─────────────────────────
  initSpotlight();
  initCommandPalette();
  initMagneticButtons();
  initChatbot();

  // ── PHASE 3 MOTION ───────────────────────────────────────
  initScrollProgress();
  initGSAP();
});

// ════════════════════════════════════════════════════════════
//  CREATIVE LOADER — playful emoji + typing name + fade exit
// ════════════════════════════════════════════════════════════
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const typeEl   = loader.querySelector('.loader-type-text');
  const fill     = loader.querySelector('.loader-progress-fill');
  const fullName = 'Aman Agarwal';
  let i = 0;

  setTimeout(() => {
    const iv = setInterval(() => {
      i++;
      if (typeEl) typeEl.textContent = fullName.slice(0, i);
      if (fill)   fill.style.width   = (i / fullName.length * 100) + '%';

      if (i >= fullName.length) {
        clearInterval(iv);
        // Clean fade — no blue curtain
        setTimeout(() => loader.classList.add('hidden'), 500);
      }
    }, 72);
  }, 180);
}

// ════════════════════════════════════════════════════════════
//  PAGE TRANSITIONS — fade-out before navigation
// ════════════════════════════════════════════════════════════
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.hasAttribute('download') || href.startsWith('javascript')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.add('page-exiting');
      setTimeout(() => { window.location.href = href; }, 310);
    });
  });
}

// ════════════════════════════════════════════════════════════
//  HERO — waving hand + typewriter name
// ════════════════════════════════════════════════════════════
function initHero() {
  const nameEl = document.getElementById('hero-type-name');
  if (nameEl) {
    const wrap = nameEl.closest('.typing-wrap');
    const fullName = 'Aman Agarwal.';
    let i = 0;
    nameEl.style.fontFamily = 'var(--font-head)';
    nameEl.style.fontWeight = '700';
    nameEl.style.color = 'var(--accent)';
    setTimeout(() => {
      const iv = setInterval(() => {
        nameEl.textContent = fullName.slice(0, ++i);
        if (i >= fullName.length) {
          clearInterval(iv);
          if (wrap) setTimeout(() => wrap.classList.add('typing-done'), 1400);
        }
      }, 76);
    }, 700);
  }
}

// ════════════════════════════════════════════════════════════
//  RENDER FUNCTIONS (one per page)
// ════════════════════════════════════════════════════════════

function renderExperience() {
  const c = document.getElementById('experience-list');
  if (!c) return;
  c.innerHTML = PORTFOLIO.experience.map((e, i) => `
    <div class="timeline-item reveal reveal-delay-${i+1}">
      <div class="timeline-card tilt-card">
        <div class="timeline-header">
          <div><div class="timeline-role">${e.role}</div><div class="timeline-company">${e.company}</div></div>
          <div class="timeline-meta">
            <span class="timeline-period">${e.period}</span>
            <span class="timeline-location">${e.location}</span>
          </div>
        </div>
        <ul class="timeline-highlights">${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
      </div>
    </div>`).join('');
  reObserve(c);
  c.querySelectorAll('.tilt-card').forEach(applyTilt);
  if (window.lucide) window.lucide.createIcons();
}

// ── Category meta ───────────────────────────────────────────
const PROJ_CATS = {
  all:        { label: 'All',               icon: 'layout-grid' },
  automation: { label: 'AI & Automation',   icon: 'cpu' },
  creative:   { label: 'Creative',          icon: 'film' }
};

function renderProjects() {
  const tabBar  = document.getElementById('proj-cat-tabs');
  const wrapper = document.getElementById('projects-sections');
  if (!wrapper) return;

  // Build tab list from categories that actually exist in data
  const usedCats = ['all', ...new Set(PORTFOLIO.projects.map(p => p.category).filter(Boolean))];

  if (tabBar) {
    tabBar.innerHTML = usedCats.map((cat, i) => {
      const meta = PROJ_CATS[cat] || { label: cat, icon: 'folder' };
      return `<button class="proj-cat-btn${i===0?' active':''}" data-cat="${cat}">
        <i data-lucide="${meta.icon}"></i>${meta.label}
      </button>`;
    }).join('');

    tabBar.querySelectorAll('.proj-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabBar.querySelectorAll('.proj-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawProjectSections(wrapper, btn.dataset.cat);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  drawProjectSections(wrapper, 'all');
}

function drawProjectSections(wrapper, activecat) {
  const projects = PORTFOLIO.projects;

  // Decide which categories to show
  const catsToShow = activecat === 'all'
    ? [...new Set(projects.map(p => p.category).filter(Boolean))]
    : [activecat];

  wrapper.innerHTML = catsToShow.map(cat => {
    const list = projects.filter(p => p.category === cat);
    if (!list.length) return '';
    const meta = PROJ_CATS[cat] || { label: cat, icon: 'folder' };
    return `
      <div class="proj-section" data-cat="${cat}">
        <div class="proj-section-header">
          <span class="proj-section-icon"><i data-lucide="${meta.icon}"></i></span>
          <span class="proj-section-label">${meta.label}</span>
          <span class="proj-section-count">${list.length} project${list.length>1?'s':''}</span>
        </div>
        <div class="projects-grid proj-cat-grid-${cat}">
          ${list.map((p, i) => projectCardHTML(p, i)).join('')}
        </div>
      </div>`;
  }).join('');

  if (!wrapper.innerHTML.trim()) {
    wrapper.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-soft)">No projects in this category yet.</div>`;
  }

  reObserve(wrapper);
  wrapper.querySelectorAll('.tilt-card').forEach(applyTilt);
  if (window.lucide) window.lucide.createIcons();
}

function projectCardHTML(p, i) {
  const delay = `reveal-delay-${(i % 3) + 1}`;

  // Creative / video card
  if (p.category === 'creative') {
    const cardInner = `
      ${p.thumbnail ? `<div class="proj-creative-thumb"><img src="${p.thumbnail}" alt="${p.title}" loading="lazy"/></div>` :
        p.videoEmbed ? `<div class="proj-video-wrap"><iframe src="${p.videoEmbed}" title="${p.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` : ''}
      <div class="proj-creative-body">
        <div class="project-tags">${p.tags.map(t=>`<span class="project-tag proj-tag-creative">${t}</span>`).join('')}</div>
        <div class="proj-creative-title">${p.title}</div>
        <div class="proj-creative-desc">${p.description}</div>
        <div class="proj-creative-footer">
          ${p.date ? `<span class="proj-creative-date">${p.date}</span>` : ''}
          <span class="proj-creative-link">${p.file ? 'View Project →' : 'Watch ↗'}</span>
        </div>
      </div>`;
    // Link to detail page if available, else YouTube
    if (p.file) {
      return `<a href="${p.file}" class="proj-creative-card tilt-card reveal ${delay}" style="text-decoration:none;color:inherit">${cardInner}</a>`;
    }
    return `<a href="${p.demo||'#'}" target="_blank" rel="noopener" class="proj-creative-card tilt-card reveal ${delay}" style="text-decoration:none;color:inherit">${cardInner}</a>`;
  }

  // Standard automation card (with detail page)
  if (p.file) {
    return `
      <a href="${p.file}" class="blog-card tilt-card reveal ${delay}" style="text-decoration:none;color:inherit;display:flex;flex-direction:column">
        ${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title}" style="width:100%;height:190px;object-fit:cover;display:block;" />` : ''}
        <div class="blog-card-body">
          <div class="project-tags" style="margin-bottom:.6rem">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
          <div class="blog-card-title">${p.title}</div>
          <div class="blog-card-summary">${p.description}</div>
        </div>
        <div class="blog-card-footer"><span class="blog-date">${p.date||''}</span><span class="blog-read">View Project →</span></div>
      </a>`;
  }

  // Fallback plain card
  return `
    <div class="project-card tilt-card reveal ${delay}">
      <div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.description}</div>
      <div class="project-links">
        ${p.github?`<a href="${p.github}" target="_blank" rel="noopener" class="project-link">GitHub</a>`:''}
        ${p.demo?`<a href="${p.demo}" target="_blank" rel="noopener" class="project-link">Live Demo</a>`:''}
      </div>
    </div>`;
}

function renderSkills() {
  const ICONS = {
    'n8n / Workflow Automation': 'zap',
    'Python': 'terminal',
    'API Integrations': 'link-2',
    'Multi-Agent AI Systems': 'bot',
    'MCP': 'cpu',
    'Full-Stack Development': 'code',
    'MS Office Suite': 'file-text'
  };
  const SOFT_ICONS = {
    'Problem Solving': 'puzzle',
    'Self-Learning': 'book-open',
    'Project Ownership': 'target',
    'Clear Communication': 'message-circle',
    'Systems Thinking': 'network'
  };
  const CREATIVE_ICONS = {
    'Visual Storyteller': 'layout-template',
    'AI Image & Video Creation': 'film'
  };

  const cards = document.getElementById('skill-cards');
  if (cards) {
    cards.innerHTML = PORTFOLIO.skills.technical.map(s => {
      const icon = ICONS[s.name] || 'settings-2';
      return `<div class="skill-card reveal">
        <i data-lucide="${icon}" style="width:28px;height:28px;stroke-width:1.5;color:var(--accent)"></i>
        <div class="skill-card-name">${s.name}</div>
      </div>`;
    }).join('');
    reObserve(cards);
    cards.querySelectorAll('.skill-card').forEach(applyTilt);
    if (window.lucide) window.lucide.createIcons();
  }

  const creative = document.getElementById('creative-cards');
  if (creative && PORTFOLIO.skills.creative) {
    creative.innerHTML = PORTFOLIO.skills.creative.map(s => `
      <div class="soft-card">
        <div class="soft-card-icon"><i data-lucide="${CREATIVE_ICONS[s]||'sparkles'}" style="width:22px;height:22px;stroke-width:1.5;color:var(--accent-2)"></i></div>
        <div class="soft-card-name">${s}</div>
      </div>`).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  const soft = document.getElementById('soft-cards');
  if (soft) {
    soft.innerHTML = PORTFOLIO.skills.soft.map(s => `
      <div class="soft-card">
        <div class="soft-card-icon"><i data-lucide="${SOFT_ICONS[s]||'star'}" style="width:22px;height:22px;stroke-width:1.5;color:var(--accent)"></i></div>
        <div class="soft-card-name">${s}</div>
      </div>`).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  const tools = document.getElementById('tools-chips');
  if (tools) {
    tools.innerHTML = PORTFOLIO.skills.tools.map(t =>
      `<span class="tool-chip">${t}</span>`).join('');
  }
}

function renderEducation() {
  const c = document.getElementById('education-list');
  if (!c) return;
  c.innerHTML = PORTFOLIO.education.map(e => `
    <div class="edu-card reveal tilt-card">
      <div class="edu-icon">
        ${e.logo
          ? `<img src="${e.logo}" alt="${e.institution} logo" class="edu-logo-img" />`
          : `<i data-lucide="graduation-cap" style="width:28px;height:28px;stroke-width:1.5;color:var(--accent)"></i>`}
      </div>
      <div>
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-institution">${e.institution}</div>
        <div class="edu-meta"><span>${e.period}</span></div>
        <p class="edu-details">${e.details}</p>
      </div>
    </div>`).join('');
  reObserve(c);
  c.querySelectorAll('.tilt-card').forEach(applyTilt);
  if (window.lucide) window.lucide.createIcons();
}

function renderCertifications() {
  const c = document.getElementById('certs-container');
  if (!c) return;
  if (!PORTFOLIO.certifications || PORTFOLIO.certifications.length === 0) {
    c.innerHTML = `<div class="certs-empty reveal">
      <div style="margin-bottom:.75rem"><i data-lucide="award" style="width:40px;height:40px;stroke-width:1.5;color:var(--text-soft)"></i></div>
      <h3 style="color:var(--text-mid);margin-bottom:.5rem">Certifications Coming Soon</h3>
      <p>Check back here for credentials and course completions.</p>
    </div>`;
  } else {
    c.innerHTML = `<div class="certs-grid">${PORTFOLIO.certifications.map((cert,i)=>`
      <div class="cert-card tilt-card reveal reveal-delay-${(i%3)+1}">
        <div class="cert-thumb cert-thumb-${cert.thumbStyle||'default'}">
          <div class="cert-thumb-badge">✓ Certificate of Completion</div>
          <div class="cert-thumb-course">${cert.title}</div>
          <div class="cert-thumb-by">${cert.issuer}</div>
        </div>
        <div class="cert-body">
          <div class="cert-title">${cert.title}</div>
          <div class="cert-issuer">${cert.issuer}</div>
          <div class="cert-date">${cert.date}</div>
          ${cert.description?`<p class="cert-desc">${cert.description}</p>`:''}
          ${cert.pdfFile?`<a href="${cert.pdfFile}" target="_blank" rel="noopener" class="cert-view-btn">View Certificate →</a>`:''}
        </div>
      </div>`).join('')}</div>`;
    c.querySelectorAll('.tilt-card').forEach(applyTilt);
  }
  reObserve(c);
  if (window.lucide) window.lucide.createIcons();
}

function renderBlog() {
  const c = document.getElementById('blog-grid');
  if (!c) return;
  if (!PORTFOLIO.blog || PORTFOLIO.blog.length === 0) {
    c.innerHTML = `<div class="blog-empty">
      <div style="margin-bottom:.75rem"><i data-lucide="pen-tool" style="width:40px;height:40px;stroke-width:1.5;color:var(--text-soft)"></i></div>
      <h3>No posts yet — check back soon!</h3>
      <p>Thoughts on AI automation, building in public, and lessons from shipping real projects.</p>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  c.innerHTML = PORTFOLIO.blog.map((post,i)=>`
    <a href="${post.file}" class="blog-card tilt-card reveal reveal-delay-${(i%3)+1}" style="text-decoration:none;color:inherit;display:flex;flex-direction:column">
      ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.title}" style="width:100%;height:190px;object-fit:cover;display:block;" />` : ''}
      <div class="blog-card-body">
        <div class="blog-tags">${post.tags.map(t=>`<span class="blog-tag">${t}</span>`).join('')}</div>
        <div class="blog-card-title">${post.title}</div>
        <div class="blog-card-summary">${post.summary}</div>
      </div>
      <div class="blog-card-footer"><span class="blog-date">${post.date}</span><span class="blog-read">Read →</span></div>
    </a>`).join('');
  reObserve(c);
  c.querySelectorAll('.tilt-card').forEach(applyTilt);
  if (window.lucide) window.lucide.createIcons();
}

// ── HELPERS ──────────────────────────────────────────────────
function reObserve(container) {
  // Immediately reveal anything already in the viewport (synchronous — no flash)
  container.querySelectorAll('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
  });
  // Observer handles the rest as user scrolls
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  container.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

function applyTilt(card) {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x*12}deg) rotateX(${-y*12}deg) translateY(-5px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
}

// ════════════════════════════════════════════════════════════
//  PHASE 2 — SIGNATURE INTERACTIONS
// ════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
//  PHASE 3 — MOTION POLISH
// ════════════════════════════════════════════════════════════

// ── SCROLL PROGRESS BAR ──────────────────────────────────────
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      bar.style.width = (Math.min(pct, 1) * 100) + '%';
      ticking = false;
    });
  }, { passive: true });
}

// ── GSAP SCROLL CHOREOGRAPHY ─────────────────────────────────
function loadGSAP(cb) {
  if (window.gsap && window.ScrollTrigger) { cb(); return; }
  const s1 = document.createElement('script');
  s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  s1.onload = () => {
    const s2 = document.createElement('script');
    s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
    s2.onload = cb;
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
}

function initGSAP() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGSAP(() => {
    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);
    const ST = window.ScrollTrigger;

    // ── Hero parallax (bg grid drifts slower than content)
    const bgGrid = document.querySelector('.hero-bg-grid');
    if (bgGrid) {
      gsap.to(bgGrid, {
        y: 90, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    }

    // ── Stagger card grids
    const GRIDS = [
      { wrap: '.ql-grid',        items: '.ql-card' },
      { wrap: '.skill-cards-grid', items: '.skill-card' },
      { wrap: '.soft-grid',      items: '.soft-card' },
      // #projects-sections is dynamically rendered — reObserve() handles reveal, GSAP skips it
      { wrap: '.blog-grid',      items: '.blog-card' },
      { wrap: '.certs-grid',     items: '.cert-card' },
      { wrap: '.stats-grid',     items: '.stat-item' },
    ];
    GRIDS.forEach(({ wrap, items }) => {
      const grid = document.querySelector(wrap);
      if (!grid) return;
      const cards = grid.querySelectorAll(items);
      if (!cards.length) return;
      // Clear CSS reveal opacity so GSAP takes over
      cards.forEach(c => { c.style.opacity = ''; c.style.transform = ''; });
      gsap.fromTo(cards,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 82%', once: true } }
      );
    });

    // ── Section label + title: handled by IntersectionObserver, not GSAP
    // (GSAP inline opacity:0 overrides .visible on mobile, causing hidden headings)

    // ── Timeline items stagger
    const timeline = document.querySelector('.timeline');
    if (timeline) {
      gsap.fromTo(timeline.querySelectorAll('.timeline-item'),
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: timeline, start: 'top 78%', once: true } }
      );
    }

    // ── Edu card
    const eduCard = document.querySelector('.edu-card');
    if (eduCard) {
      gsap.fromTo(eduCard,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: eduCard, start: 'top 80%', once: true } }
      );
    }

    // ── About terminal card
    const avWrap = document.querySelector('.av-wrap');
    if (avWrap) {
      gsap.fromTo(avWrap,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: avWrap, start: 'top 80%', once: true } }
      );
      gsap.fromTo(avWrap.querySelectorAll('.av-chip'),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: avWrap, start: 'top 75%', once: true } }
      );
    }
  });
}

// ── STAT COUNTERS ────────────────────────────────────────────
function initStatCounters() {
  const items = document.querySelectorAll('.stat-number[data-count]');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el     = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const duration = 900;
      const step = Math.max(1, Math.ceil(target / (duration / 30)));
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(iv);
      }, 30);
    });
  }, { threshold: 0.6 });
  items.forEach(el => obs.observe(el));
}

// ── MOUSE SPOTLIGHT (ambient glow, all pages) ────────────────
function initSpotlight() {
  let ticking = false;
  document.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
      ticking = false;
    });
  });
}

// ── COMMAND PALETTE ──────────────────────────────────────────
function initCommandPalette() {
  const CMD_PAGES = [
    { label:'Home',           icon:'home',           href:'index.html',          sub:'Portfolio overview' },
    { label:'About',          icon:'user',           href:'about.html',          sub:'Who I am, experience, education & skills' },
    { label:'Projects',       icon:'rocket',         href:'projects.html',       sub:'Things I\'ve built' },
    { label:'Certifications', icon:'award',          href:'certifications.html', sub:'Credentials & courses' },
    { label:'Blog',           icon:'pen-tool',       href:'blog.html',           sub:'My writing' },
    { label:'Contact',        icon:'mail',           href:'contact.html',        sub:'Let\'s talk' },
  ];

  // Inject palette DOM
  const palette = document.createElement('div');
  palette.id = 'cmd-palette';
  palette.className = 'cmd-overlay';
  palette.setAttribute('aria-hidden', 'true');
  palette.innerHTML = `
    <div class="cmd-box" role="dialog" aria-label="Command palette">
      <div class="cmd-search-row">
        <i data-lucide="search" class="cmd-search-icon"></i>
        <input id="cmd-input" type="text" placeholder="Search pages…" autocomplete="off" spellcheck="false" />
        <kbd class="cmd-esc-key">ESC</kbd>
      </div>
      <div class="cmd-results" id="cmd-results" role="listbox"></div>
      <div class="cmd-footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span><kbd>↵</kbd> open</span>
        <span><kbd>Ctrl K</kbd> toggle</span>
      </div>
    </div>`;
  document.body.appendChild(palette);
  if (window.lucide) window.lucide.createIcons();

  const input   = document.getElementById('cmd-input');
  const results = document.getElementById('cmd-results');
  let active = 0, filtered = [...CMD_PAGES];

  function renderResults(q = '') {
    filtered = q
      ? CMD_PAGES.filter(p => (p.label + p.sub).toLowerCase().includes(q.toLowerCase()))
      : [...CMD_PAGES];
    active = 0;
    results.innerHTML = filtered.length
      ? filtered.map((p, i) => `
        <div class="cmd-item${i===0?' cmd-item-active':''}" data-idx="${i}" role="option">
          <div class="cmd-item-icon"><i data-lucide="${p.icon}"></i></div>
          <div class="cmd-item-body">
            <div class="cmd-item-label">${p.label}</div>
            <div class="cmd-item-sub">${p.sub}</div>
          </div>
          <i data-lucide="arrow-right" class="cmd-item-arrow"></i>
        </div>`).join('')
      : `<div class="cmd-empty">No results for "<em>${q}</em>"</div>`;
    if (window.lucide) window.lucide.createIcons();
  }

  function setActive(idx) {
    results.querySelectorAll('.cmd-item').forEach((el, i) =>
      el.classList.toggle('cmd-item-active', i === idx));
    const el = results.querySelectorAll('.cmd-item')[idx];
    if (el) el.scrollIntoView({ block: 'nearest' });
    active = idx;
  }

  function openPalette() {
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    renderResults();
    setTimeout(() => input.focus(), 60);
  }

  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    input.value = '';
  }

  function go() { if (filtered[active]) window.location.href = filtered[active].href; }

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      palette.classList.contains('open') ? closePalette() : openPalette();
    }
    if (!palette.classList.contains('open')) return;
    if (e.key === 'Escape')    closePalette();
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active+1, filtered.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(Math.max(active-1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); go(); }
  });

  input.addEventListener('input', e => renderResults(e.target.value));
  results.addEventListener('click', e => {
    const item = e.target.closest('.cmd-item');
    if (item) { active = +item.dataset.idx; go(); }
  });
  results.addEventListener('mousemove', e => {
    const item = e.target.closest('.cmd-item');
    if (item) setActive(+item.dataset.idx);
  });
  palette.addEventListener('click', e => { if (e.target === palette) closePalette(); });

  // ⌘K hint in nav
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    const hint = document.createElement('button');
    hint.className = 'cmd-nav-hint';
    hint.setAttribute('aria-label', 'Command palette (Ctrl+K)');
    hint.title = 'Ctrl+K / ⌘K';
    hint.textContent = '⌘K';
    hint.addEventListener('click', openPalette);
    hamburger.parentElement.insertBefore(hint, hamburger);
  }
}

// ── RECRUITER CHATBOT ────────────────────────────────────────
function initChatbot() {
  const P = (typeof PORTFOLIO !== 'undefined') ? PORTFOLIO : {};

  // Floating action button
  const fab = document.createElement('button');
  fab.id = 'chat-fab';
  fab.className = 'chatbot-btn';
  fab.setAttribute('aria-label', 'Open chat');
  fab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

  // Chat panel
  const panel = document.createElement('div');
  panel.id = 'chat-panel';
  panel.className = 'chatbot-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="chatbot-header">
      <div class="chatbot-header-info">
        <div class="chatbot-avatar">AA</div>
        <div>
          <div class="chatbot-header-name">Aman's Assistant</div>
          <div class="chatbot-header-sub">Ask me anything</div>
        </div>
      </div>
      <button class="chatbot-close" id="chat-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="chatbot-messages" id="chat-messages"></div>
    <div class="chat-quick" id="chat-quick"></div>
    <div class="chatbot-input-row">
      <input id="chatbot-input" type="text" placeholder="Ask about skills, projects…" autocomplete="off" />
      <button id="chatbot-send" aria-label="Send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>`;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const msgs      = document.getElementById('chat-messages');
  const inputEl   = document.getElementById('chatbot-input');
  const sendBtn   = document.getElementById('chatbot-send');
  const closeBtn  = document.getElementById('chat-close');
  const quickArea = document.getElementById('chat-quick');

  let isOpen = false;
  const QUICK_LABELS = ['Skills', 'Projects', 'Experience', 'Contact'];

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    fab.classList.toggle('active', isOpen);
    if (isOpen && msgs.children.length === 0) greet();
    else if (isOpen) inputEl.focus();
  }

  fab.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);

  function addMsg(html, role, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const m = document.createElement('div');
        m.className = `chat-msg chat-msg-${role}`;
        m.innerHTML = html;
        msgs.appendChild(m);
        msgs.scrollTop = msgs.scrollHeight;
        resolve();
      }, delay || 0);
    });
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'chat-msg chat-msg-bot chat-typing';
    t.id = 'chat-typing-ind';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    return t;
  }

  async function botReply(html, delay) {
    const t = showTyping();
    await new Promise(r => setTimeout(r, delay || 650));
    t.remove();
    await addMsg(html, 'bot');
    setQuick(QUICK_LABELS);
    inputEl.focus();
  }

  function setQuick(labels) {
    quickArea.innerHTML = labels.map(l =>
      `<button class="chat-quick-btn" data-q="${l}">${l}</button>`).join('');
  }

  quickArea.addEventListener('click', e => {
    const btn = e.target.closest('.chat-quick-btn');
    if (!btn) return;
    const q = btn.dataset.q;
    addMsg(q, 'user');
    quickArea.innerHTML = '';
    handleQuery(q);
  });

  function greet() {
    addMsg(`Hi! I'm Aman's assistant 👋<br>Ask me about his <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, or how to <strong>get in touch</strong>.`, 'bot', 300);
    setTimeout(() => { setQuick(QUICK_LABELS); inputEl.focus(); }, 700);
  }

  function handleQuery(q) {
    const lo = q.toLowerCase().trim();

    // Greeting
    if (/^(hi|hello|hey|sup|howdy|yo\b)/i.test(lo)) {
      botReply(`Hey! 👋 Happy to help. You can ask me about Aman's skills, projects, experience, education, or how to contact him.`);
      return;
    }

    // Skills — general
    if (/\bskills?\b|\btech\b|\bstack\b|\btools?\b|\bexpertise\b|\bknow\b/i.test(lo)) {
      const tech = (P.skills && P.skills.technical)
        ? P.skills.technical.map(s => `<span class="cb-tag">${s.name}</span>`).join('')
        : '';
      const soft  = (P.skills && P.skills.soft)  ? P.skills.soft.join(', ')  : '';
      const tools = (P.skills && P.skills.tools) ? P.skills.tools.join(', ') : '';
      botReply(`Here's Aman's full toolkit:<br><br><strong>Technical:</strong><div class="cb-tags">${tech}</div><strong>Soft Skills:</strong> ${soft}<br><strong>Tools:</strong> ${tools}`);
      return;
    }

    // Skills — specific
    if (/\bpython\b/i.test(lo)) {
      botReply(`Python is one of Aman's core languages. He uses it for FastAPI backends, automation scripts, and multi-agent AI systems.`);
      return;
    }
    if (/\bn8n\b|\bworkflow\b|\bautomat/i.test(lo)) {
      botReply(`n8n is Aman's primary automation platform. He's built multi-agent pipelines, voice-to-document workflows, and AI content delivery bots — all self-hosted on a Hetzner VPS.`);
      return;
    }
    if (/\bfastapi\b|\bflask\b|\bapi\b|\bbackend\b/i.test(lo)) {
      botReply(`Aman builds REST APIs with Python (FastAPI & Flask) and deploys them on Hetzner VPS as part of larger multi-agent systems.`);
      return;
    }
    if (/\brag\b|\bllm\b|\bvector\b|\bchroma\b|\bembedding/i.test(lo)) {
      botReply(`Aman builds RAG pipelines using ChromaDB for vector storage. His AiSolutions RevOps project features a live voice RAG agent powered by ElevenLabs + Gemini.`);
      return;
    }
    if (/\btelegram\b/i.test(lo)) {
      botReply(`Telegram is Aman's go-to delivery layer for automation bots — he's built bots for AI essay summaries (Aeon) and voice-to-quotation workflows (SaudaaAI).`);
      return;
    }
    if (/\bgoogle sheets?\b|\bapps script\b/i.test(lo)) {
      botReply(`During his internship at Marudhar Industries, Aman built apps integrated with Google Sheets for real-time data sync across departments — replacing manual paper processes.`);
      return;
    }

    // Projects — general
    if (/\bprojects?\b|\bbuilt\b|\bbuild\b|\bportfolio\b/i.test(lo)) {
      const list = (P.projects || []).map(p =>
        `<li><strong>${p.title}</strong> <em>(${p.date || ''})</em><br><span style="font-size:.78rem;color:var(--text-soft)">${p.tags.join(', ')}</span></li>`
      ).join('');
      botReply(`Aman has ${(P.projects||[]).length} featured projects:<ul style="margin:.5rem 0 0 1.1rem;padding:0;display:flex;flex-direction:column;gap:.5rem">${list}</ul><br>Ask me about any one!`, 750);
      return;
    }

    // Projects — specific
    if (/revops|revenue|aisolutions|prospect|cold email/i.test(lo)) {
      const p = (P.projects||[]).find(x => /revops/i.test(x.title));
      if (p) botReply(`<strong>${p.title}</strong><br><br>${p.description}<br><br><em>Stack: ${p.tags.join(', ')}</em>`);
      return;
    }
    if (/saudaa|voice.*quot|quot.*voice|hindi|gujarati|commodity/i.test(lo)) {
      const p = (P.projects||[]).find(x => /saudaa/i.test(x.title));
      if (p) botReply(`<strong>${p.title}</strong><br><br>${p.description}<br><br><em>Stack: ${p.tags.join(', ')}</em>`);
      return;
    }
    if (/aeon|essay|summar/i.test(lo)) {
      const p = (P.projects||[]).find(x => /aeon/i.test(x.title));
      if (p) botReply(`<strong>${p.title}</strong><br><br>${p.description}<br><br><em>Stack: ${p.tags.join(', ')}</em>`);
      return;
    }

    // Experience
    if (/\bexperience\b|\bwork(ed)?\b|\bintern\b|\bjob\b|\bcompany\b|\bmarudhar\b/i.test(lo)) {
      const e = (P.experience || [])[0];
      if (e) botReply(`Aman worked as <strong>${e.role}</strong> at <strong>${e.company}</strong> (${e.period}).<br><br>He built digital apps to replace paper-based shop floor processes, integrated Google Sheets for real-time data sync, and automated reporting workflows.`);
      return;
    }

    // Education
    if (/\beducation\b|\bdegree\b|\buniversity\b|\bcollege\b|\bsvnit\b|\bbtech\b|\bmechanical\b/i.test(lo)) {
      const e = (P.education || [])[0];
      if (e) botReply(`Aman holds a <strong>${e.degree}</strong> from <strong>${e.institution}</strong> (${e.period}).<br><br>While studying Mechanical Engineering, he independently taught himself software development, automation, and AI — entirely through building real projects.`);
      return;
    }

    // Contact
    if (/\bcontact\b|\bemail\b|\breach\b|\bhire\b|\btalk\b|\bmessage\b|\bconnect\b/i.test(lo)) {
      botReply(`You can reach Aman directly:<br><br>📧 <a href="mailto:${P.email||''}" style="color:var(--accent)">${P.email||''}</a><br>💼 <a href="${P.linkedin||'#'}" target="_blank" style="color:var(--accent)">LinkedIn Profile</a><br><br>Or use the <a href="contact.html" style="color:var(--accent)">contact form</a>.`);
      return;
    }

    // Availability
    if (/\bavailable\b|\bopen to\b|\blooking\b|\bfreelance\b|\bopportunit/i.test(lo)) {
      botReply(`Aman is actively open to exciting opportunities — AI automation, agentic system design, and full-stack development.<br><br>Best way to reach him: <a href="mailto:${P.email||''}" style="color:var(--accent)">${P.email||''}</a>`);
      return;
    }

    // Resume
    if (/\bresume\b|\bcv\b|\bdownload\b/i.test(lo)) {
      botReply(`You can download Aman's resume here:<br><br><a href="${P.resumeFile||'#'}" download style="color:var(--accent);font-weight:600">📄 Download Resume (PDF)</a>`);
      return;
    }

    // Location
    if (/\blocation\b|\bwhere\b|\bcity\b|\bindia\b|\bgujarat\b|\bahmedabad\b/i.test(lo)) {
      botReply(`Aman is based in <strong>${P.location||'Ahmedabad, India'}</strong>. He's open to remote roles and relocation for the right opportunity.`);
      return;
    }

    // Currently / Now
    if (/\bnow\b|\bcurrent\b|\bdoing\b|\bbuilding\b|\blearning\b|\blately\b/i.test(lo)) {
      botReply(`Right now Aman is building AI-driven automation projects, deepening his expertise in multi-agent systems and RAG pipelines, and actively looking for the right opportunity in AI & automation.`);
      return;
    }

    // Blog / Writings
    if (/\bblog\b|\bwrit\b|\bpost\b|\barticle\b/i.test(lo)) {
      if (P.blog && P.blog.length) {
        const list = P.blog.map(b =>
          `<li><a href="${b.file}" style="color:var(--accent)">${b.title}</a> <em>(${b.date})</em></li>`
        ).join('');
        botReply(`Aman's latest writings:<ul style="margin:.5rem 0 0 1.1rem;padding:0">${list}</ul>`);
      } else {
        botReply(`Check out Aman's <a href="blog.html" style="color:var(--accent)">Writings page</a> — new posts coming soon!`);
      }
      return;
    }

    // Self-taught
    if (/self.?taught|\blearn\b|\bstudy\b|\baudodidact\b/i.test(lo)) {
      botReply(`Aman is entirely self-taught in software and AI. With a Mechanical Engineering degree, he independently learned Python, API integration, n8n automation, and AI system architecture — all through building real, shipped products.`);
      return;
    }

    // Fallback
    botReply(`Hmm, I'm not sure about that specific question — but you can email Aman directly at <a href="mailto:${P.email||''}" style="color:var(--accent)">${P.email||''}</a>.<br><br>Try asking about: <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, or <strong>contact</strong>.`);
  }

  function sendMsg() {
    const v = inputEl.value.trim();
    if (!v) return;
    addMsg(v, 'user');
    inputEl.value = '';
    quickArea.innerHTML = '';
    handleQuery(v);
  }

  sendBtn.addEventListener('click', sendMsg);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
}

// ── STATUS PANEL (injected above footer on all pages) ────────
function initStatusPanel() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const bar = document.createElement('div');
  bar.className = 'status-panel';
  bar.innerHTML = `<div class="container"><div class="status-inner">
    <span class="status-dot-live"></span>
    <span class="status-item">System online</span>
    <span class="status-sep">·</span>
    <span class="status-item" id="status-time">--:--:--</span>
    <span class="status-sep">·</span>
    <span class="status-item">IST — Ahmedabad, IN</span>
    <span class="status-sep">·</span>
    <span class="status-item">Last deploy <strong>14 May 2026</strong></span>
    <span class="status-sep">·</span>
    <span class="status-item">Stack: <strong>n8n · Python · FastAPI</strong></span>
  </div></div>`;

  footer.parentNode.insertBefore(bar, footer);

  const timeEl = document.getElementById('status-time');
  function tick() {
    if (!timeEl) return;
    timeEl.textContent = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata', hour12: false
    });
  }
  tick();
  setInterval(tick, 1000);
}

// ── MAGNETIC BUTTONS ─────────────────────────────────────────
function initMagneticButtons() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.32;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.32;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}
