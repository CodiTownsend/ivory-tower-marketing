/* ============================================
   FAMILY FIRST PET DRIVERS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // STICKY HEADER
  // ============================================
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  function openMenu() {
    menuToggle?.classList.add('active');
    mobileNav?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    menuToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuToggle?.classList.remove('active');
    mobileNav?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileOverlay?.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-link, .mobile-nav-sub a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) closeMenu();
  });

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ============================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // FORM HANDLING
  // ============================================
  function handleFormSubmit(form, successMessage) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn?.textContent;

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Simulate form submission (replace with actual backend)
      setTimeout(() => {
        // Success state
        form.innerHTML = `
          <div class="form-success" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 3rem; margin-bottom: 16px;">🐾</div>
            <h3 style="color: var(--primary); margin-bottom: 12px;">Request Received!</h3>
            <p style="color: var(--text-light); margin-bottom: 24px;">${successMessage}</p>
            <p style="font-size: 0.88rem; color: var(--mid-gray);">
              📞 Expect a call or text within 1 hour during business hours.<br>
              Mon–Sat · 7:00 AM–5:00 PM CST
            </p>
          </div>
        `;
      }, 1500);
    });
  }

  // Hero quote form
  const heroForm = document.getElementById('hero-quote-form');
  if (heroForm) {
    handleFormSubmit(heroForm, 'A pet transport specialist will contact you shortly with your personalized quote.');
  }

  // Main quote form
  const mainForm = document.getElementById('main-quote-form');
  if (mainForm) {
    handleFormSubmit(mainForm, 'Thank you! Your quote request has been submitted. We\'ll reach out within 1 hour to discuss your pet\'s transport needs.');
  }

  // ============================================
  // TESTIMONIAL CAROUSEL
  // ============================================
  const testimonialsTrack = document.querySelector('.testimonials-track');
  if (testimonialsTrack) {
    let currentIndex = 0;
    const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');
    const dots = document.querySelectorAll('.testimonial-dot');

    function getVisibleCount() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function updateCarousel() {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, totalCards - visibleCount);
      currentIndex = Math.min(currentIndex, maxIndex);
      const translateX = -(currentIndex * (100 / visibleCount));
      testimonialsTrack.style.transform = `translateX(${translateX / (totalCards / visibleCount)}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn?.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateCarousel();
    });

    nextBtn?.addEventListener('click', () => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, totalCards - visibleCount);
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateCarousel();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
    });

    // Auto-rotate
    let autoRotate = setInterval(() => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, totalCards - visibleCount);
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateCarousel();
    }, 5000);

    testimonialsTrack.addEventListener('mouseenter', () => clearInterval(autoRotate));
    testimonialsTrack.addEventListener('mouseleave', () => {
      autoRotate = setInterval(() => {
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(0, totalCards - visibleCount);
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
      }, 5000);
    });

    window.addEventListener('resize', updateCarousel);
  }

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-80px 0px -80% 0px' });

  sections.forEach(section => navObserver.observe(section));

  // ============================================
  // PHONE NUMBER CLICK TRACKING
  // ============================================
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      // Analytics event tracking placeholder
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_click', {
          'event_category': 'contact',
          'event_label': link.href
        });
      }
    });
  });

  // ============================================
  // FLOATING CHAT BUTTON
  // ============================================
  const chatBtn = document.querySelector('.chat-float-btn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      // Integrate with preferred chat widget
      alert('Chat functionality — connect your preferred live chat widget (e.g. Tidio, Intercom, etc.)');
    });
  }

  // ============================================
  // SCHEMA MARKUP INJECTION
  // ============================================
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Family First Pet Drivers",
    "description": "Premium VIP pet transportation services in Houston, Texas and nationwide. GPS tracking, insured, real-time updates.",
    "url": window.location.origin,
    "telephone": "+1-XXX-XXX-XXXX",
    "email": "info@familyfirstpetdrivers.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Houston",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "29.7604",
      "longitude": "-95.3698"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "07:00",
        "closes": "17:00"
      }
    ],
    "serviceArea": {
      "@type": "Country",
      "name": "United States"
    },
    "priceRange": "$$-$$$",
    "image": window.location.origin + "/images/og-image.jpg",
    "areaServed": [
      { "@type": "City", "name": "Houston", "containedInPlace": { "@type": "State", "name": "Texas" } }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Pet Transportation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Long Distance Pet Transport",
            "description": "Safe, insured pet transportation across state lines and across the country"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Local Pet Transport",
            "description": "Door-to-door local pet transportation in and around Houston, TX"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Flight Nanny & Flight Transport Services",
            "description": "In-cabin flight nanny services for safe air travel with your pet"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "120",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify(schema);
  document.head.appendChild(schemaScript);

  console.log('🐾 Family First Pet Drivers - Website loaded successfully.');
});
