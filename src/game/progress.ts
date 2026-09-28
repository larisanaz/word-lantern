/**
 * Tiny in-memory progress singleton. No storage, no network — the value only
 * needs to survive screen switches inside one app session.
 */
type Progress = { best: number; totalWords: number; rounds: number };

const state: Progress = { best: 0, totalWords: 0, rounds: 0 };

export function readProgress(): Progress {
  return { best: state.best, totalWords: state.totalWords, rounds: state.rounds };
}

export function recordRound(score: number, words: number): Progress {
  state.rounds += 1;
  state.totalWords += words;
  if (score > state.best) {
    state.best = score;
  }
  return readProgress();
}
