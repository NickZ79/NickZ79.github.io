/* Shared chrome + behavior for nkzastrow.dev — schematic redesign */
(function () {
  'use strict';

  function loadPart(id, file) {
    var target = document.getElementById(id);
    if (!target) return Promise.resolve();
    return fetch('/includes/' + file)
      .then(function (resp) { return resp.text(); })
      .then(function (html) { target.innerHTML = html; })
      .catch(function (err) { console.error('Include load error for ' + file, err); });
  }

  function injectChrome() {
    var sweep = document.createElement('div');
    sweep.className = 'scan-sweep';
    sweep.setAttribute('aria-hidden', 'true');
    sweep.innerHTML = '<div class="scan-bar"></div>';
    document.body.appendChild(sweep);

    ['corner-tl', 'corner-tr', 'corner-bl', 'corner-br'].forEach(function (cls) {
      var mark = document.createElement('div');
      mark.className = 'corner-mark ' + cls;
      mark.setAttribute('aria-hidden', 'true');
      document.body.appendChild(mark);
    });
  }

  function computeStardate() {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 0);
    var day = Math.floor((d - start) / 86400000);
    var base = 78000 + (d.getFullYear() - 2025) * 1000 + Math.round((day / 365) * 1000);
    var frac = Math.floor((d.getHours() * 60 + d.getMinutes()) / 144);
    return base + '.' + frac;
  }

  function updateStardate() {
    var el = document.getElementById('stardate');
    if (el) el.textContent = computeStardate();
  }

  function setActiveNav() {
    var page = document.body.getAttribute('data-page');
    var links = document.querySelectorAll('#siteNav a[data-nav]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-nav') === page) links[i].classList.add('active');
    }
  }

  var audioCtx;
  function blip(freq) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = audioCtx || new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.09);
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + 0.22);
    } catch (e) { /* audio is decorative — never block navigation on it */ }
  }

  function setupAudioToggle() {
    var btn = document.getElementById('audioToggle');
    if (!btn) return;
    var label = btn.querySelector('.audio-label');
    var on = localStorage.getItem('nkz-sound') === 'on';

    function render() {
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      if (label) label.textContent = on ? 'Audio On' : 'Audio Off';
    }
    render();

    btn.addEventListener('click', function () {
      on = !on;
      localStorage.setItem('nkz-sound', on ? 'on' : 'off');
      render();
      if (on) blip(1040);
    });
  }

  function setupNavToggle() {
    var btn = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectChrome();
    Promise.all([loadPart('header', 'header.html'), loadPart('footer', 'footer.html')]).then(function () {
      updateStardate();
      setInterval(updateStardate, 30000);
      setActiveNav();
      setupAudioToggle();
      setupNavToggle();
    });
  });
})();
