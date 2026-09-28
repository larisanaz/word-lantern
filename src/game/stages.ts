export type Stage = {
  /** Unique letters shown on the ring. */
  letters: string[];
  /** Hidden words, every one buildable from `letters` without reuse. */
  words: string[];
};

/**
 * Five trail stops. Each word was checked against its own letter pool: a letter
 * may be consumed at most as many times as it appears in `letters`.
 */
export const STAGES: Stage[] = [
  { letters: ['L', 'A', 'N', 'T', 'E', 'R'], words: ['TEN', 'EAR', 'RENT', 'LATER', 'ANTLER'] },
  { letters: ['G', 'L', 'O', 'W', 'I', 'N'], words: ['OWL', 'WIN', 'LION', 'WING', 'LOGIN'] },
  { letters: ['S', 'H', 'A', 'D', 'O', 'W'], words: ['HAS', 'SAD', 'DASH', 'WASH', 'SHADOW'] },
  { letters: ['F', 'L', 'A', 'M', 'E', 'S'], words: ['SEA', 'LAME', 'FAME', 'MEALS', 'FLAMES'] },
  { letters: ['C', 'A', 'N', 'D', 'L', 'E', 'S'], words: ['LACE', 'LAND', 'DANCE', 'SCALE', 'CANDLE'] },
];

export const STAGE_COUNT = STAGES.length;

export function getStage(index: number): Stage {
  const safe = ((index % STAGES.length) + STAGES.length) % STAGES.length;
  return STAGES[safe];
}
