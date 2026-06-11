// Web projesiyle birebir tema renkleri
export const colors = {
  bg: '#0a0a0f',
  bgDeep: '#05050e',
  card: '#12121a',
  cardAlt: '#0d0d18',
  surface: '#1a1a2e',
  border: '#1e1e2e',
  border2: '#2a2a3e',
  cyan: '#00d4ff',
  cyanDim: '#00a8cc',
  purple: '#a855f7',
  purple2: '#8b5cf6',
  amber: '#f59e0b',
  amberText: '#fbbf24',
  green: '#39ff14',
  red: '#ef4444',
  redText: '#f87171',
  white: '#ffffff',
  text: '#e5e7eb',
  textDim: '#9ca3af',
  textMute: '#6b7280',
  textFaint: '#555555',
};

export function scoreColor(s: number): string {
  return s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';
}

export function scoreLabel(s: number): string {
  return s >= 75 ? 'İyi' : s >= 50 ? 'Orta' : 'Zayıf';
}
