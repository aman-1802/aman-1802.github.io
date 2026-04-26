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
    case 'home':           initHero(); break;
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
}

function renderProjects() {
  const c = document.getElementById('projects-grid');
  if (!c) return;
  c.innerHTML = PORTFOLIO.projects.map((p, i) => `
    <div class="project-card tilt-card reveal reveal-delay-${(i%3)+1}">
      <div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.description}</div>
      <div class="project-links">
        ${p.github?`<a href="${p.github}" target="_blank" rel="noopener" class="project-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>GitHub</a>`:''}
        ${p.demo?`<a href="${p.demo}" target="_blank" rel="noopener" class="project-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo</a>`:''}
        ${!p.github&&!p.demo?`<span style="font-size:.8rem;color:var(--text-soft)">Links coming soon</span>`:''}
      </div>
    </div>`).join('');
  reObserve(c);
  c.querySelectorAll('.tilt-card').forEach(applyTilt);
}

function renderSkills() {
  const ICONS = {
    'n8n / Workflow Automation': '⚡',
    'Python': '🐍',
    'API Integrations': '🔗',
    'Multi-Agent AI Systems': '🤖',
    'OOP & Software Design': '🏗️',
    'Full-Stack Development': '💻',
    'Google Sheets / Apps Script': '📊',
    'MS Office Suite': '📝'
  };
  const SOFT_ICONS = {
    'Problem Solving': '🧩',
    'Self-Learning': '📚',
    'Project Ownership': '🎯',
    'Clear Communication': '💬',
    'Systems Thinking': '🔮'
  };

  const cards = document.getElementById('skill-cards');
  if (cards) {
    cards.innerHTML = PORTFOLIO.skills.technical.map(s => {
      const icon = ICONS[s.name] || '⚙️';
      return `<div class="skill-card reveal">
        <div class="skill-card-icon">${icon}</div>
        <div class="skill-card-name">${s.name}</div>
      </div>`;
    }).join('');
    reObserve(cards);
    cards.querySelectorAll('.skill-card').forEach(applyTilt);
  }

  const soft = document.getElementById('soft-cards');
  if (soft) {
    soft.innerHTML = PORTFOLIO.skills.soft.map(s => `
      <div class="soft-card">
        <div class="soft-card-icon">${SOFT_ICONS[s] || '✨'}</div>
        <div class="soft-card-name">${s}</div>
      </div>`).join('');
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
      <div class="edu-icon">🎓</div>
      <div>
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-institution">${e.institution}</div>
        <div class="edu-meta"><span>${e.period}</span></div>
        <p class="edu-details">${e.details}</p>
      </div>
    </div>`).join('');
  reObserve(c);
  c.querySelectorAll('.tilt-card').forEach(applyTilt);
}

function renderCertifications() {
  const c = document.getElementById('certs-container');
  if (!c) return;
  if (!PORTFOLIO.certifications || PORTFOLIO.certifications.length === 0) {
    c.innerHTML = `<div class="certs-empty reveal">
      <div style="font-size:2.5rem;margin-bottom:.75rem">📜</div>
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
}

function renderBlog() {
  const c = document.getElementById('blog-grid');
  if (!c) return;
  if (!PORTFOLIO.blog || PORTFOLIO.blog.length === 0) {
    c.innerHTML = `<div class="blog-empty">
      <div style="font-size:2.5rem;margin-bottom:.75rem">✍️</div>
      <h3>No posts yet — check back soon!</h3>
      <p>Thoughts on AI automation, building in public, and lessons from shipping real projects.</p>
    </div>`; return;
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
