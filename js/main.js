const WA = 'https://wa.me/923265652798';

document.addEventListener('DOMContentLoaded', function () {

  /* ─── Nav Toggle ─── */
  const menuBtn = document.querySelector('.menu');
  const nav = document.querySelector('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  /* ─── Header Scroll ─── */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ─── Active Nav Link ─── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ─── Scroll Reveal ─── */
  const revObs = new IntersectionObserver(
    function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); }); },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });

  /* ─── Back to Top ─── */
  const btt = document.getElementById('backToTop');
  if (btt) {
    btt.style.display = 'none';
    window.addEventListener('scroll', function () {
      btt.style.display = window.scrollY > 400 ? 'grid' : 'none';
    });
    btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ─── Lightbox ─── */
  var lbImages = [];
  var lbIdx = 0;

  var lbOverlay = document.createElement('div');
  lbOverlay.className = 'lightbox-overlay';
  lbOverlay.style.display = 'none';
  lbOverlay.innerHTML =
    '<button class="lightbox-close"><i class="fa-solid fa-xmark"></i></button>' +
    '<button class="lightbox-prev"><i class="fa-solid fa-chevron-left"></i></button>' +
    '<img class="lightbox-img" src="" alt="Gallery photo">' +
    '<button class="lightbox-next"><i class="fa-solid fa-chevron-right"></i></button>' +
    '<div class="lightbox-counter"></div>';
  document.body.appendChild(lbOverlay);

  function lbShow(imgs, i) {
    lbImages = imgs; lbIdx = i; lbUpdate();
    lbOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function lbHide() {
    lbOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
  function lbUpdate() {
    lbOverlay.querySelector('.lightbox-img').src = lbImages[lbIdx];
    lbOverlay.querySelector('.lightbox-counter').textContent = (lbIdx + 1) + ' / ' + lbImages.length;
  }

  lbOverlay.addEventListener('click', function (e) { if (e.target === lbOverlay) lbHide(); });
  lbOverlay.querySelector('.lightbox-close').addEventListener('click', lbHide);
  lbOverlay.querySelector('.lightbox-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    lbIdx = (lbIdx - 1 + lbImages.length) % lbImages.length; lbUpdate();
  });
  lbOverlay.querySelector('.lightbox-next').addEventListener('click', function (e) {
    e.stopPropagation();
    lbIdx = (lbIdx + 1) % lbImages.length; lbUpdate();
  });
  document.addEventListener('keydown', function (e) {
    if (lbOverlay.style.display === 'none') return;
    if (e.key === 'Escape') lbHide();
    if (e.key === 'ArrowLeft') { lbIdx = (lbIdx - 1 + lbImages.length) % lbImages.length; lbUpdate(); }
    if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbImages.length; lbUpdate(); }
  });

  document.querySelectorAll('.gallery-group').forEach(function (group) {
    var items = group.querySelectorAll('.gallery-item');
    var imgs = Array.from(items).map(function (el) { return el.dataset.src; });
    items.forEach(function (item, i) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () { lbShow(imgs, i); });
    });
  });

  /* ─── Testimonials Slider ─── */
  var reviewGrid = document.querySelector('.review-grid');
  var dotsWrap = document.querySelector('.slider-dots');
  if (reviewGrid) {
    var cards = Array.from(reviewGrid.querySelectorAll('.review-card'));
    var tIdx = 0;
    var tPaused = false;
    var tTimer;

    function tVisible() { return window.innerWidth < 768 ? 1 : 3; }
    function tMax() { return Math.max(0, cards.length - tVisible()); }

    function tUpdate() {
      var vis = tVisible();
      cards.forEach(function (c, i) {
        c.style.display = (i >= tIdx && i < tIdx + vis) ? '' : 'none';
      });
      if (dotsWrap) {
        Array.from(dotsWrap.querySelectorAll('.dot')).forEach(function (d, i) {
          d.classList.toggle('active', i === tIdx);
        });
      }
    }

    function tBuildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= tMax(); i++) {
        (function (i) {
          var btn = document.createElement('button');
          btn.className = 'dot' + (i === 0 ? ' active' : '');
          btn.addEventListener('click', function () { tIdx = i; tUpdate(); });
          dotsWrap.appendChild(btn);
        })(i);
      }
    }

    function tStart() {
      clearInterval(tTimer);
      tTimer = setInterval(function () {
        if (!tPaused) { tIdx = tIdx >= tMax() ? 0 : tIdx + 1; tBuildDots(); tUpdate(); }
      }, 4000);
    }

    var sliderWrap = document.querySelector('.review-slider-wrap');
    if (sliderWrap) {
      sliderWrap.addEventListener('mouseenter', function () { tPaused = true; });
      sliderWrap.addEventListener('mouseleave', function () { tPaused = false; });
      var btns = sliderWrap.querySelectorAll('.slider-btn');
      if (btns[0]) btns[0].addEventListener('click', function () { tIdx = tIdx <= 0 ? tMax() : tIdx - 1; tBuildDots(); tUpdate(); });
      if (btns[1]) btns[1].addEventListener('click', function () { tIdx = tIdx >= tMax() ? 0 : tIdx + 1; tBuildDots(); tUpdate(); });
    }

    window.addEventListener('resize', function () { tIdx = Math.min(tIdx, tMax()); tBuildDots(); tUpdate(); });
    tBuildDots(); tUpdate(); tStart();
  }

  /* ─── FAQ Accordion ─── */
  document.querySelectorAll('.bp-faq-item').forEach(function (item) {
    var btn = item.querySelector('button');
    var ans = item.querySelector('.faq-answer');
    if (ans) ans.style.display = 'none';
    if (btn) {
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.bp-faq-item').forEach(function (it) {
          it.classList.remove('open');
          var a = it.querySelector('.faq-answer');
          var arrow = it.querySelector('.faq-arrow');
          var chevron = it.querySelector('button .fa-chevron-down, button .fa-chevron-up');
          if (a) a.style.display = 'none';
          if (arrow) arrow.textContent = '+';
          if (chevron) { chevron.classList.remove('fa-chevron-up'); chevron.classList.add('fa-chevron-down'); }
          var b = it.querySelector('button'); if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          var a2 = item.querySelector('.faq-answer');
          var arrow2 = item.querySelector('.faq-arrow');
          var chevron2 = btn.querySelector('.fa-chevron-down, .fa-chevron-up');
          if (a2) a2.style.display = 'block';
          if (arrow2) arrow2.textContent = '−';
          if (chevron2) { chevron2.classList.remove('fa-chevron-down'); chevron2.classList.add('fa-chevron-up'); }
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ─── Forms: show success message ─── */
  document.querySelectorAll('form.ajax-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.success');
      if (msg) msg.style.display = 'block';
    });
  });

});
