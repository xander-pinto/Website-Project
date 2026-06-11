/* ============================================================
   Tommy's Tunes — main.js

   What this file does:
   1. Loads shared components (nav, footer, modal) into every page
   2. Handles the "Check your date" modal
   3. Handles nav scroll behavior + mobile menu
   4. Picks 4 random featured talent and 1 random testimonial per page load

   Where to edit content:
   - Add/remove featured talent: /js/data/team-data.js (window.TEAM_DATA)
   - Add/remove testimonial quotes: /js/data/testimonials-data.js (window.TESTIMONIALS_DATA)
   - All other content lives in the .html files
   ============================================================ */


/* --- Component loader ---
   Pages drop in <div data-component="nav"></div> etc. and main.js
   fetches the matching file from /components/ and injects it. */

const COMPONENTS = {
  nav: '/components/nav.html',
  footer: '/components/footer.html',
  modal: '/components/modal-check-your-date.html',
};

async function loadComponents() {
  const slots = document.querySelectorAll('[data-component]');
  await Promise.all(Array.from(slots).map(async (slot) => {
    const name = slot.dataset.component;
    const url = COMPONENTS[name];
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      slot.outerHTML = await res.text();
    } catch (err) {
      console.warn(`[components] failed to load ${name}:`, err);
    }
  }));
}


/* --- Nav: active link, scroll state, mobile menu --- */

function setupNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  // Mark the active link based on the current page name.
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  const navKey = page === '' || page === 'index' ? 'home' : page;
  nav.querySelectorAll(`[data-nav="${navKey}"]`).forEach((el) => {
    el.setAttribute('aria-current', 'page');
  });

  // Add .is-scrolled when the user scrolls past 24px.
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile burger toggle.
  const burger = nav.querySelector('.nav-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close mobile menu when a link is tapped.
    nav.querySelectorAll('.nav-mobile a, .nav-mobile button').forEach((el) => {
      el.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}


/* --- Modal: Check your date --- */

function setupModal() {
  const modal = document.getElementById('check-your-date-modal');
  if (!modal) return;

  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstField = modal.querySelector('input, select, textarea, button');
    if (firstField) setTimeout(() => firstField.focus(), 60);
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  // Any element with data-open-modal triggers the modal.
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-modal="true"]')) {
      e.preventDefault();
      open();
    }
    if (e.target.closest('[data-close-modal="true"]')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  // "I don't know my date yet" — disable the date input when checked.
  const noDate = modal.querySelector('#cyd-no-date');
  const dateField = modal.querySelector('#cyd-date');
  if (noDate && dateField) {
    noDate.addEventListener('change', () => {
      dateField.disabled = noDate.checked;
      if (noDate.checked) dateField.value = '';
    });
  }
}


/* --- Lightbox: click any [data-lightbox] image to open full-size --- */

function setupLightbox() {
  // Build the lightbox DOM once and reuse.
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <img class="lightbox-img" src="" alt="">
    `;
    document.body.appendChild(lb);
  }

  const img = lb.querySelector('.lightbox-img');
  const closeBtn = lb.querySelector('.lightbox-close');

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    img.src = '';
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
      e.preventDefault();
      const tImg = trigger.querySelector('img') || trigger;
      const src = trigger.dataset.lightbox || (tImg.src || '');
      open(src, tImg.alt || '');
    }
  });

  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target === img) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
  });
}


/* --- Document preview: click any [data-doc] link to open in-page modal --- */

function setupDocPreview() {
  let dm = document.getElementById('doc-modal');
  if (!dm) {
    dm = document.createElement('div');
    dm.id = 'doc-modal';
    dm.className = 'doc-modal';
    dm.innerHTML = `
      <div class="doc-panel">
        <button type="button" class="doc-modal-close doc-close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div class="doc-header">
          <div class="doc-title"></div>
          <div class="doc-actions">
            <a class="btn btn-secondary doc-open" target="_blank" rel="noopener">Open in tab</a>
            <a class="btn btn-primary doc-download" download>Download</a>
          </div>
        </div>
        <iframe class="doc-frame" src="" title=""></iframe>
      </div>
    `;
    document.body.appendChild(dm);
  }

  const title = dm.querySelector('.doc-title');
  const frame = dm.querySelector('.doc-frame');
  const dlBtn = dm.querySelector('.doc-download');
  const openBtn = dm.querySelector('.doc-open');
  const closeBtn = dm.querySelector('.doc-close');

  const open = (url, name) => {
    title.textContent = name || 'Document';
    frame.src = url;
    frame.title = name || '';
    dlBtn.href = url;
    openBtn.href = url;
    dm.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    dm.classList.remove('is-open');
    document.body.style.overflow = '';
    frame.src = '';
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-doc]');
    if (trigger) {
      e.preventDefault();
      const url = trigger.dataset.doc;
      const name = trigger.dataset.docName || trigger.textContent.trim();
      open(url, name);
    }
  });

  closeBtn.addEventListener('click', close);
  dm.addEventListener('click', (e) => {
    if (e.target === dm) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dm.classList.contains('is-open')) close();
  });
}


/* --- Footer year --- */

function setupFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ============================================================
   ROTATION POOLS
   ============================================================ */

/* Featured talent rotation pool — single source of truth lives in
   /js/data/team-data.js as window.TEAM_DATA. Edit content there.
   We fall back to a tiny inline pool if the data file didn't load,
   so featured-talent rendering still works on pages that forgot to include it. */
const TEAM_POOL = (typeof window !== 'undefined' && Array.isArray(window.TEAM_DATA))
  ? window.TEAM_DATA
  : [];

/* Testimonial rotation pool — single source of truth lives in
   /js/data/testimonials-data.js as window.TESTIMONIALS_DATA. Edit content there.
   Falls back to an empty pool if the data file didn't load. */
const TESTIMONIAL_POOL = (typeof window !== 'undefined' && Array.isArray(window.TESTIMONIALS_DATA))
  ? window.TESTIMONIALS_DATA
  : [];


/* EDIT: Venue rotation pool — keep in sync with venues.html */
const VENUE_POOL = [
  'Brecknock Hall', 'Coindre Hall', 'Crescent Beach Club',
  'Crest Hollow Country Club', 'Fountainhead', 'Fox Hollow', 'Glen Cove Mansion',
  'Green Tree Country Club', 'Harbor Club @ Prime', 'Hempstead House',
  'Huntington Country Club', 'Larkfield', 'Majestic Gardens',
  'The Mansion at Oyster Bay', 'The Metropolitan - Glen Cove', 'Milleridge Inn',
  'North Hills Country Club', 'Oheka Castle', 'The Royalton - Roslyn',
  'Royalton on The Greens', 'Sea Cliff Manor', 'Seawanhaka Yacht Club',
  'Sunken Meadow Pavilion', 'Vanderbilt Mansion', "Verdi's of Westbury",
  'Watermill', 'Westbury Manor', 'The Whitman Club at The Greens',
  'Allegria', 'The Barn at Old Bethpage', 'Bellport Country Club',
  'Bourne Mansion', "Captain Bill's", 'Coral House',
  'Heritage Club at Bethpage', 'Inn at New Hyde Park', 'Jericho Terrace',
  "Land's End", 'The Lannin', "Lombardi's On The Bay",
  'Memorare Knight of Columbus', 'The Piermont', 'The Riviera', 'Sand Castle',
  'Sea Star Ballroom', 'Shandon Court', 'Simplay New York',
  'Southward Ho Country Club', 'Timber Point Country Club', 'Villa Lombardis',
  'West Hempstead Fire Department', 'Brentwood Country Club', "Danford's",
  'East Wind', 'Floral Terrace', 'Flowerfield', 'Hamlet Willow Creek (Mount Sinai)',
  'The Hamlet Windwatch', 'Hilton Garden Inn (Stony Brook)', 'Hotel Indigo',
  'Hyatt Regency Hotel', 'Irish Coffee Pub', 'Mill Pond Country Club',
  'Moose Lodge - Mt. Sinai', 'Old Field Club', 'Port Jeff Country Club',
  'Portuguese Heritage Center', 'Refuge', 'RGNY', 'Rock Hill Country Club',
  'Smithtown Landing Country Club', 'Soundview Caterers', 'Stonebridge Country Club',
  'Three Village Inn', 'Upsky', 'Windows on The Lake',
  'Duck Walk Vineyard', 'George Weir Barn', "Giorgio's", 'Jamesport Manor Inn',
  'Jedediah Hawkins', 'Macari Vineyard', 'Peconic Bay Yacht Club',
  'Raphael Vineyard', 'Sunset Harbour', 'The Vineyard Caterers',
  'American Legion Hall - Brooklyn', 'Brooklyn Botanical Gardens', 'Citi Field',
  'Crestwood Manor', 'El Caribe', 'Elks Lodge', 'Essex House',
  'Glenn Island Harbour Club', 'Mamaroneck Beach and Yacht Club', 'Marina Del Ray',
  "Russo's On The Bay", 'Trumpets on The Gate', "Water's Edge",
];


/* --- Pick N random items without repeats --- */
function pickRandom(arr, n) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}


/* --- Render: featured talent ---
   The page provides <div data-rotation="team" data-count="4"></div>
   We fill it with 4 randomized cards. */

// Homepage "Meet the crew" rotation shows only DJs, MCs, and live musicians
// (including percussionists) who have a real photo. Technicians, the dancer,
// photographers, specialty roles, and anyone still on the placeholder image
// are excluded so the homepage only ever shows finished, photo'd profiles.
const CREW_ROLE = /(\bDJ\b|\bMC\b|musician|percussionist|saxophonist)/i;
const hasRealPhoto = (p) => p.photo && !/empty_image/i.test(p.photo);

// EDIT: People to keep OUT of the homepage "Meet the crew" rotation — staff who
// only pick up the occasional shift. They still appear on the full team page;
// they just won't show as featured crew. Add or remove slugs here.
const CREW_EXCLUDE = new Set(['yianni', 'waldo', 'victor']);

function renderFeaturedTalent() {
  document.querySelectorAll('[data-rotation="team"]').forEach((slot) => {
    const count = parseInt(slot.dataset.count || '4', 10);
    const eligible = TEAM_POOL.filter((p) => p.role && CREW_ROLE.test(p.role) && hasRealPhoto(p) && !CREW_EXCLUDE.has(p.slug));
    const picks = pickRandom(eligible, count);
    slot.innerHTML = picks.map((p) => {
      const href = p.slug ? `/person/${encodeURIComponent(p.slug)}/` : null;
      const card = `
        <div class="team-card-photo" aria-hidden="true">
          <img src="${p.photo}" alt="" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="team-card-name">${p.name}</div>
        <div class="team-card-role">${p.role}</div>
      `;
      return href
        ? `<a class="card-link team-card" href="${href}">${card}</a>`
        : `<div class="team-card">${card}</div>`;
    }).join('');
  });
}


/* --- Render: testimonial --- */

function renderTestimonial() {
  document.querySelectorAll('[data-rotation="testimonial"]').forEach((slot) => {
    const count = parseInt(slot.dataset.count || '1', 10);
    const picks = pickRandom(TESTIMONIAL_POOL, count);
    if (!picks.length) return;
    const cards = picks.map((pick) => {
      const stars = '★'.repeat(pick.rating || 5);
      return `
        <blockquote class="testimonial">
          <div class="testimonial-stars" aria-label="${pick.rating || 5} out of 5 stars">${stars}</div>
          <p class="testimonial-quote">&ldquo;${pick.quote}&rdquo;</p>
          <footer class="testimonial-attr">
            <span class="testimonial-name">${pick.talent}</span>
            <span class="testimonial-meta">${pick.event} · <a href="${pick.source_url}" target="_blank" rel="noopener">${pick.source}</a></span>
          </footer>
        </blockquote>
      `;
    }).join('');
    slot.innerHTML = count > 1 ? `<div class="testimonial-pair">${cards}</div>` : cards;
  });
}


/* --- Render: upcoming showcase calendar ---
   Reads window.SHOWCASES_DATA, filters out past events, sorts by date,
   then renders cards into [data-showcase-calendar]. Hides the section
   entirely if there are no upcoming events. */
function renderShowcaseCalendar() {
  const section = document.getElementById('showcase-calendar-section');
  const container = document.querySelector('[data-showcase-calendar]');
  if (!section || !container) return;

  const data = (typeof window !== 'undefined' && Array.isArray(window.SHOWCASES_DATA))
    ? window.SHOWCASES_DATA : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = data
    .filter((ev) => new Date(ev.date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!upcoming.length) {
    container.innerHTML = `
      <div class="showcase-event-card" style="grid-column: 1 / -1; text-align: center;">
        <div class="showcase-event-type" style="margin-bottom: var(--sp-2);">Coming soon</div>
        <div class="showcase-event-venue" style="margin-bottom: var(--sp-3);">Next showcase dates to be announced</div>
        <p class="showcase-event-note">Call <a href="tel:6317325886" style="color: var(--electric-cyan); text-decoration: none;">631-732-5886</a> to ask about upcoming dates, or <a href="#" data-open-modal="true" style="color: var(--electric-cyan); text-decoration: none;">drop us a line</a> and we'll let you know when the next one's on the calendar.</p>
      </div>
    `;
  } else {
    container.innerHTML = upcoming.map((ev) => `
      <div class="showcase-event-card">
        <div class="showcase-event-date">${ev.dateDisplay}</div>
        ${ev.time ? `<div class="showcase-event-time">${ev.time}</div>` : ''}
        <div class="showcase-event-venue">${ev.venue}</div>
        <div class="showcase-event-type">${ev.type}</div>
        ${ev.note ? `<p class="showcase-event-note">${ev.note}</p>` : ''}
        ${ev.ticketUrl ? `<a class="showcase-event-tickets" href="${ev.ticketUrl}" target="_blank" rel="noopener">Get tickets &rarr;</a>` : ''}
      </div>
    `).join('');
  }

  // Past showcases — render into separate section, hide section if empty
  const pastSection = document.getElementById('showcase-past-section');
  const pastContainer = document.querySelector('[data-showcase-past]');
  if (!pastSection || !pastContainer) return;

  const past = data
    .filter((ev) => new Date(ev.date + 'T00:00:00') < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!past.length) {
    pastSection.hidden = true;
    return;
  }

  pastSection.hidden = false;
  pastContainer.innerHTML = past.map((ev) => `
    <div class="showcase-past-card">
      <div class="showcase-past-badge">Past</div>
      <div class="showcase-past-date">${ev.dateDisplay}</div>
      <div class="showcase-past-venue">${ev.venue}</div>
      <div class="showcase-past-type">${ev.type}</div>
    </div>
  `).join('');
}


/* Shuffle the showcase grid tiles into a fresh random order on each load.
   The HTML order stays the canonical "edit here" list — JS just reorders
   the rendered DOM, so adding/removing tiles in showcase.html still works. */
function shuffleShowcase() {
  document.querySelectorAll('.showcase-masonry').forEach((grid) => {
    const tiles = Array.from(grid.children);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    tiles.forEach((tile) => grid.appendChild(tile));
  });
}

/* --- Render: venue marquee --- */
function renderVenueMarquee() {
  document.querySelectorAll('[data-venue-marquee]').forEach((track) => {
    const shuffled = pickRandom(VENUE_POOL, VENUE_POOL.length);
    const spans = shuffled.map((name) => `<span>${name}</span>`).join('');
    track.innerHTML = spans + spans; /* duplicate for seamless loop */
    track.style.animationDuration = (shuffled.length * 4) + 's'; /* 4s per venue = same pace regardless of count */
  });
}


/* --- Render: homepage upcoming-showcase preview ---
   Conditional: hides the entire section if there are no upcoming events.
   Max 2 cards. Renders into [data-showcase-calendar-preview] on index.html. */
function renderShowcaseHomePreview() {
  const section = document.getElementById('home-showcase-preview-section');
  const container = document.querySelector('[data-showcase-calendar-preview]');
  if (!section || !container) return;

  const data = (typeof window !== 'undefined' && Array.isArray(window.SHOWCASES_DATA))
    ? window.SHOWCASES_DATA : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = data
    .filter((ev) => new Date(ev.date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (!upcoming.length) {
    section.hidden = true;
    return;
  }

  container.innerHTML = upcoming.map((ev) => `
    <div class="showcase-event-card showcase-event-card--light showcase-event-card--row">
      <div class="showcase-event-row-date">
        <div class="showcase-event-date">${ev.dateDisplay}</div>
        ${ev.time ? `<div class="showcase-event-time">${ev.time}</div>` : ''}
      </div>
      <div class="showcase-event-row-body">
        <div class="showcase-event-type">${ev.type}</div>
        <div class="showcase-event-venue">${ev.venue}</div>
        ${ev.note ? `<p class="showcase-event-note">${ev.note}</p>` : ''}
        ${ev.ticketUrl ? `<a class="showcase-event-tickets showcase-event-tickets--light" href="${ev.ticketUrl}" target="_blank" rel="noopener">Get tickets &rarr;</a>` : ''}
      </div>
    </div>
  `).join('');
}


/* --- "How did you hear about us?" → reveal a text field when "Other" is picked.
   Delegated on document so it works for the modal (loaded async) and the
   inline contact-page form alike. --- */
function setupReferralOther() {
  document.addEventListener('change', (e) => {
    const select = e.target;
    if (!select.matches || !select.matches('select[name="referral_source"]')) return;
    const form = select.closest('form');
    const wrap = form && form.querySelector('[data-referral-other]');
    if (!wrap) return;
    const input = wrap.querySelector('input');
    const show = select.value === 'Other';
    wrap.hidden = !show;
    if (input) {
      input.required = show;
      if (!show) input.value = '';
    }
  });
}


/* --- Boot --- */

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  setupNav();
  setupModal();
  setupLightbox();
  setupDocPreview();
  setupFooterYear();
  setupReferralOther();
  renderFeaturedTalent();
  renderTestimonial();
  renderShowcaseCalendar();
  renderShowcaseHomePreview();
  shuffleShowcase();
  renderVenueMarquee();
});
