/* ============================================================
   IRONPEAK GYM — script.js
   Custom cursor | Navbar scroll | Reveal animations | Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    }
  });

  // Smooth trail animation using requestAnimationFrame
  function animateTrail() {
    if (trail) {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX + 'px';
      trail.style.top  = trailY + 'px';
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Cursor scale on hoverable elements
  const hoverables = document.querySelectorAll('a, button, .service-card, .gallery-item, .testi-card, select, input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursor) {
        cursor.style.width  = '28px';
        cursor.style.height = '28px';
      }
      if (trail) trail.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) {
        cursor.style.width  = '12px';
        cursor.style.height = '12px';
      }
      if (trail) trail.style.opacity = '1';
    });
  });

  // Hide cursor when it leaves window
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (trail)  trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
    if (trail)  trail.style.opacity  = '1';
  });


  /* ─────────────────────────────────────────
     2. NAVBAR — scroll state + mobile toggle
  ───────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Add scrolled class when page is scrolled down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    }
  });


  /* ─────────────────────────────────────────
     3. SCROLL REVEAL ANIMATIONS
  ───────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after first reveal so animation doesn't repeat
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ─────────────────────────────────────────
     4. COUNTER ANIMATION (hero stats)
  ───────────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  // Observe stats section and animate counters
  const statNums = document.querySelectorAll('.stat-num');
  const heroSection = document.querySelector('.hero-stats');

  if (heroSection && statNums.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Targets for each stat: 1200, 8, 15
            const targets = [1200, 8, 15];
            statNums.forEach((el, i) => {
              const original = el.innerHTML;
              const sup = el.querySelector('sup');
              const supText = sup ? sup.outerHTML : '';
              // Animate only the number part
              if (targets[i]) {
                const tempEl = document.createElement('span');
                el.innerHTML = '';
                el.appendChild(tempEl);
                animateCounter(tempEl, targets[i]);
                if (supText) {
                  setTimeout(() => {
                    el.innerHTML = el.textContent + supText;
                  }, 50);
                }
              }
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(heroSection);
  }


  /* ─────────────────────────────────────────
     5. ACTIVE NAV LINK on scroll
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* ─────────────────────────────────────────
     6. CONTACT FORM SUBMISSION
  ───────────────────────────────────────── */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      // Loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate async form submission (replace with real API/WhatsApp/FormSpree)
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';

        if (formSuccess) {
          formSuccess.classList.add('show');
          contactForm.reset();

          // Hide success message after 5 seconds
          setTimeout(() => {
            formSuccess.classList.remove('show');
          }, 5000);
        }
      }, 1400);
    });
  }


  /* ─────────────────────────────────────────
     7. SMOOTH ANCHOR SCROLL
     (Override default for offset due to fixed navbar)
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId  = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl  = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 80;
      const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    });
  });


  /* ─────────────────────────────────────────
     8. GALLERY HOVER CURSOR EFFECT
  ───────────────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (cursor) {
        cursor.style.background = 'transparent';
        cursor.style.border = '2px solid #e8192c';
        cursor.style.width = '50px';
        cursor.style.height = '50px';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (cursor) {
        cursor.style.background = '#e8192c';
        cursor.style.border = 'none';
        cursor.style.width = '12px';
        cursor.style.height = '12px';
      }
    });
  });


  /* ─────────────────────────────────────────
     9. SERVICE CARDS — stagger on scroll
  ───────────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 100);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  serviceCards.forEach((card) => cardObserver.observe(card));


  /* ─────────────────────────────────────────
     10. PARALLAX — hero glow follows mouse
  ───────────────────────────────────────── */
  const heroGlow = document.querySelector('.hero-glow');
  document.addEventListener('mousemove', (e) => {
    if (!heroGlow) return;
    const xPercent = (e.clientX / window.innerWidth  - 0.5) * 30;
    const yPercent = (e.clientY / window.innerHeight - 0.5) * 30;
    heroGlow.style.transform = `translate(${xPercent}px, ${yPercent}px)`;
  });


  /* ─────────────────────────────────────────
     11. PREVENT BODY SCROLL when menu is open
  ───────────────────────────────────────── */
  const mobileObserver = new MutationObserver(() => {
    if (navLinks && navLinks.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  if (navLinks) {
    mobileObserver.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
  }


  /* ─────────────────────────────────────────
     12. FOOTER — current year (optional)
  ───────────────────────────────────────── */
  // Auto-update copyright year
  const yearEls = document.querySelectorAll('.footer-bottom');
  const currentYear = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.innerHTML = el.innerHTML.replace('© 2024', `© ${currentYear}`);
  });

}); // end DOMContentLoaded