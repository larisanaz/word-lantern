/** Can `word` be spelled from `letters` without using any letter twice? */
export function canBuild(word: string, letters: string[]): boolean {
  const pool = letters.slice();
  for (const ch of word) {
    const at = pool.indexOf(ch);
    if (at < 0) {
      return false;
    }
    pool.splice(at, 1);
  }
  return true;
}

export type WordVerdict = 'hit' | 'repeat' | 'miss';

/** Classify the player's current selection against the stage word list. */
export function checkWord(current: string, words: string[], found: string[]): WordVerdict {
  if (current.length < 3) {
    return 'miss';
  }
  if (found.indexOf(current) >= 0) {
    return 'repeat';
  }
  return words.indexOf(current) >= 0 ? 'hit' : 'miss';
}

/** Deterministic shuffle so a re-render never reorders the ring on its own. */
export function shuffled<T>(items: T[], seed: number): T[] {
  const out = items.slice();
  let s = (seed >>> 0) || 1;
  const rnd = () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}
