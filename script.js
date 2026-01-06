// Dark / Light Mode Toggle
function toggleMode() {
  const body = document.body;
  body.classList.toggle("light");
  updateThemeToggle();
}

function updateThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isLight = document.body.classList.contains('light');
  // When in light mode, show moon (to switch to dark). When in dark, show sun (to switch to light).
  btn.textContent = isLight ? '🌙' : '☀️';
  btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
}

// attach event to themeToggle if present
document.addEventListener('DOMContentLoaded', () => {
  const tt = document.getElementById('themeToggle');
  if (tt) tt.addEventListener('click', toggleMode);
  // initialize icon on load
  updateThemeToggle();
});

// also try to initialize immediately (script is loaded at end of body)
updateThemeToggle();

// Scroll Reveal Animation for all sections
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Respect any inline delay already set by script
      entry.target.classList.add("show");
    }
  });
}, observerOptions);

// Observe every element with the 'fade' class and add a small staggered delay
const fadeElements = Array.from(document.querySelectorAll('.fade'));
fadeElements.forEach((el, i) => {
  // stagger 100ms per element for a cascading effect
  el.style.transitionDelay = `${i * 100}ms`;
  observer.observe(el);
});

/* Typewriter effect for the tagline */
const taglineEl = document.querySelector('.tagline');
if (taglineEl) {
  const fullText = taglineEl.textContent.trim();
  taglineEl.textContent = '';
  const speed = 30; // ms per character
  let idx = 0;
  const typeTimeout = setTimeout(function type() {
    if (idx <= fullText.length - 1) {
      taglineEl.textContent += fullText.charAt(idx++);
      setTimeout(type, speed);
    }
  }, 600);
}

/* Ripple effect for buttons */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
    circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });
});

/* Card tilt on mouse move */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / rect.width * 12; // rotateY
    const dy = (y - cy) / rect.height * -12; // rotateX
    card.style.transform = `rotateX(${dy}deg) rotateY(${dx}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* Hero parallax overlay */
const hero = document.querySelector('.hero');
const overlay = document.querySelector('.overlay');
if (hero && overlay) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    overlay.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    overlay.style.transform = 'translate(0, 0)';
  });
}

/* Scroll progress bar */
const progress = document.createElement('div');
progress.className = 'progress';
document.body.appendChild(progress);
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  progress.style.width = scrolled + '%';
});

/* Smooth scroll for hero scroll indicator */
document.querySelectorAll('.scroll-down a, .scroll-down').forEach(el => {
  // nothing — placeholder in case anchor wrappers exist
});

const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* Countdown for event: reads ISO datetime from .event-date[data-date] */
function startCountdown() {
  const dateEl = document.querySelector('.event-date');
  if (!dateEl) return;
  const iso = dateEl.getAttribute('data-date');
  if (!iso) return;
  const target = new Date(iso);
  const daysEl = document.querySelector('.cd-days');
  const hoursEl = document.querySelector('.cd-hours');
  const minsEl = document.querySelector('.cd-mins');
  const secsEl = document.querySelector('.cd-secs');

  function update() {
    const now = new Date();
    const diff = target - now;
    if (isNaN(diff)) {
      // invalid date
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '--';
      return;
    }
    if (diff <= 0) {
      // event started or in the past
      const eventText = 'Event live or started';
      const parent = dateEl.parentElement;
      if (parent) {
        parent.querySelector('.countdown').textContent = eventText;
      }
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  const timer = setInterval(update, 1000);
}

startCountdown();

/* Calendar links (Google Calendar + ICS download) */
function toISOStringNoMs(d){
  // returns YYYYMMDDTHHMMSSZ (UTC) for calendar/ICS
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth()+1).padStart(2,'0');
  const dd = String(d.getUTCDate()).padStart(2,'0');
  const hh = String(d.getUTCHours()).padStart(2,'0');
  const min = String(d.getUTCMinutes()).padStart(2,'0');
  const ss = String(d.getUTCSeconds()).padStart(2,'0');
  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
}

function setupCalendarButtons(){
  const dateEl = document.querySelector('.event-date');
  const gcal = document.getElementById('gcalLink');
  const ics = document.getElementById('icsLink');
  if (!dateEl || !gcal || !ics) return;
  const startIso = dateEl.getAttribute('data-date');
  const endIso = dateEl.getAttribute('data-end');
  if (!startIso) return;
  const start = new Date(startIso);
  let end = endIso ? new Date(endIso) : new Date(start.getTime() + 8*60*60*1000);

  // Build Google Calendar URL
  const title = encodeURIComponent('AAROHAN - Tech & Innovation Fest');
  const details = encodeURIComponent('Aarohan at Benedict College of Engineering and Technology');
  const location = encodeURIComponent('Benedict College of Engineering and Technology');
  const dates = `${toISOStringNoMs(start)}/${toISOStringNoMs(end)}`;
  const gcalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  gcal.setAttribute('href', gcalUrl);

  // Build ICS content
  const uid = `aarohan-${Date.now()}@local`;
  const dtstamp = toISOStringNoMs(new Date());
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aarohan//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toISOStringNoMs(start)}`,
    `DTEND:${toISOStringNoMs(end)}`,
    `SUMMARY:${'AAROHAN - Tech & Innovation Fest'}`,
    `DESCRIPTION:${'Aarohan at Benedict College of Engineering and Technology'}`,
    `LOCATION:${'Benedict College of Engineering and Technology'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  ics.setAttribute('href', url);
  ics.setAttribute('download', 'aarohan-event.ics');
}

// ensure buttons created after DOM load
document.addEventListener('DOMContentLoaded', setupCalendarButtons);
// also call now (script loaded at end of body)
setupCalendarButtons();

/* Stats counter: animate when visible */
const statObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.number');
      nums.forEach(n => {
        const target = +n.getAttribute('data-target') || 0;
        const duration = 1200;
        const start = performance.now();
        const from = 0;
        const step = (ts) => {
          const progress = Math.min((ts - start) / duration, 1);
          n.textContent = Math.floor(progress * (target - from) + from);
          if (progress < 1) requestAnimationFrame(step);
          else n.textContent = target;
        };
        requestAnimationFrame(step);
      });
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats').forEach(s => statObserver.observe(s));

/* Modal behaviour */
const learnBtn = document.getElementById('learnMoreBtn');
const modal = document.getElementById('about-modal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
if (learnBtn && modal) {
  const openModal = () => {
    modal.setAttribute('aria-hidden', 'false');
    const panel = modal.querySelector('.modal-panel');
    if (panel) panel.focus();
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  learnBtn.addEventListener('click', openModal);
  modalClose && modalClose.addEventListener('click', closeModal);
  modalBackdrop && modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}