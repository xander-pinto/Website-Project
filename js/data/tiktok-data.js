/* ============================================================
   Tommy's Tunes — TikTok library
   Source of truth for every TikTok clip we surface on the site.

   One clip can appear in several places. Tag it and the pages pick it up:
     people:   ['richie']        -> shows on /person/richie/
     services: ['co2-guns']      -> shows on /service/co2-guns/
   Both arrays can hold more than one slug, and a clip with empty arrays
   sits here unused until someone tags it.

   HOW TO ADD ONE: open the post on tiktok.com, copy the number at the end
   of the URL (.../video/7667019507885559053) into `id`, write a caption in
   our own voice rather than pasting the hashtags, then tag it.

   `views` is a snapshot for our own prioritising, not shown on the site.
   ============================================================ */

window.TIKTOK_DATA = [
  {
    id: '7667019507885559053',
    caption: 'A bride and groom who put Mario Kart on the ballroom screens.',
    views: '3.6M',
    people: [],
    services: ['weddings'],
    featured: true,
  },
  {
    id: '7673306294203337997',
    caption: 'Boys against girls, and the whole room sang along.',
    views: '186.3K',
    people: [],
    services: ['weddings'],
    featured: true,
  },
  {
    id: '7674399844835888397',
    caption: 'The transition people keep asking Rich about.',
    views: '19.4K',
    people: ['richie'],
    services: [],
  },
  {
    id: '7679454491388693774',
    caption: 'Rich reading the floor and going somewhere nobody expected.',
    views: '2977',
    people: ['richie'],
    services: [],
  },
  {
    id: '7681468205969198350',
    caption: 'Rich locking in behind the booth.',
    views: '1708',
    people: ['richie'],
    services: [],
  },
  {
    id: '7682079990120205582',
    caption: 'Smooth mix, no gap in the floor.',
    views: '832',
    people: ['richie'],
    services: [],
  },
  {
    id: '7679112687753694477',
    caption: 'Curtis walking a reception entrance in on the sax.',
    views: '603',
    people: ['curtis'],
    services: ['saxophonist'],
  },
  {
    id: '7672438145849298190',
    caption: 'A saxophone beat drop, played live over the set.',
    views: '786',
    people: [],
    services: ['saxophonist'],
  },
  {
    id: '7672110097790799118',
    caption: 'Sax over the dance floor, mid-reception.',
    views: '904',
    people: [],
    services: ['saxophonist'],
  },
  {
    id: '7678513362828856589',
    caption: 'A first dance on the cloud.',
    views: '555',
    people: [],
    services: ['dancing-on-cloud'],
  },
  {
    id: '7680700134480432397',
    caption: 'CO2 guns turning a reception into a nightclub.',
    views: '574',
    people: [],
    services: ['co2-guns'],
  },
  {
    id: '7680316321044647182',
    caption: 'The couple said the CO2 guns were worth it. They were.',
    views: '580',
    people: [],
    services: ['co2-guns'],
  },
  {
    id: '7678034411819994381',
    caption: 'Ending the night with a CO2 sendoff.',
    views: '484',
    people: [],
    services: ['co2-guns'],
  },
  {
    id: '7677633130005564686',
    caption: 'Introducing the new Mr. and Mrs.',
    views: '2852',
    people: [],
    services: ['weddings'],
  },
  {
    id: '7675475125017349389',
    caption: 'The groom picked her up and the room lost it.',
    views: '2875',
    people: [],
    services: ['weddings'],
  },
  {
    id: '7679212373550386446',
    caption: 'A bridal party that brought its own energy.',
    views: '623',
    people: [],
    services: ['weddings'],
  },

  /* --- Untagged. Real posts, no home yet. Add a slug to either array and
     they appear. The two mariachi clips have nowhere to go until there's a
     mariachi service page. --- */
  { id: '7674021866587131150', caption: 'MC Joe keeping the energy up.', views: '2128', people: [], services: [] },
  { id: '7673667987634785549', caption: 'I want to dance with somebody.', views: '1798', people: [], services: [] },
  { id: '7679861910795242765', caption: 'A mechanical bull at a wedding.', views: '1693', people: [], services: [] },
  { id: '7672900990466624782', caption: 'They sang the whole thing to each other.', views: '1070', people: [], services: [] },
  { id: '7675163306457369870', caption: 'A mariachi band through dinner.', views: '948', people: [], services: [] },
  { id: '7675860340965428493', caption: 'Mariachi following the couple through the room.', views: '777', people: [], services: [] },
  { id: '7676610460711439629', caption: 'A stick pony at a wedding.', views: '792', people: [], services: [] },
  { id: '7676245781547846926', caption: 'The helicopter on the dance floor.', views: '721', people: [], services: [] },
  { id: '7681109263342718221', caption: 'Two families becoming one.', views: '650', people: [], services: [] },
  { id: '7682571326908828941', caption: 'A last dance that looked like a film ending.', views: '646', people: [], services: [] },
  { id: '7681789440603262222', caption: 'A fairytale reception.', views: '642', people: [], services: [] },
  { id: '7678861314818624781', caption: 'A Guyanese family and a St. Lucian family becoming one.', views: '596', people: [], services: [] },
  { id: '7679552230566956302', caption: 'Who did it better.', views: '580', people: [], services: [] },
  { id: '7683163942545329421', caption: 'The DJ playing with everyone\'s feelings.', views: '536', people: [], services: [] },
  { id: '7680678676584893710', caption: 'Married on her birthday.', views: '505', people: [], services: [] },
  { id: '7678743474794941710', caption: 'Living out the popstar dream.', views: '486', people: [], services: [] },
  { id: '7678162374456626445', caption: 'Packed floor, all night.', views: '450', people: [], services: [] },
];
