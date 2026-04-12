import axios from 'axios';

const NEWS_API_KEY  = import.meta.env.VITE_NEWS_API_KEY  || '';
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY || '';

const NEWS_BASE  = 'https://newsapi.org/v2';
const GNEWS_BASE = 'https://gnews.io/api/v4';

// ── Trust score simulation ──
const generateTrustScore = (source) => {
  const trusted = [
    'bbc-news', 'reuters', 'associated-press', 'the-guardian-uk',
    'al-jazeera-english', 'bloomberg', 'the-washington-post', 'cnn',
    'bbc.co.uk', 'reuters.com', 'apnews.com',
  ];
  const name = source?.id || source?.name || '';
  if (trusted.some((t) => name.toLowerCase().includes(t))) return 85 + Math.floor(Math.random() * 15);
  if (name) return 55 + Math.floor(Math.random() * 25);
  return 30 + Math.floor(Math.random() * 30);
};

// ── Transform raw NewsAPI article ──
const transformNewsAPI = (article, index) => ({
  id: `n-${article.publishedAt}-${index}`,
  title:      article.title?.replace(' - ' + article.source?.name, '') || 'No title',
  summary:    article.description || article.content?.slice(0, 220) || '',
  source:     article.source?.name || 'Unknown',
  sourceId:   article.source?.id   || '',
  url:        article.url || '#',
  image:      article.urlToImage   || null,
  timestamp:  article.publishedAt  || new Date().toISOString(),
  trustScore: generateTrustScore(article.source),
  isBreaking: index < 2,
});

// ── Transform raw GNews article ──
const transformGNews = (article, index) => ({
  id: `g-${article.publishedAt}-${index}`,
  title:      article.title  || 'No title',
  summary:    article.description || '',
  source:     article.source?.name || 'Unknown',
  sourceId:   article.source?.url  || '',
  url:        article.url || '#',
  image:      article.image || null,
  timestamp:  article.publishedAt || new Date().toISOString(),
  trustScore: generateTrustScore(article.source),
  isBreaking: index < 2,
});

/* ──────────────────────────────────────────────────────────
   MOCK DATA — uses real Unsplash images so cards always
   look great even when no API key is configured
────────────────────────────────────────────────────────── */
const MOCK_ARTICLES = [
  {
    id: 'm1',
    title: 'Global Climate Summit Reaches Historic Agreement on Emissions',
    summary: 'World leaders have signed a landmark accord pledging to reduce carbon emissions by 50% before 2035, marking the most significant climate deal in a decade.',
    source: 'Reuters', url: 'https://reuters.com',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    trustScore: 92, isBreaking: true,
  },
  {
    id: 'm2',
    title: 'AI Regulation Framework Proposed by G7 Nations',
    summary: 'The G7 has unveiled a comprehensive framework for governing artificial intelligence, establishing safety benchmarks and transparency requirements.',
    source: 'BBC News', url: 'https://bbc.com',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    trustScore: 88, isBreaking: true,
  },
  {
    id: 'm3',
    title: 'Central Banks Signal Rate Cuts Amid Global Economic Slowdown',
    summary: 'Federal Reserve and ECB officials hinted at potential interest rate reductions as global growth forecasts are revised downward across major economies.',
    source: 'Bloomberg', url: 'https://bloomberg.com',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    trustScore: 85, isBreaking: false,
  },
  {
    id: 'm4',
    title: 'Earthquake Strikes Southeast Asia — Aid Response Mobilized',
    summary: 'A magnitude 6.8 earthquake hit the region early this morning. International relief organizations have begun mobilizing resources as rescue operations intensify.',
    source: 'AP News', url: 'https://apnews.com',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    trustScore: 90, isBreaking: true,
  },
  {
    id: 'm5',
    title: 'Tech Giants Under Scrutiny Over Data Privacy Practices',
    summary: 'Regulatory bodies in the EU and US are jointly investigating major technology firms for alleged violations of consumer data protection laws.',
    source: 'The Guardian', url: 'https://theguardian.com',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    trustScore: 78, isBreaking: false,
  },
  {
    id: 'm6',
    title: 'NASA Confirms Discovery of Water Ice on Mars Surface',
    summary: 'Scientists confirm the discovery of significant water ice deposits near the Martian equator, raising new possibilities for future crewed missions to the red planet.',
    source: 'NASA/JPL', url: 'https://nasa.gov',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    trustScore: 95, isBreaking: false,
  },
  {
    id: 'm7',
    title: 'Unverified Reports Claim Ceasefire Negotiations Underway',
    summary: 'Social media posts circulating images of alleged peace talks have not been confirmed by any official government or accredited news agency.',
    source: 'Unknown Blog', url: '#',
    image: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    trustScore: 28, isBreaking: false,
  },
  {
    id: 'm8',
    title: 'Supply Chain Disruptions Persist in Semiconductor Sector',
    summary: 'Global chip manufacturers are warning of continued component shortages that could delay consumer electronics production well into the next quarter.',
    source: 'Financial Times', url: 'https://ft.com',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    trustScore: 82, isBreaking: false,
  },
  {
    id: 'm9',
    title: 'Viral Misinformation Spreads About Alleged Government Documents',
    summary: 'Fact-checkers have debunked a series of fabricated government documents circulating on social networks claiming widespread surveillance programs.',
    source: 'Fact-Check Agency', url: '#',
    image: 'https://images.unsplash.com/photo-1432821579888-96dde3c26d2c?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    trustScore: 20, isBreaking: false,
  },
  {
    id: 'm10',
    title: 'WHO Raises Alert Level for Novel Respiratory Pathogen',
    summary: 'The World Health Organization has elevated its alert classification for a newly identified respiratory illness detected across multiple countries simultaneously.',
    source: 'WHO', url: 'https://who.int',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    trustScore: 91, isBreaking: true,
  },
  {
    id: 'm11',
    title: 'Renewable Energy Investment Hits Record $1.8 Trillion Globally',
    summary: 'Global investment in clean energy reached an all-time high, with solar and wind power driving the majority of new capacity additions world-wide.',
    source: 'The Economist', url: 'https://economist.com',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    trustScore: 87, isBreaking: false,
  },
  {
    id: 'm12',
    title: 'Cybersecurity Breach Exposes 200 Million Records Worldwide',
    summary: 'A sophisticated cyber attack targeting cloud infrastructure has exposed personal data of millions. Security researchers have linked the breach to a state-sponsored group.',
    source: 'Wired', url: 'https://wired.com',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    trustScore: 76, isBreaking: false,
  },
];

/* Country-specific image pools for vivid mock cards */
const COUNTRY_IMAGES = {
  default: [
    'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&q=80',
    'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=600&q=80',
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80',
    'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=600&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
  ],
  'United States': [
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80',
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&q=80',
    'https://images.unsplash.com/photo-1596122787821-95e76c7f27ec?w=600&q=80',
  ],
  'United Kingdom': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&q=80',
  ],
  'China': [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
    'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?w=600&q=80',
  ],
  'India': [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
  ],
  'Russia': [
    'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600&q=80',
    'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=600&q=80',
  ],
  'France': [
    'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  ],
  'Germany': [
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
  ],
  'Japan': [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
  ],
  'Brazil': [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80',
    'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600&q=80',
  ],
  'Ukraine': [
    'https://images.unsplash.com/photo-1581360742512-021d5b2157d8?w=600&q=80',
  ],
  'Israel': [
    'https://images.unsplash.com/photo-1544140708-514b7837e6b5?w=600&q=80',
  ],
};

function getCountryImages(country) {
  return COUNTRY_IMAGES[country] || COUNTRY_IMAGES.default;
}

const MOCK_COUNTRY_ARTICLES = (country) => {
  const imgs = getCountryImages(country);
  const pick = (i) => imgs[i % imgs.length];
  return [
    {
      id: `l1-${country}`,
      title: `Political Developments in ${country} Attract International Attention`,
      summary: `Government officials in ${country} announced sweeping policy changes amid growing public debate. International observers are closely monitoring the situation for stability indicators.`,
      source: 'Reuters', url: 'https://reuters.com',
      image: pick(0),
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      trustScore: 88, isBreaking: false,
    },
    {
      id: `l2-${country}`,
      title: `${country} Economy Posts Strong Growth in Latest Quarter`,
      summary: `GDP data from ${country} showed unexpected 3.2% growth, outperforming analyst forecasts. Central bank attributes gains to export sector expansion and consumer spending.`,
      source: 'Bloomberg', url: 'https://bloomberg.com',
      image: pick(1),
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      trustScore: 84, isBreaking: false,
    },
    {
      id: `l3-${country}`,
      title: `Infrastructure Projects Reshape ${country}'s Urban Landscape`,
      summary: `Major investment in transportation and smart city infrastructure is transforming urban centers across ${country}, with projects totaling over $40 billion in committed funding.`,
      source: 'AP News', url: 'https://apnews.com',
      image: pick(2),
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      trustScore: 79, isBreaking: false,
    },
    {
      id: `l4-${country}`,
      title: `Environmental Crisis Deepens in ${country}'s Northern Region`,
      summary: `Droughts have severely impacted agricultural output in northern ${country}. Aid organizations are calling for emergency humanitarian support and water management reform.`,
      source: 'The Guardian', url: 'https://theguardian.com',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      trustScore: 86, isBreaking: true,
    },
    {
      id: `l5-${country}`,
      title: `${country} Signs New Trade Agreement with Regional Partners`,
      summary: `A new bilateral trade deal will reduce tariffs between ${country} and its neighbors, streamlining goods flow and strengthening regional economic ties significantly.`,
      source: 'Financial Times', url: 'https://ft.com',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      trustScore: 90, isBreaking: false,
    },
    {
      id: `l6-${country}`,
      title: `Technology Sector Drives Innovation Wave in ${country}`,
      summary: `Startups and established tech firms in ${country} are leading a wave of digital transformation, with AI and clean energy emerging as key growth drivers this year.`,
      source: 'Wired', url: 'https://wired.com',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
      timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
      trustScore: 81, isBreaking: false,
    },
  ];
};

/* ──────────────────────────────────────────────────────────
   API CALLS — tries GNews → NewsAPI → mock fallback
────────────────────────────────────────────────────────── */

// ── GNews: free tier, 100 req/day, returns images consistently ──
async function fetchGNewsTrending(category = 'general') {
  const lang = 'en';
  const res = await axios.get(`${GNEWS_BASE}/top-headlines`, {
    params: { category, lang, max: 20, apikey: GNEWS_API_KEY },
    timeout: 8000,
  });
  return (res.data.articles || []).map(transformGNews).filter((a) => a.title !== '[Removed]');
}

async function fetchGNewsCountry(countryName) {
  const res = await axios.get(`${GNEWS_BASE}/search`, {
    params: { q: countryName, lang: 'en', sortby: 'publishedAt', max: 10, apikey: GNEWS_API_KEY },
    timeout: 8000,
  });
  return (res.data.articles || []).map(transformGNews).filter((a) => a.title !== '[Removed]');
}

// ── NewsAPI ──
async function fetchNewsAPITrending(category = 'general') {
  const res = await axios.get(`${NEWS_BASE}/top-headlines`, {
    params: { category, language: 'en', pageSize: 20, apiKey: NEWS_API_KEY },
    timeout: 8000,
  });
  return (res.data.articles || []).map(transformNewsAPI).filter((a) => a.title !== '[Removed]');
}

async function fetchNewsAPICountry(countryName) {
  const res = await axios.get(`${NEWS_BASE}/everything`, {
    params: { q: countryName, language: 'en', sortBy: 'publishedAt', pageSize: 15, apiKey: NEWS_API_KEY },
    timeout: 8000,
  });
  return (res.data.articles || []).map(transformNewsAPI).filter((a) => a.title !== '[Removed]');
}

/* ──────────────────────────────────────────────────────────
   PUBLIC EXPORTS
────────────────────────────────────────────────────────── */

export async function fetchTrendingNews(category = 'general') {
  // 1. Try GNews
  if (GNEWS_API_KEY) {
    try { return await fetchGNewsTrending(category); }
    catch (e) { console.warn('GNews trending failed:', e.message); }
  }

  // 2. Try NewsAPI
  if (NEWS_API_KEY) {
    try { return await fetchNewsAPITrending(category); }
    catch (e) { console.warn('NewsAPI trending failed:', e.message); }
  }

  // 3. Mock fallback (with real images)
  await new Promise((r) => setTimeout(r, 600));
  return [...MOCK_ARTICLES].sort(() => Math.random() - 0.5);
}

export async function fetchCountryNews(countryName) {
  // 1. Try GNews
  if (GNEWS_API_KEY) {
    try {
      const articles = await fetchGNewsCountry(countryName);
      if (articles.length > 0) return articles;
    } catch (e) { console.warn('GNews country failed:', e.message); }
  }

  // 2. Try NewsAPI
  if (NEWS_API_KEY) {
    try {
      const articles = await fetchNewsAPICountry(countryName);
      if (articles.length > 0) return articles;
    } catch (e) { console.warn('NewsAPI country failed:', e.message); }
  }

  // 3. Mock fallback (with country-specific images)
  await new Promise((r) => setTimeout(r, 800));
  return MOCK_COUNTRY_ARTICLES(countryName);
}
