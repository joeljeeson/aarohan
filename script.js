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

  /* ---------- Schedule page rendering, flipping and per-item ICS ---------- */
  // If there's a #scheduleData JSON blob on the page, render calendar and events
  function renderScheduleIfPresent() {
    const dataEl = document.getElementById('scheduleData');
    if (!dataEl) return;
    let events = [];
    try { events = JSON.parse(dataEl.textContent || '[]'); } catch (e) { console.error('Invalid schedule JSON', e); return; }

    // normalize dates to Date objects
    events = events.map(ev => ({
      title: ev.title,
      start: new Date(ev.start),
      end: ev.end ? new Date(ev.end) : null,
      desc: ev.desc || ''
    }));

    // determine month/year to display (use month of first event or today)
    const first = events[0] || { start: new Date() };
    const viewDate = new Date(first.start.getFullYear(), first.start.getMonth(), 1);

    const monthLabelEl = document.querySelector('.month-label');
    const daysGrid = document.querySelector('.days-grid');
    const eventsList = document.querySelector('.events-list');
    const eventsForEl = document.querySelector('.events-for .events-date') || document.querySelector('.events-date');

    if (!daysGrid || !eventsList || !monthLabelEl) return;

    function renderMonth(dt) {
      daysGrid.innerHTML = '';
      const year = dt.getFullYear();
      const month = dt.getMonth();
      monthLabelEl.textContent = dt.toLocaleString(undefined, { month: 'long', year: 'numeric' });

      const firstDay = new Date(year, month, 1);
      const startDow = firstDay.getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      // previous month tail
      const prevCount = startDow;
      const total = prevCount + lastDate;
      const rows = Math.ceil(total / 7) * 7;

      for (let i = 0; i < rows; i++) {
        const cell = document.createElement('div');
        cell.className = 'day';
        const dayIndex = i - prevCount + 1;
        if (dayIndex < 1 || dayIndex > lastDate) {
          cell.classList.add('inactive');
          cell.innerHTML = `<span class="num">&nbsp;</span>`;
        } else {
          const dateObj = new Date(year, month, dayIndex);
          const iso = dateObj.toISOString().slice(0,10);
          const todaysEvents = events.filter(ev => ev.start.toISOString().slice(0,10) === iso);
          cell.dataset.date = iso;
          cell.innerHTML = `<span class="num">${dayIndex}</span><span class="evt-count">${todaysEvents.length ? todaysEvents.length + ' events' : ''}</span>`;
          if (todaysEvents.length) cell.classList.add('has-events');
          // highlight today
          const now = new Date();
          if (dateObj.toDateString() === now.toDateString()) cell.classList.add('today');
          // click to show events
          cell.addEventListener('click', () => showEventsForDate(iso));
        }
        daysGrid.appendChild(cell);
      }
    }

    function fmtTime(d) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function showEventsForDate(isoDate) {
      const dayEvents = events.filter(ev => ev.start.toISOString().slice(0,10) === isoDate);
      eventsList.innerHTML = '';
      eventsForEl && (eventsForEl.textContent = new Date(isoDate).toLocaleDateString());
      if (!dayEvents.length) {
        eventsList.innerHTML = '<p class="muted">No events for this day.</p>';
        return;
      }

      dayEvents.forEach(ev => {
        const cardWrap = document.createElement('div');
        cardWrap.className = 'timeline-item';
        // inner 3d card
        const card3d = document.createElement('div');
        card3d.className = 'card-3d';

        const front = document.createElement('div');
        front.className = 'front';
        front.innerHTML = `<div class="time">${fmtTime(ev.start)}${ev.end ? ' - ' + fmtTime(ev.end) : ''}</div>
          <div class="content"><h3>${ev.title}</h3><p>${ev.desc}</p>
            <div class="item-actions">
              <a class="btn small gcal-btn" href="#" data-start="${ev.start.toISOString()}" data-end="${ev.end ? ev.end.toISOString() : ''}">Add to Google Calendar</a>
              <a class="btn small ics-btn" href="#" data-start="${ev.start.toISOString()}" data-end="${ev.end ? ev.end.toISOString() : ''}">Download .ics</a>
            </div>
          </div>`;

        const back = document.createElement('div');
        back.className = 'back';
        back.innerHTML = `<strong>${ev.title}</strong><p style="margin-top:8px">${ev.desc}</p><p style="margin-top:12px; font-size:0.85rem; color:rgba(255,255,255,0.75)">Click card to flip back</p>`;

        card3d.appendChild(front);
        card3d.appendChild(back);
        cardWrap.appendChild(card3d);

        // clicking on the card (but not on buttons) toggles flip
        cardWrap.addEventListener('click', (e) => {
          if (e.target.closest('a') || e.target.closest('button')) return; // don't flip when clicking controls
          cardWrap.classList.toggle('flipped');
        });

        // wire actions
        setTimeout(() => {
          const gcalBtn = cardWrap.querySelector('.gcal-btn');
          const icsBtn = cardWrap.querySelector('.ics-btn');
          if (gcalBtn) {
            gcalBtn.addEventListener('click', (evnt) => {
              evnt.preventDefault();
              const s = new Date(gcalBtn.dataset.start);
              const e = gcalBtn.dataset.end ? new Date(gcalBtn.dataset.end) : new Date(s.getTime() + 60*60*1000);
              const fmt = d => d.toISOString().replace(/[-:]|\.\d{3}/g,'');
              const title = encodeURIComponent(front.querySelector('h3').textContent.trim());
              const details = encodeURIComponent(front.querySelector('p').textContent.trim());
              const loc = encodeURIComponent('Benedict College of Engineering and Technology');
              const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(s)}/${fmt(e)}&details=${details}&location=${loc}&sf=true&output=xml`;
              window.open(url, '_blank');
            });
          }
          if (icsBtn) {
            icsBtn.addEventListener('click', (evnt) => {
              evnt.preventDefault();
              const s = new Date(icsBtn.dataset.start);
              const e = icsBtn.dataset.end ? new Date(icsBtn.dataset.end) : new Date(s.getTime() + 60*60*1000);
              const uid = `aarohan-${Date.now()}@local`;
              const dtstamp = toISOStringNoMs(new Date());
              const icsLines = [
                'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aarohan//EN', 'CALSCALE:GREGORIAN',
                'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${dtstamp}`,
                `DTSTART:${toISOStringNoMs(s)}`, `DTEND:${toISOStringNoMs(e)}`,
                `SUMMARY:${front.querySelector('h3').textContent.trim()}`,
                `DESCRIPTION:${front.querySelector('p').textContent.trim()}`,
                `LOCATION:${'Benedict College of Engineering and Technology'}`,
                'END:VEVENT', 'END:VCALENDAR'
              ];
              const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${front.querySelector('h3').textContent.trim().replace(/[^a-z0-9\-]/gi,'_')}.ics`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              setTimeout(() => URL.revokeObjectURL(url), 60*1000);
            });
          }
        }, 0);

        eventsList.appendChild(cardWrap);
      });
    }

    // month navigation
    document.querySelectorAll('.cal-prev, .cal-next').forEach(btn => {
      btn.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + (btn.classList.contains('cal-prev') ? -1 : 1));
        renderMonth(viewDate);
        // clear events display
        document.querySelector('.events-list').innerHTML = '<p class="muted">Select a date to view events.</p>';
        const label = document.querySelector('.events-date'); if (label) label.textContent = '—';
      });
    });

    // initial render
    renderMonth(viewDate);
    // auto-select today if present, otherwise first day with events
    const todayIso = new Date().toISOString().slice(0,10);
    const hasToday = events.some(ev => ev.start.toISOString().slice(0,10) === todayIso);
    if (hasToday) showEventsForDate(todayIso);
    else if (events.length) showEventsForDate(events[0].start.toISOString().slice(0,10));
  }

  // initialize schedule rendering on DOM ready
  document.addEventListener('DOMContentLoaded', renderScheduleIfPresent);