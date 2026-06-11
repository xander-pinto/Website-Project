/* ============================================================
   Tommy's Tunes — testimonials data
   Single source of truth for:
     - the homepage testimonial rotation (js/main.js)
     - person-specific reviews on /person.html (js/detail-render.js)

   Each entry:
     quote       the review text (no surrounding quotes — added by render)
     talent      the named talent, as shown on the homepage rotation
     slugs       which team member(s) this review credits, by person.html slug.
                 A review can credit more than one person.
     event       event context (Wedding, Sweet 16, etc.)
     source      platform name
     source_url  link to the review (or the platform's Tommy's Tunes page)
     rating      star count (default 5)

   To show a review on a person's detail page, make sure that person's
   slug (from team-data.js) is listed in this review's `slugs` array.

   Verified source pages:
   - The Knot:     https://www.theknot.com/marketplace/tommys-tunes-dj-entertainment-selden-ny-209421
   - WeddingWire:  https://m.weddingwire.com/biz/tommys-tunes-selden-syosset/507ba584bfd4f3f3
   - Brides of LI: https://www.bridesofli.com/vendor/tommys-tunes/
   ============================================================ */

window.TESTIMONIALS_DATA = [
  {
    quote: "So attentive, kind, and genuinely cared that we were having the best time.",
    talent: 'MC Joe Cip.',
    slugs: ['joe-cip'],
    event: 'Wedding',
    source: 'The Knot',
    source_url: 'https://www.theknot.com/marketplace/tommys-tunes-dj-entertainment-selden-ny-209421',
    rating: 5,
  },
  {
    quote: "Kept the energy high and the dance floor full all night long.",
    talent: 'DJ/MC Dominick',
    slugs: ['dominick'],
    event: 'Wedding',
    source: 'The Knot',
    source_url: 'https://www.theknot.com/marketplace/tommys-tunes-dj-entertainment-selden-ny-209421',
    rating: 5,
  },
  {
    quote: "Energy never dipped for a second.",
    talent: 'DJ Johnny Munroe',
    slugs: ['johnny-munroe'],
    event: 'Wedding',
    source: 'WeddingWire',
    source_url: 'https://m.weddingwire.com/biz/tommys-tunes-selden-syosset/507ba584bfd4f3f3',
    rating: 5,
  },
  {
    quote: "Really nailed exactly the vibe we wanted.",
    talent: 'DJ/MC Anderson',
    slugs: ['anderson'],
    event: 'Wedding',
    source: 'The Knot',
    source_url: 'https://www.theknot.com/marketplace/tommys-tunes-dj-entertainment-selden-ny-209421',
    rating: 5,
  },
  {
    quote: "Really knows how to keep a dance floor going.",
    talent: 'DJ/MC Richie',
    slugs: ['richie'],
    event: 'Wedding',
    source: 'Brides of Long Island',
    source_url: 'https://www.bridesofli.com/vendor/tommys-tunes/',
    rating: 5,
  },
  {
    quote: "Executed the playlist perfectly.",
    talent: 'DJ/MC Ruben + MC Mike',
    slugs: ['ruben', 'mike'],
    event: 'Wedding',
    source: 'WeddingWire',
    source_url: 'https://m.weddingwire.com/biz/tommys-tunes-selden-syosset/507ba584bfd4f3f3',
    rating: 5,
  },
];
