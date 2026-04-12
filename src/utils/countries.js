// Country data: name, ISO code, flag emoji, lat/lon, crisis level (1-5)
export const COUNTRIES = [
  { name: 'United States', code: 'US', flag: '🇺🇸', lat: 37.09, lon: -95.71, crisis: 2 },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', lat: 55.38, lon: -3.44, crisis: 1 },
  { name: 'China', code: 'CN', flag: '🇨🇳', lat: 35.86, lon: 104.19, crisis: 3 },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', lat: 61.52, lon: 105.32, crisis: 4 },
  { name: 'India', code: 'IN', flag: '🇮🇳', lat: 20.59, lon: 78.96, crisis: 2 },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', lat: -14.24, lon: -51.93, crisis: 3 },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', lat: 51.17, lon: 10.45, crisis: 1 },
  { name: 'France', code: 'FR', flag: '🇫🇷', lat: 46.23, lon: 2.21, crisis: 2 },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', lat: 36.20, lon: 138.25, crisis: 1 },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', lat: 35.91, lon: 127.77, crisis: 2 },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', lat: -25.27, lon: 133.78, crisis: 1 },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', lat: 56.13, lon: -106.35, crisis: 1 },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽', lat: 23.63, lon: -102.55, crisis: 3 },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', lat: -30.56, lon: 22.94, crisis: 3 },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', lat: 26.82, lon: 30.80, crisis: 3 },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', lat: 9.08, lon: 8.68, crisis: 4 },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦', lat: 48.38, lon: 31.17, crisis: 5 },
  { name: 'Israel', code: 'IL', flag: '🇮🇱', lat: 31.05, lon: 34.85, crisis: 5 },
  { name: 'Iran', code: 'IR', flag: '🇮🇷', lat: 32.43, lon: 53.69, crisis: 4 },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', lat: 23.89, lon: 45.08, crisis: 2 },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', lat: 38.96, lon: 35.24, crisis: 3 },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩', lat: -0.79, lon: 113.92, crisis: 2 },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰', lat: 30.38, lon: 69.35, crisis: 4 },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', lat: -38.42, lon: -63.62, crisis: 3 },
  { name: 'Venezuela', code: 'VE', flag: '🇻🇪', lat: 6.42, lon: -66.59, crisis: 5 },
  { name: 'North Korea', code: 'KP', flag: '🇰🇵', lat: 40.34, lon: 127.51, crisis: 5 },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', lat: 9.15, lon: 40.49, crisis: 4 },
  { name: 'Somalia', code: 'SO', flag: '🇸🇴', lat: 5.15, lon: 46.20, crisis: 5 },
  { name: 'Afghanistan', code: 'AF', flag: '🇦🇫', lat: 33.94, lon: 67.71, crisis: 5 },
  { name: 'Myanmar', code: 'MM', flag: '🇲🇲', lat: 21.92, lon: 95.96, crisis: 5 },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', lat: 40.46, lon: -3.75, crisis: 1 },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', lat: 41.87, lon: 12.57, crisis: 2 },
  { name: 'Poland', code: 'PL', flag: '🇵🇱', lat: 51.92, lon: 19.15, crisis: 2 },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', lat: 60.13, lon: 18.64, crisis: 1 },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', lat: 52.13, lon: 5.29, crisis: 1 },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', lat: 46.82, lon: 8.23, crisis: 1 },
];

// Convert lat/lon → 3D sphere coordinates
export function latLonToVector3(lat, lon, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

// Get crisis color by level
export function crisisColor(level) {
  const map = {
    1: '#22c55e',  // Safe — green
    2: '#84cc16',  // Low — lime
    3: '#f59e0b',  // Moderate — amber
    4: '#f97316',  // High — orange
    5: '#ef4444',  // Critical — red
  };
  return map[level] || '#6b7280';
}

// Crisis label
export function crisisLabel(level) {
  const map = { 1: 'Stable', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Critical' };
  return map[level] || 'Unknown';
}

// Search countries
export function searchCountries(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  ).slice(0, 6);
}
