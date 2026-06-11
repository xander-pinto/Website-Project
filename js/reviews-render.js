/* ============================================================
   Tommy's Tunes, reviews page renderer
   Powers /reviews.html. Reads from window.REVIEWS_DATA.
   Filter by event type + source, paginate 20 at a time.
   ============================================================ */

(function () {
  const PAGE_SIZE = 20;
  let visible = PAGE_SIZE;
  let currentEvent = 'all';
  let currentSource = 'all';

  const SOURCE_URLS = {
    'The Knot': 'https://www.theknot.com/marketplace/tommys-tunes-dj-entertainment-selden-ny-209421',
    'WeddingWire': 'https://m.weddingwire.com/biz/tommys-tunes-selden-syosset/507ba584bfd4f3f3',
    'Google': 'https://www.google.com/search?q=Tommy%27s+Tunes+DJ+Entertainment+Selden+NY',
    'Yelp': 'https://www.yelp.com/search?find_desc=Tommy%27s+Tunes+DJ&find_loc=Selden%2C+NY',
  };

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const EVENT_LABELS = {
    'wedding': 'Wedding',
    'sweet 16': 'Sweet 16',
    'mitzvah': 'Mitzvah',
    'corporate': 'Corporate',
    'communion': 'Communion',
    'birthday': 'Birthday',
    'bridal shower': 'Bridal shower',
    'other': 'Other event',
  };

  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function shortName(full) {
    const parts = (full || '').trim().split(/\s+/);
    if (!parts[0]) return '';
    if (parts.length === 1) return parts[0];
    return parts[0] + ' ' + parts[parts.length - 1][0] + '.';
  }

  function formatDate(yyyymm) {
    if (!yyyymm) return '';
    const [y, m] = yyyymm.split('-');
    const mi = parseInt(m, 10) - 1;
    return MONTHS[mi] ? `${MONTHS[mi]} ${y}` : yyyymm;
  }

  function formatEvent(et) {
    if (!et) return '';
    return EVENT_LABELS[et] || (et.charAt(0).toUpperCase() + et.slice(1));
  }

  function getFiltered() {
    const all = Array.isArray(window.REVIEWS_DATA) ? window.REVIEWS_DATA : [];
    return all.filter((r) => {
      if (currentEvent !== 'all') {
        if (currentEvent === 'other') {
          if (r.event_type === 'wedding' || r.event_type === 'sweet 16') return false;
        } else if (r.event_type !== currentEvent) {
          return false;
        }
      }
      if (currentSource !== 'all' && r.source !== currentSource) return false;
      return true;
    });
  }

  function renderCard(r) {
    const stars = '★'.repeat(r.rating || 5);
    const djs = (r.named_djs || []).filter(Boolean);
    const djLine = djs.length ? `<div class="review-talent">with ${escapeHTML(djs.join(' + '))}</div>` : '';
    const sourceUrl = SOURCE_URLS[r.source] || '#';
    return `
      <article class="review-card">
        <div class="review-stars" aria-label="${r.rating || 5} out of 5 stars">${stars}</div>
        <p class="review-quote">${escapeHTML(r.review_text)}</p>
        <div class="review-meta">
          <div class="review-byline">
            <strong>${escapeHTML(shortName(r.name))}</strong>
            <span> · ${escapeHTML(formatEvent(r.event_type))}</span>
            ${r.date ? `<span> · ${escapeHTML(formatDate(r.date))}</span>` : ''}
          </div>
          ${djLine}
          <a href="${escapeHTML(sourceUrl)}" class="review-source" target="_blank" rel="noopener">Verified on ${escapeHTML(r.source)} →</a>
        </div>
      </article>
    `;
  }

  function render() {
    const grid = document.querySelector('[data-reviews-grid]');
    if (!grid) return;
    const filtered = getFiltered();
    const slice = filtered.slice(0, visible);
    grid.innerHTML = slice.map(renderCard).join('');

    const counter = document.querySelector('[data-reviews-counter]');
    if (counter) {
      counter.textContent = filtered.length
        ? `Showing ${slice.length} of ${filtered.length}`
        : 'No reviews match these filters yet.';
    }

    const btn = document.querySelector('[data-load-more]');
    if (btn) btn.hidden = slice.length >= filtered.length;
  }

  function activate(group, value) {
    document.querySelectorAll(`[data-filter-${group}]`).forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute(`data-filter-${group}`) === value);
    });
  }

  function setupFilters() {
    document.querySelectorAll('[data-filter-event]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentEvent = btn.getAttribute('data-filter-event');
        activate('event', currentEvent);
        visible = PAGE_SIZE;
        render();
      });
    });
    document.querySelectorAll('[data-filter-source]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentSource = btn.getAttribute('data-filter-source');
        activate('source', currentSource);
        visible = PAGE_SIZE;
        render();
      });
    });
    document.querySelectorAll('[data-load-more]').forEach((btn) => {
      btn.addEventListener('click', () => {
        visible += PAGE_SIZE;
        render();
      });
    });
  }

  function boot() {
    setupFilters();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
