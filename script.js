/* ============================================
   DENTAL CLINIC - INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll reveal animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Phone mask ---
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }

      e.target.value = value;
    });
  }

  // --- Form submission → WhatsApp redirect ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const treatment = document.getElementById('treatment').value;
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name) {
        showFormFeedback('Por favor, informe seu nome.', 'error');
        return;
      }

      if (!phone || phone.replace(/\D/g, '').length < 10) {
        showFormFeedback('Por favor, informe um número de WhatsApp válido.', 'error');
        return;
      }

      // Build WhatsApp message
      let whatsappText = `Olá! Meu nome é ${name}.`;

      if (treatment) {
        const treatmentNames = {
          'clareamento': 'Clareamento dental',
          'limpeza': 'Limpeza e prevenção',
          'ortodontia': 'Ortodontia / Aparelho',
          'implante': 'Implantes dentários',
          'lentes': 'Lentes de contato dental',
          'restauracao': 'Restaurações',
          'canal': 'Tratamento de canal',
          'odontopediatria': 'Odontopediatria',
          'avaliacao': 'Avaliação geral'
        };
        whatsappText += ` Tenho interesse em: ${treatmentNames[treatment] || treatment}.`;
      }

      if (message) {
        whatsappText += ` ${message}`;
      }

      whatsappText += ` Meu contato: ${phone}.`;

      const whatsappUrl = `https://wa.me/5500000000000?text=${encodeURIComponent(whatsappText)}`;

      showFormFeedback('Redirecionando para o WhatsApp...', 'success');

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 600);
    });
  }

  // --- Form feedback ---
  function showFormFeedback(message, type) {
    // Remove existing feedback
    const existing = document.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.textContent = message;

    Object.assign(feedback.style, {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'fadeInUp 0.3s ease-out',
      background: type === 'success' ? '#E6F7F5' : '#FEE2E2',
      color: type === 'success' ? '#2A9D8F' : '#DC2626',
      border: `1px solid ${type === 'success' ? '#6FD5CD' : '#FECACA'}`
    });

    const submitBtn = document.getElementById('form-submit-btn');
    submitBtn.parentNode.insertBefore(feedback, submitBtn);

    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.remove();
      }
    }, 4000);
  }

  // --- Counter animation for stats ---
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const hasPlus = text.includes('+');
        const hasK = text.includes('k');

        let target;
        if (hasK) {
          target = parseFloat(text.replace(/[^0-9.]/g, ''));
        } else {
          target = parseInt(text.replace(/[^0-9]/g, ''));
        }

        if (isNaN(target)) return;

        let current = 0;
        const duration = 1500;
        const increment = target / (duration / 16);
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          current = target * eased;

          if (hasK) {
            el.textContent = (hasPlus ? '' : '') + current.toFixed(1) + 'k';
          } else {
            el.textContent = (hasPlus ? '' : '') + Math.floor(current) + (hasPlus ? '+' : '');
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = text; // Reset to original
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // --- Parallax-like subtle effect for hero ---
  const heroSection = document.querySelector('.hero');
  if (heroSection && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const heroImage = heroSection.querySelector('.hero-image');
        if (heroImage) {
          heroImage.style.transform = `translateY(${scrollY * 0.05}px)`;
        }
      }
    }, { passive: true });
  }

  // --- Year update in footer ---
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace('2024', currentYear);
  }

});
