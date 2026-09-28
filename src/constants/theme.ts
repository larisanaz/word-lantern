import type { TextStyle } from 'react-native';

/**
 * WordLantern theme — SPACE_COSMOS preset with brief-specific accent overrides
 * (lantern gold / signal blue / warm rose). The preset `name` stays untouched.
 */
export const THEME = {
  name: 'SPACE_COSMOS',

  bg: {
    deep: '#0C1022',
    base: '#151B33',
    surface: '#1E2547',
    sheet: '#262F5A',
  },
  accent: {
    gold: '#F4C95D',
    goldDark: '#E0A93C',
    blue: '#4D6CFA',
    rose: '#D96C75',
  },
  text: {
    primary: '#F7F3E8',
    secondary: '#B9BFD6',
    dim: '#7C85A6',
    onGold: '#151B33',
  },
  line: {
    hair: 'rgba(247,243,232,0.10)',
    hairSoft: 'rgba(247,243,232,0.06)',
    gold: 'rgba(244,201,93,0.30)',
    blue: 'rgba(77,108,250,0.35)',
  },
  fill: {
    glass: 'rgba(247,243,232,0.05)',
    glassHi: 'rgba(247,243,232,0.08)',
    gold: 'rgba(244,201,93,0.12)',
    blue: 'rgba(77,108,250,0.12)',
    rose: 'rgba(217,108,117,0.12)',
  },
};

/** Gradients kept as plain string[] so LinearGradient's prop types accept them. */
export const GRAD: { [k: string]: string[] } = {
  gold: ['#F4C95D', '#E0A93C'],
  goldSoft: ['rgba(244,201,93,0.28)', 'rgba(224,169,60,0.10)'],
  loader: ['rgba(8,11,26,0.92)', 'rgba(12,16,34,0.96)', 'rgba(4,6,16,0.98)'],
  menuArt: ['rgba(21,27,51,0.10)', 'rgba(21,27,51,0.55)'],
  sheet: ['rgba(30,37,71,0.94)', 'rgba(18,23,45,0.98)'],
  game: ['rgba(21,27,51,0.82)', 'rgba(12,16,34,0.90)'],
  ringPanel: ['rgba(18,23,45,0.75)', 'rgba(12,16,34,0.92)'],
  result: ['rgba(30,37,71,0.86)', 'rgba(21,27,51,0.92)', 'rgba(12,16,34,0.97)'],
  progress: ['#4D6CFA', '#F4C95D'],
};

/**
 * Tabular figures for every numeric readout. Typed through TextStyle so the
 * array stays mutable: `as const` would make it readonly and tsc rejects that.
 */
export const NUM: { fontVariant: TextStyle['fontVariant'] } = {
  fontVariant: ['tabular-nums'],
};

/** Gold glow used on lit lanterns and primary CTAs. */
export const GLOW = {
  shadowColor: '#F4C95D',
  shadowOpacity: 0.45,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 10,
};
