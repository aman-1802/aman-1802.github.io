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
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
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
    case 'experience':     renderExperience(); break;
    case 'projects':       renderProjects(); break;
    case 'skills':         renderSkills(); break;
    case 'education':      renderEducation(); break;
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
});

// ════════════════════════════════════════════════════════════
//  CREATIVE LOADER — typing name + dual spinner + curtain wipe
// ════════════════════════════════════════════════════════════
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const typeEl  = loader.querySelector('.loader-type-text');
  const fill    = loader.querySelector('.loader-progress-fill');
  const fullName = 'Aman Agarwal';
  let i = 0;

  setTimeout(() => {
    const iv = setInterval(() => {
      i++;
      if (typeEl) typeEl.textContent = fullName.slice(0, i);
      if (fill)   fill.style.width   = (i / fullName.length * 100) + '%';

      if (i >= fullName.length) {
        clearInterval(iv);
        setTimeout(() => {
          loader.classList.add('exiting');
          setTimeout(() => {
            loader.classList.add('exiting-out');
            setTimeout(() => loader.classList.add('hidden'), 420);
          }, 260);
        }, 380);
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

function renderProjects() {
  const c = document.getElementById('projects-grid');
  const filterBar = document.getElementById('projects-filter');
  if (!c) return;

  // Build unique month list (preserve order from data)
  const months = ['All', ...new Set(PORTFOLIO.projects.map(p => p.date).filter(Boolean))];

  // Render filter chips
  if (filterBar) {
    filterBar.innerHTML = months.map(m => `
      <button class="proj-filter-btn${m==='All'?' active':''}" data-month="${m}"
        style="background:${m==='All'?'var(--accent)':'var(--bg-elevated)'};color:${m==='All'?'#fff':'var(--text-mid)'};border:1.5px solid ${m==='All'?'var(--accent)':'var(--border)'};padding:.4rem 1.1rem;border-radius:99px;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:var(--font-head)">
        ${m}
      </button>`).join('');

    filterBar.querySelectorAll('.proj-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.proj-filter-btn').forEach(b => {
          b.style.background = 'var(--bg-elevated)';
          b.style.color = 'var(--text-mid)';
          b.style.borderColor = 'var(--border)';
          b.classList.remove('active');
        });
        btn.style.background = 'var(--accent)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'var(--accent)';
        btn.classList.add('active');
        drawProjectCards(c, btn.dataset.month);
      });
    });
  }

  drawProjectCards(c, 'All');
}

function drawProjectCards(c, activeMonth) {
  const filtered = activeMonth === 'All'
    ? PORTFOLIO.projects
    : PORTFOLIO.projects.filter(p => p.date === activeMonth);

  c.innerHTML = filtered.map((p, i) => {
    if (p.file) {
      return `
        <a href="${p.file}" class="blog-card tilt-card reveal reveal-delay-${(i%3)+1}" style="text-decoration:none;color:inherit;display:block">
          ${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title}" style="width:100%;height:190px;object-fit:cover;display:block;" />` : ''}
          <div class="blog-card-body">
            <div class="project-tags" style="margin-bottom:.75rem">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
            <div class="blog-card-title">${p.title}</div>
            <div class="blog-card-summary">${p.description}</div>
          </div>
          <div class="blog-card-footer"><span class="blog-date">${p.date||''}</span><span class="blog-read">View Project →</span></div>
        </a>`;
    }
    return `
      <div class="project-card tilt-card reveal reveal-delay-${(i%3)+1}">
        <div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description}</div>
        <div class="project-links">
          ${p.github?`<a href="${p.github}" target="_blank" rel="noopener" class="project-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>GitHub</a>`:''}
          ${p.demo?`<a href="${p.demo}" target="_blank" rel="noopener" class="project-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo</a>`:''}
          ${!p.github&&!p.demo?`<span style="font-size:.8rem;color:var(--text-soft)">Links coming soon</span>`:''}
        </div>
      </div>`;
  }).join('');

  if (filtered.length === 0) {
    c.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-soft)">No projects for this month yet.</div>`;
  }

  reObserve(c);
  c.querySelectorAll('.tilt-card').forEach(applyTilt);
  if (window.lucide) window.lucide.createIcons();
}

function renderSkills() {
  const ICONS = {
    'n8n / Workflow Automation': 'zap',
    'Python': 'terminal',
    'API Integrations': 'link-2',
    'Multi-Agent AI Systems': 'bot',
    'OOP & Software Design': 'box',
    'Full-Stack Development': 'code',
    'Google Sheets / Apps Script': 'sheet',
    'MS Office Suite': 'file-text'
  };
  const SOFT_ICONS = {
    'Problem Solving': 'puzzle',
    'Self-Learning': 'book-open',
    'Project Ownership': 'target',
    'Clear Communication': 'message-circle',
    'Systems Thinking': 'network'
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
      <div class="edu-icon"><i data-lucide="graduation-cap" style="width:28px;height:28px;stroke-width:1.5;color:var(--accent)"></i></div>
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
        <div class="cert-title">${cert.title}</div>
        <div class="cert-issuer">${cert.issuer}</div>
        <div class="cert-date">${cert.date}</div>
        ${cert.link?`<a href="${cert.link}" target="_blank" class="project-link" style="margin-top:.75rem">View Certificate →</a>`:''}
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
    <a href="${post.file}" class="blog-card tilt-card reveal reveal-delay-${(i%3)+1}" style="text-decoration:none;color:inherit;display:block">
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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  container.querySelectorAll('.reveal').forEach(el => obs.observe(el));
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
    { label:'About',          icon:'user',           href:'about.html',          sub:'Who I am' },
    { label:'Experience',     icon:'briefcase',      href:'experience.html',     sub:'Where I\'ve worked' },
    { label:'Projects',       icon:'rocket',         href:'projects.html',       sub:'Things I\'ve built' },
    { label:'Skills',         icon:'settings-2',     href:'skills.html',         sub:'My toolkit' },
    { label:'Education',      icon:'graduation-cap', href:'education.html',      sub:'Academic background' },
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
