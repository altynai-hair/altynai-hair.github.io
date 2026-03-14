(function () {
  'use strict';

  // ===== #11 Page Loader — waits for critical images =====
  var loader = document.getElementById('loader');
  var loaderBar = loader ? loader.querySelector('.loader-bar') : null;
  var loaderDone = false;

  function hideLoader() {
    if (loaderDone) return;
    loaderDone = true;
    if (loaderBar) loaderBar.style.width = '100%';
    setTimeout(function () {
      if (loader) loader.classList.add('is-done');
    }, 350);
  }

  if (loaderBar) {
    loaderBar.style.width = '30%';

    var heroImg = document.querySelector('.hero-image img');
    var criticalImages = heroImg ? [heroImg] : [];
    var loaded = 0;
    var total = criticalImages.length || 1;

    function onImageProgress() {
      loaded++;
      var pct = 30 + (loaded / total) * 60;
      loaderBar.style.width = Math.min(pct, 90) + '%';
      if (loaded >= total) hideLoader();
    }

    criticalImages.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        onImageProgress();
      } else {
        img.addEventListener('load', onImageProgress);
        img.addEventListener('error', onImageProgress);
      }
    });

    window.addEventListener('load', function () {
      loaderBar.style.width = '95%';
      setTimeout(hideLoader, 200);
    });

    setTimeout(hideLoader, 4000);
  }

  gsap.registerPlugin(ScrollTrigger);

  // ===== Lenis Smooth Scroll =====
  var lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // ===== Custom Cursor =====
  var cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    var dot = cursor.querySelector('.cursor-dot');
    var ring = cursor.querySelector('.cursor-ring');
    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.1, overwrite: true });
    });

    gsap.ticker.add(function () {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      gsap.set(ring, { x: rx, y: ry });
    });

    var interactives = document.querySelectorAll('a, button, .tilt-card');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
  }

  // ===== Header Scroll =====
  var header = document.getElementById('header');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: function (self) {
      if (self.progress > 0) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
  });

  // ===== Mobile Nav =====
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  // ===== Smooth Anchor Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = this.getAttribute('href');
      if (hash.length < 2) return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      lenis.scrollTo(target, {
        duration: 2,
        easing: function (t) {
          return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
        },
        offset: -80,
        onComplete: function () {
          target.classList.add('scroll-highlight');
          setTimeout(function () { target.classList.remove('scroll-highlight'); }, 800);
        }
      });

      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ===== Text Split Helper =====
  function splitTextIntoChars(el) {
    var text = el.textContent;
    var html = '';
    var words = text.split(' ');
    words.forEach(function (word, wi) {
      html += '<span class="word">';
      for (var i = 0; i < word.length; i++) {
        html += '<span class="char">' + word[i] + '</span>';
      }
      html += '</span>';
      if (wi < words.length - 1) html += ' ';
    });
    el.innerHTML = html;
    return el.querySelectorAll('.char');
  }

  // ===== Hero Animations =====
  var heroTl = gsap.timeline({ delay: 0.5 });

  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    var chars = splitTextIntoChars(heroTitle);
    heroTl.to(chars, {
      y: 0, opacity: 1, duration: 0.8,
      stagger: 0.03, ease: 'power3.out'
    }, 0);
  }

  heroTl.to('.hero-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
  heroTl.to('.hero-image', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.3);
  heroTl.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5);
  heroTl.to('.hero-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.7);
  heroTl.to('.hero-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.9);

  // ===== Counter Animation =====
  document.querySelectorAll('.stat-num').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(obj.val) + suffix;
          }
        });
      }
    });
  });

  // ===== Scroll Text Split Animations =====
  document.querySelectorAll('.section-heading, .cta-heading').forEach(function (el) {
    var c = splitTextIntoChars(el);
    gsap.to(c, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 0, opacity: 1, duration: 0.6,
      stagger: 0.02, ease: 'power3.out'
    });
  });

  // ===== Fade-Up Elements =====
  document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
    if (el.closest('.hero')) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
    });
  });

  // ===== Image Reveal =====
  document.querySelectorAll('[data-animate="reveal-img"] .img-reveal-wrap').forEach(function (wrap) {
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top 80%',
      once: true,
      onEnter: function () { wrap.classList.add('is-revealed'); }
    });
  });

  // ===== #6 About Image Parallax =====
  var aboutImg = document.querySelector('.about-img-col img');
  if (aboutImg && window.innerWidth > 767) {
    gsap.to(aboutImg, {
      scrollTrigger: {
        trigger: '.about-inner',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      yPercent: -12,
      ease: 'none'
    });
  }

  // ===== Pricing Cards Stagger =====
  gsap.from('.pricing-card', {
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%', once: true },
    y: 60, opacity: 0, duration: 0.7,
    stagger: 0.12, ease: 'power2.out'
  });

  // ===== Timeline Progress =====
  var timelineProgress = document.querySelector('.timeline-progress');
  var timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineProgress) {
    ScrollTrigger.create({
      trigger: '.timeline',
      start: 'top 70%',
      end: 'bottom 50%',
      scrub: true,
      onUpdate: function (self) {
        gsap.set(timelineProgress, { height: (self.progress * 100) + '%' });
        timelineItems.forEach(function (item, i) {
          var threshold = (i + 1) / timelineItems.length;
          if (self.progress >= threshold - 0.1) item.classList.add('is-active');
          else item.classList.remove('is-active');
        });
      }
    });
  }

  // ===== FAQ Accordion with fade-in =====
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var panel = this.nextElementSibling;

      document.querySelectorAll('.faq-trigger').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.faq-panel').forEach(function (p) {
        p.style.maxHeight = '0';
        p.classList.remove('is-open');
      });

      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.classList.add('is-open');
      }
    });
  });

  // ===== 3D Tilt on Pricing Cards =====
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotateX = ((y - cy) / cy) * -8;
      var rotateY = ((x - cx) / cx) * 8;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // ===== Magnetic Buttons =====
  document.querySelectorAll('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // ===== Hero Image Parallax =====
  var heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    gsap.fromTo(heroImage, { opacity: 1, y: 0, scale: 1 }, {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: -80,
      scale: 0.9,
      opacity: 0,
      immediateRender: false,
      ease: 'none'
    });
  }

  // ===== Floating Mobile CTA =====
  var floatingCta = document.getElementById('floating-cta');
  if (floatingCta) {
    ScrollTrigger.create({
      start: 'top -400',
      onUpdate: function (self) {
        if (self.progress > 0) floatingCta.classList.add('is-visible');
        else floatingCta.classList.remove('is-visible');
      }
    });
  }

})();
