/**
 * LKR & Associates — JavaScript Enhancements
 * Companion to lkr-associates.html
 * Usage: <script src="lkr-enhancements.js" defer></script>
 *
 * Features:
 *  1.  Page Loader
 *  2.  Custom Cursor
 *  3.  Scroll Progress Bar
 *  4.  Nav Scrolled State + Active Section Highlight
 *  5.  Mobile Nav Drawer
 *  6.  Gold Particle Canvas
 *  7.  Animated Stat Counters
 *  8.  Reveal-on-Scroll (IntersectionObserver)
 *  9.  Card 3D Tilt Effect
 * 10.  Typed-text Effect in Hero Tagline
 * 11.  Parallax Hero Scroll
 * 12.  Floating Contact Widget
 * 13.  Toast Notification System
 * 14.  Enhanced Form Validation (multi-step)
 * 15.  Back-to-Top Button
 * 16.  Keyboard Accessibility (ESC to close drawers)
 * 17.  Copy-to-clipboard on contact details
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     UTILITIES
  ────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const raf = requestAnimationFrame;

  /* ──────────────────────────────────────────────
     1. PAGE LOADER
  ────────────────────────────────────────────── */
  function initLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <div class="loader-logo">LKR &amp; Associates</div>
      <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
      <div class="loader-text">Bengaluru · Karnataka</div>
    `;
    document.body.prepend(loader);

    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 1400);
    });
  }

  /* ──────────────────────────────────────────────
     2. CUSTOM CURSOR
  ────────────────────────────────────────────── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

    const dot  = document.createElement('div'); dot.id  = 'cursor-dot';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    // Smooth ring follow
    function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      raf(animateRing);
    }
    raf(animateRing);

    // Hover state on interactive elements
    const hoverEls = 'a, button, .practice-card, .about-card, .appt-icon, label, select, input, textarea';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverEls)) ring.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverEls)) ring.classList.remove('cursor-hover');
    });

    document.addEventListener('mousedown', () => ring.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('cursor-click'));
  }

  /* ──────────────────────────────────────────────
     3. SCROLL PROGRESS BAR
  ────────────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (scrolled / total * 100).toFixed(2) + '%';
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     4. NAV SCROLLED STATE + ACTIVE SECTION
  ────────────────────────────────────────────── */
  function initNavBehavior() {
    const nav   = $('nav');
    const links = $$('.nav-links a');
    const sections = $$('section[id], div[id]').filter(el => el.id);

    window.addEventListener('scroll', () => {
      // Scrolled class
      nav.classList.toggle('scrolled', window.scrollY > 60);

      // Active section highlight
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });

      links.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active-section', href === current);
      });
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     5. MOBILE NAV DRAWER
  ────────────────────────────────────────────── */
  function initMobileNav() {
    const nav = $('nav');

    // Create toggle button
    const toggle = document.createElement('button');
    toggle.id = 'mobile-nav-toggle';
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'mobile-nav-overlay';
    document.body.appendChild(overlay);

    // Create drawer
    const drawer = document.createElement('div');
    drawer.id = 'mobile-nav-drawer';
    drawer.innerHTML = `
      <a href="#about"        class="mobile-nav-link">About</a>
      <a href="#practice"     class="mobile-nav-link">Practice Areas</a>
      <a href="#appointment"  class="mobile-nav-link">Appointment</a>
      <a href="#location"     class="mobile-nav-link">Location</a>
      <a href="#appointment"  class="mobile-nav-cta">Book Consultation</a>
      <div class="mobile-nav-contact">
        +91 96639 66342<br>
        advlalithkumar@gmail.com<br>
        Bengaluru, Karnataka
      </div>
    `;
    document.body.appendChild(drawer);

    const openDrawer  = () => { drawer.classList.add('open'); overlay.classList.add('open'); toggle.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeDrawer = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); toggle.classList.remove('open'); document.body.style.overflow = ''; };

    toggle.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
    overlay.addEventListener('click', closeDrawer);

    // Close on nav link click
    $$('.mobile-nav-link, .mobile-nav-cta', drawer).forEach(a => a.addEventListener('click', closeDrawer));
  }

  /* ──────────────────────────────────────────────
     6. GOLD PARTICLE CANVAS
  ────────────────────────────────────────────── */
  function initParticles() {
    const hero = $('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.size = Math.random() * 1.8 + 0.3;
        this.vx   = (Math.random() - 0.5) * 0.25;
        this.vy   = -Math.random() * 0.5 - 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 220 + 80;
        this.alpha = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        const half = this.maxLife / 2;
        this.alpha = this.life < half
          ? (this.life / half) * 0.6
          : ((this.maxLife - this.life) / half) * 0.6;
        if (this.life >= this.maxLife) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgba(201,168,76,1)`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(201,168,76,0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.life = Math.floor(Math.random() * p.maxLife); // stagger start
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      raf(animate);
    }
    animate();
  }

  /* ──────────────────────────────────────────────
     7. ANIMATED STAT COUNTERS
  ────────────────────────────────────────────── */
  function initCounters() {
    const stats = $$('.stat-number');

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el, target, suffix, duration = 1800) => {
      el.classList.add('counting');
      const start = performance.now();
      const update = now => {
        const t = Math.min((now - start) / duration, 1);
        const val = Math.floor(easeOut(t) * target);
        el.textContent = val + suffix;
        if (t < 1) raf(update);
        else { el.textContent = target + suffix; el.classList.remove('counting'); }
      };
      raf(update);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el   = entry.target;
        const text = el.textContent.trim();
        const num  = parseInt(text.replace(/\D/g, ''), 10);
        const suf  = text.replace(/[0-9]/g, '');
        animateCounter(el, num, suf);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
     8. REVEAL ON SCROLL
  ────────────────────────────────────────────── */
  function initReveal() {
    // Add reveal class to target elements
    const targets = [
      { sel: '.about-text',    dir: 'reveal-left' },
      { sel: '.about-visual',  dir: 'reveal-right' },
      { sel: '.section-header', dir: '' },
      { sel: '.appt-info',     dir: 'reveal-left' },
      { sel: '.appt-form',     dir: 'reveal-right' },
      { sel: '.location-info', dir: 'reveal-left' },
    ];

    targets.forEach(({ sel, dir }) => {
      $$(sel).forEach(el => {
        el.classList.add('reveal');
        if (dir) el.classList.add(dir);
      });
    });

    // Add stagger to grids
    $$('.practice-grid, .about-visual').forEach(el => el.classList.add('reveal-stagger'));
    $$('.practice-card, .about-card').forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
     9. 3D CARD TILT
  ────────────────────────────────────────────── */
  function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    $$('.practice-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ──────────────────────────────────────────────
     10. TYPED TEXT EFFECT IN HERO TAGLINE
  ────────────────────────────────────────────── */
  function initTyped() {
    const tagline = $('.hero-tagline');
    if (!tagline) return;

    const phrases = [
      'Justice pursued with precision, integrity, and resolve.',
      'Defending your rights. Protecting your interests.',
      'Trusted legal counsel across Karnataka.',
    ];

    let phraseIndex = 0, charIndex = 0, deleting = false;
    tagline.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    tagline.appendChild(cursor);

    const type = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        tagline.childNodes[0]
          ? (tagline.childNodes[0].textContent = current.slice(0, ++charIndex))
          : tagline.insertBefore(document.createTextNode(current.slice(0, ++charIndex)), cursor);

        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 2800);
          return;
        }
      } else {
        tagline.childNodes[0].textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(type, deleting ? 30 : 52);
    };

    setTimeout(type, 1600);
  }

  /* ──────────────────────────────────────────────
     11. PARALLAX HERO SCROLL
  ────────────────────────────────────────────── */
  function initParallax() {
    const heroBg      = $('.hero-bg');
    const heroContent = $('.hero-content');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      if (heroBg)      heroBg.style.transform      = `translateY(${y * 0.35}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     12. FLOATING CONTACT WIDGET
  ────────────────────────────────────────────── */
  function initFloatWidget() {
    const widget = document.createElement('div');
    widget.id = 'float-contact';
    widget.innerHTML = `
      <div class="float-options" id="float-options">
        <a href="tel:+919663966342" class="float-option">
          <span class="float-option-label">Call Now</span>
          <span class="float-option-icon">📞</span>
        </a>
        <a href="mailto:advlalithkumar@gmail.com" class="float-option">
          <span class="float-option-label">Send Email</span>
          <span class="float-option-icon">✉️</span>
        </a>
        <a href="#appointment" class="float-option">
          <span class="float-option-label">Book Appointment</span>
          <span class="float-option-icon">📅</span>
        </a>
      </div>
      <button id="float-trigger" aria-label="Contact options">⚖</button>
    `;
    document.body.appendChild(widget);

    const trigger = $('#float-trigger');
    const options = $('#float-options');
    let open = false;

    trigger.addEventListener('click', () => {
      open = !open;
      options.classList.toggle('open', open);
      trigger.classList.toggle('active', open);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (open && !widget.contains(e.target)) {
        open = false;
        options.classList.remove('open');
        trigger.classList.remove('active');
      }
    });
  }

  /* ──────────────────────────────────────────────
     13. TOAST NOTIFICATION SYSTEM
  ────────────────────────────────────────────── */
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);

  window.showToast = function (title, message, duration = 4000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-title">${title}</div>${message}`;
    toastContainer.appendChild(toast);

    // Trigger animation
    raf(() => raf(() => toast.classList.add('show')));

    setTimeout(() => {
      toast.classList.replace('show', 'hide');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  };

  /* ──────────────────────────────────────────────
     14. ENHANCED FORM VALIDATION (multi-step feel)
  ────────────────────────────────────────────── */
  function initFormEnhancements() {
    // Inject step indicator above form
    const form = $('#apptForm');
    if (!form) return;

    const stepBar = document.createElement('div');
    stepBar.className = 'appt-steps';
    stepBar.innerHTML = `
      <div class="appt-step active" data-step="1">
        <div class="step-dot">1</div>
        <div class="step-label">Details</div>
      </div>
      <div class="appt-step" data-step="2">
        <div class="step-dot">2</div>
        <div class="step-label">Matter</div>
      </div>
      <div class="appt-step" data-step="3">
        <div class="step-dot">3</div>
        <div class="step-label">Confirm</div>
      </div>
    `;
    form.prepend(stepBar);

    // Real-time validation feedback
    const rules = {
      fname:  { test: v => v.trim().length > 1,             msg: 'Please enter your full name.' },
      fphone: { test: v => /^[+0-9\s]{8,}$/.test(v.trim()), msg: 'Enter a valid phone number.' },
      femail: { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Enter a valid email address.' },
      farea:  { test: v => v !== '',                         msg: 'Please select a practice area.' },
    };

    Object.entries(rules).forEach(([id, rule]) => {
      const input = document.getElementById(id);
      if (!input) return;

      // Error message element
      let errEl = input.nextElementSibling;
      if (!errEl || !errEl.classList.contains('input-error-msg')) {
        errEl = document.createElement('div');
        errEl.className = 'input-error-msg';
        input.after(errEl);
      }
      errEl.textContent = rule.msg;

      input.addEventListener('blur', () => {
        const valid = rule.test(input.value);
        input.classList.toggle('input-error', !valid);
        input.classList.toggle('input-valid', valid);
        errEl.classList.toggle('show', !valid);

        // Update step indicator dynamically
        updateSteps();
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('input-error') && rule.test(input.value)) {
          input.classList.remove('input-error');
          input.classList.add('input-valid');
          errEl.classList.remove('show');
          updateSteps();
        }
      });
    });

    function updateSteps() {
      const step1Done = ['fname','fphone'].every(id => {
        const el = document.getElementById(id);
        return el && rules[id] && rules[id].test(el.value);
      });
      const step2Done = ['femail','farea'].every(id => {
        const el = document.getElementById(id);
        return el && rules[id] && rules[id].test(el.value);
      });

      const steps = $$('.appt-step');
      if (steps.length < 3) return;

      steps[0].classList.toggle('done', step1Done);
      steps[0].classList.toggle('active', !step1Done);
      steps[0].querySelector('.step-dot').textContent = step1Done ? '✓' : '1';

      steps[1].classList.toggle('done', step2Done);
      steps[1].classList.toggle('active', step1Done && !step2Done);
      steps[1].querySelector('.step-dot').textContent = step2Done ? '✓' : '2';

      steps[2].classList.toggle('active', step1Done && step2Done);
    }

    // Override submit to validate first + show toast
    const submitBtn = form.querySelector('.form-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', e => {
        e.preventDefault();

        // Run all validations
        let allValid = true;
        Object.entries(rules).forEach(([id, rule]) => {
          const input = document.getElementById(id);
          if (!input) return;
          const valid = rule.test(input.value);
          input.classList.toggle('input-error', !valid);
          input.classList.toggle('input-valid', valid);
          const errEl = input.nextElementSibling;
          if (errEl && errEl.classList.contains('input-error-msg')) {
            errEl.classList.toggle('show', !valid);
          }
          if (!valid) allValid = false;
        });

        if (!allValid) {
          showToast('Incomplete Form', 'Please fill in all required fields correctly.');
          return;
        }

        // Submit via Formspree
const name = document.getElementById('fname').value.trim();
const formData = {
  name,
  phone:       document.getElementById('fphone').value.trim(),
  email:       document.getElementById('femail').value.trim(),
  area:        document.getElementById('farea').value,
  date:        document.getElementById('fdate').value,
  description: document.getElementById('fdesc').value.trim(),
};

fetch('https://formspree.io/f/mjgalveq', {   // ← paste YOUR endpoint here
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify(formData),
})
.then(res => res.json())
.then(data => {
  if (data.ok) {
    form.style.display = 'none';
    $('#formSuccess').classList.add('show');
    showToast('Appointment Requested ✦', `Thank you, ${name}. We will contact you shortly.`, 5000);
  } else {
    showToast('Submission Failed', 'Please try again or call us directly.', 4000);
  }
})
.catch(() => {
  showToast('Network Error', 'Please check your connection and try again.', 4000);
});
      });
    }
  }

  /* ──────────────────────────────────────────────
     15. BACK-TO-TOP BUTTON
  ────────────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ──────────────────────────────────────────────
     16. KEYBOARD ACCESSIBILITY
  ────────────────────────────────────────────── */
  function initKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        // Close mobile nav
        const drawer  = $('#mobile-nav-drawer');
        const overlay = $('#mobile-nav-overlay');
        const toggle  = $('#mobile-nav-toggle');
        if (drawer && drawer.classList.contains('open')) {
          drawer.classList.remove('open');
          overlay && overlay.classList.remove('open');
          toggle  && toggle.classList.remove('open');
          document.body.style.overflow = '';
        }

        // Close float widget
        const floatOptions = $('#float-options');
        const floatTrigger = $('#float-trigger');
        if (floatOptions && floatOptions.classList.contains('open')) {
          floatOptions.classList.remove('open');
          floatTrigger && floatTrigger.classList.remove('active');
        }
      }
    });
  }

  /* ──────────────────────────────────────────────
     17. COPY TO CLIPBOARD ON CONTACT DETAILS
  ────────────────────────────────────────────── */
  function initCopyContacts() {
    // Find phone and email values in appointment section
    $$('.appt-contact-value').forEach(el => {
      const textToCopy = el.textContent.trim();
      if (!textToCopy) return;

      el.style.cursor = 'none';
      el.title = 'Click to copy';

      el.addEventListener('click', () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Copied ✦', `<span style="opacity:.7">${textToCopy}</span>`, 2500);
        }).catch(() => {});
      });
    });
  }

  /* ──────────────────────────────────────────────
     INIT ALL
  ────────────────────────────────────────────── */
  function init() {
    initLoader();
    initCursor();
    initScrollProgress();
    initNavBehavior();
    initMobileNav();
    initParticles();
    initCounters();
    initReveal();
    initCardTilt();
    initTyped();
    initParallax();
    initFloatWidget();
    initFormEnhancements();
    initBackToTop();
    initKeyboard();
    initCopyContacts();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
