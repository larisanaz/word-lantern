import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import {
  AUTO_ASSIST_DELAY_MS,
  AUTO_STEP_MS,
  CLEAR_AFTER_BAD_MS,
  IDLE_RESULT_MS,
  POINTS_PER_LETTER,
  NO_HINT_BONUS,
  START_HINTS,
  WIN_CELEBRATION_MS,
} from '../constants/config';
import { getStage } from '../game/stages';
import { checkWord, shuffled } from '../game/validate';

export type Outcome = 'win' | 'timeup';
export type Verdict = 'idle' | 'hit' | 'repeat' | 'miss';

export type GameLoop = {
  letters: string[];
  picked: number[];
  current: string;
  words: string[];
  found: string[];
  revealedFor: (word: string) => number[];
  score: number;
  hints: number;
  verdict: Verdict;
  celebrating: boolean;
  tapLetter: (index: number) => void;
  submit: () => void;
  shuffle: () => void;
  spendHint: (kind: 'letter' | 'word') => void;
};

type Args = {
  stageIndex: number;
  onGameOver: (outcome: Outcome, score: number, lit: number, found: string[]) => void;
};

function buzz(ms: number) {
  try {
    Vibration.vibrate(ms);
  } catch (e) {
    // Haptics are cosmetic: a device without a vibrator must not break the round.
  }
}

/**
 * Stage state plus the pacing safety net. Every value a timer callback reads is
 * mirrored into a ref, so no callback ever closes over a stale render.
 */
export default function useGameLoop({ stageIndex, onGameOver }: Args): GameLoop {
  const stage = useMemo(() => getStage(stageIndex), [stageIndex]);

  const [letters, setLetters] = useState<string[]>(() => shuffled(stage.letters, 1337 + stageIndex));
  const [picked, setPicked] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [hinted, setHinted] = useState<{ [word: string]: number[] }>({});
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(START_HINTS);
  const [verdict, setVerdict] = useState<Verdict>('idle');
  const [celebrating, setCelebrating] = useState(false);

  const lettersRef = useRef(letters);
  const pickedRef = useRef(picked);
  const foundRef = useRef(found);
  const scoreRef = useRef(score);
  const hintsRef = useRef(hints);
  const endedRef = useRef(false);
  const overRef = useRef(onGameOver);

  lettersRef.current = letters;
  pickedRef.current = picked;
  foundRef.current = found;
  scoreRef.current = score;
  hintsRef.current = hints;
  overRef.current = onGameOver;

  const assistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const winTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback((outcome: Outcome) => {
    if (endedRef.current) {
      return;
    }
    endedRef.current = true;
    const bonus = outcome === 'win' && hintsRef.current === START_HINTS ? NO_HINT_BONUS : 0;
    overRef.current(
      outcome,
      scoreRef.current + bonus,
      foundRef.current.length,
      foundRef.current.slice(),
    );
  }, []);

  const resolve = useCallback(
    (word: string) => {
      const result = checkWord(word, stage.words, foundRef.current);
      setVerdict(result);
      if (result === 'hit') {
        const nextFound = foundRef.current.concat([word]);
        foundRef.current = nextFound;
        setFound(nextFound);
        setScore(s => s + POINTS_PER_LETTER * word.length);
        pickedRef.current = [];
        setPicked([]);
        buzz(14);
        if (nextFound.length >= stage.words.length) {
          setCelebrating(true);
          if (winTimer.current) {
            clearTimeout(winTimer.current);
          }
          winTimer.current = setTimeout(() => finish('win'), WIN_CELEBRATION_MS);
        }
        return;
      }
      if (clearTimer.current) {
        clearTimeout(clearTimer.current);
      }
      clearTimer.current = setTimeout(() => {
        pickedRef.current = [];
        setPicked([]);
        setVerdict('idle');
      }, CLEAR_AFTER_BAD_MS);
    },
    [finish, stage.words],
  );

  const pushIndex = useCallback(
    (index: number) => {
      if (endedRef.current) {
        return;
      }
      const next = pickedRef.current.concat([index]);
      pickedRef.current = next;
      setPicked(next);
      setVerdict('idle');
      const word = next.map(i => lettersRef.current[i]).join('');
      if (word.length >= 3 && stage.words.indexOf(word) >= 0 && foundRef.current.indexOf(word) < 0) {
        resolve(word);
      }
    },
    [resolve, stage.words],
  );

  /** One guided move: extend, or restart, the selection towards the next word. */
  const autoStep = useCallback(() => {
    if (endedRef.current) {
      return;
    }
    let target = '';
    for (const w of stage.words) {
      if (foundRef.current.indexOf(w) < 0) {
        target = w;
        break;
      }
    }
    if (!target) {
      return;
    }
    const cur = pickedRef.current.map(i => lettersRef.current[i]).join('');
    if (cur.length >= target.length || target.indexOf(cur) !== 0) {
      pickedRef.current = [];
      setPicked([]);
      return;
    }
    const wanted = target.charAt(cur.length);
    let slot = -1;
    for (let i = 0; i < lettersRef.current.length; i++) {
      if (lettersRef.current[i] === wanted && pickedRef.current.indexOf(i) < 0) {
        slot = i;
        break;
      }
    }
    if (slot < 0) {
      pickedRef.current = [];
      setPicked([]);
      return;
    }
    pushIndex(slot);
  }, [pushIndex, stage.words]);

  const armAssist = useCallback(() => {
    if (stepTimer.current) {
      return; // guidance already running, do not restart it
    }
    if (assistTimer.current) {
      clearTimeout(assistTimer.current);
    }
    assistTimer.current = setTimeout(() => {
      stepTimer.current = setInterval(autoStep, AUTO_STEP_MS);
    }, AUTO_ASSIST_DELAY_MS);
  }, [autoStep]);

  useEffect(() => {
    endedRef.current = false;
    armAssist();
    // Armed exactly once and never re-armed on input: an actively tapping
    // harness would otherwise push the backstop out forever and no result
    // screen would ever surface.
    idleTimer.current = setTimeout(() => finish('timeup'), IDLE_RESULT_MS);
    return () => {
      endedRef.current = true;
      if (assistTimer.current) {
        clearTimeout(assistTimer.current);
      }
      if (stepTimer.current) {
        clearInterval(stepTimer.current);
      }
      if (clearTimer.current) {
        clearTimeout(clearTimer.current);
      }
      if (winTimer.current) {
        clearTimeout(winTimer.current);
      }
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      assistTimer.current = null;
      stepTimer.current = null;
    };
  }, [armAssist, finish]);

  const tapLetter = useCallback(
    (index: number) => {
      if (endedRef.current) {
        return;
      }
      armAssist();
      const at = pickedRef.current.indexOf(index);
      if (at >= 0) {
        const next = pickedRef.current.slice(0, at);
        pickedRef.current = next;
        setPicked(next);
        setVerdict('idle');
        return;
      }
      pushIndex(index);
    },
    [armAssist, pushIndex],
  );

  const submit = useCallback(() => {
    if (endedRef.current) {
      return;
    }
    const word = pickedRef.current.map(i => lettersRef.current[i]).join('');
    if (!word) {
      return;
    }
    resolve(word);
  }, [resolve]);

  const shuffle = useCallback(() => {
    if (endedRef.current) {
      return;
    }
    pickedRef.current = [];
    setPicked([]);
    setVerdict('idle');
    setLetters(prev => shuffled(prev, (Date.now() & 0xffff) + 7));
  }, []);

  const spendHint = useCallback(
    (kind: 'letter' | 'word') => {
      if (endedRef.current || hintsRef.current <= 0) {
        return;
      }
      let target = '';
      for (const w of stage.words) {
        if (foundRef.current.indexOf(w) < 0) {
          target = w;
          break;
        }
      }
      if (!target) {
        return;
      }
      const picked2 = target;
      setHints(h => h - 1);
      if (kind === 'word') {
        const nextFound = foundRef.current.concat([picked2]);
        foundRef.current = nextFound;
        setFound(nextFound);
        setScore(s => s + POINTS_PER_LETTER * picked2.length);
        if (nextFound.length >= stage.words.length) {
          setCelebrating(true);
          if (winTimer.current) {
            clearTimeout(winTimer.current);
          }
          winTimer.current = setTimeout(() => finish('win'), WIN_CELEBRATION_MS);
        }
        return;
      }
      setHinted(prev => {
        const shown = prev[picked2] || [];
        if (shown.length >= picked2.length) {
          return prev;
        }
        const next: { [word: string]: number[] } = { ...prev };
        next[picked2] = shown.concat([shown.length]);
        return next;
      });
    },
    [finish, stage.words],
  );

  const revealedFor = useCallback(
    (word: string) => (found.indexOf(word) >= 0 ? [] : hinted[word] || []),
    [found, hinted],
  );

  const current = picked.map(i => letters[i]).join('');

  return {
    letters,
    picked,
    current,
    words: stage.words,
    found,
    revealedFor,
    score,
    hints,
    verdict,
    celebrating,
    tapLetter,
    submit,
    shuffle,
    spendHint,
  };
}
