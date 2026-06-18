/* Family First Drivers — Main JS | Ivory Tower Marketing */
document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav
  const toggle = document.querySelector('.menu-toggle');
  const mobNav = document.querySelector('.mob-nav');
  const overlay = document.querySelector('.mob-overlay');
  const closeNav = () => {
    toggle?.classList.remove('active');
    mobNav?.classList.remove('open');
    overlay?.classList.remove('open');
    toggle?.setAttribute('aria-expanded','false');
    mobNav?.setAttribute('aria-hidden','true');
  };
  toggle?.addEventListener('click', () => {
    const open = mobNav?.classList.toggle('open');
    toggle.classList.toggle('active');
    overlay?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobNav?.setAttribute('aria-hidden', open ? 'false' : 'true');
  });
  overlay?.addEventListener('click', closeNav);
  document.querySelectorAll('.mob-link, .mob-nav a').forEach(l => l.addEventListener('click', closeNav));

  // Sticky header
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        const offset = document.querySelector('.header')?.offsetHeight || 80;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        closeNav();
      }
    });
  });

  // Intersection observer
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in,.fade-l,.fade-r').forEach(el => io.observe(el));

  // Counter animation
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 2000;
      const start = performance.now();
      const isFloat = target % 1 !== 0;
      const run = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (isFloat ? (target * ease).toFixed(1) : Math.floor(target * ease)) + suffix;
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => co.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded','false');
      });
      if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    });
  });

  // Form validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(f => {
        f.style.borderColor = '';
        if (!f.value.trim()) { f.style.borderColor = '#EF4444'; valid = false; }
      });
      if (!valid) return;
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn?.innerHTML;
      if (btn) { btn.innerHTML = '✓ Sent! We\'ll contact you within 1 hour.'; btn.style.background = '#10B981'; btn.disabled = true; }
      setTimeout(() => { if (btn) { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; } form.reset(); }, 5000);
    });
  });

  // Schema markup
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.familyfirstdrivers.com/#org",
    "name": "Family First Drivers",
    "description": "USDA registered VIP pet transportation in Houston, TX. GPS tracking, insured, solo rides only. Nationwide service.",
    "url": "https://www.familyfirstdrivers.com",
    "telephone": "+18324849920",
    "email": "familyfirstdrivers@gmail.com",
    "hasCredential": "USDA Certificate No. 74-T-1212",
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "07:00", "closes": "17:00" }
    ],
    "address": { "@type": "PostalAddress", "addressLocality": "Houston", "addressRegion": "TX", "addressCountry": "US" },
    "geo": { "@type": "GeoCoordinates", "latitude": 29.7604, "longitude": -95.3698 },
    "areaServed": { "@type": "Country", "name": "United States" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "300", "bestRating": "5" },
    "priceRange": "$$",
    "paymentAccepted": "Zelle, Venmo, Credit Card, Debit Card"
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
});
