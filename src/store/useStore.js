import { create } from 'zustand';
import { fetchTrendingNews, fetchCountryNews } from '../services/api';

const useStore = create((set, get) => ({
  // ── Globe state ──
  hoveredCountry: null,          // country under cursor right now
  pinnedCountry:  null,          // country whose news is shown in dashboard
  globeReady: false,

  // ── News state ──
  trendingNews:   [],            // global trending feed
  hoverNews:      [],            // news for hovered/pinned country
  breakingNews:   [],
  loadingTrending: false,
  loadingHover:    false,

  // ── UI ──
  activeCategory: 'general',
  searchQuery:    '',
  crisisAlerts:   [],

  // ── Setters ──
  setHoveredCountry: (country) => set({ hoveredCountry: country }),
  setGlobeReady:     (v)       => set({ globeReady: v }),
  setActiveCategory: (cat)     => set({ activeCategory: cat }),
  setSearchQuery:    (q)       => set({ searchQuery: q }),

  // ── When user hovers a country → fetch its news ──
  loadHoverNews: async (country) => {
    if (!country) {
      set({ pinnedCountry: null, hoverNews: [] });
      return;
    }
    // Don't re-fetch if same country
    if (get().pinnedCountry?.code === country.code) return;

    set({ pinnedCountry: country, loadingHover: true, hoverNews: [] });
    try {
      const articles = await fetchCountryNews(country.name);
      set({ hoverNews: articles, loadingHover: false });
    } catch {
      set({ hoverNews: [], loadingHover: false });
    }
  },

  clearHover: () => set({ pinnedCountry: null, hoverNews: [] }),

  // ── Load global trending news ──
  loadTrendingNews: async (category = 'general') => {
    set({ loadingTrending: true });
    try {
      const articles = await fetchTrendingNews(category);
      set({
        trendingNews:  articles,
        breakingNews:  articles.slice(0, 4),
        crisisAlerts:  articles.slice(0, 5).map((a) => a.title),
        loadingTrending: false,
      });
    } catch {
      set({ trendingNews: [], loadingTrending: false });
    }
  },

  // ── Search-bar select ──
  selectCountry: async (country) => {
    set({ pinnedCountry: country, loadingHover: true, hoverNews: [] });
    try {
      const articles = await fetchCountryNews(country.name);
      set({ hoverNews: articles, loadingHover: false });
    } catch {
      set({ hoverNews: [], loadingHover: false });
    }
  },
}));

export default useStore;
