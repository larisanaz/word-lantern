/**
 * WordLantern — relaxed word-link puzzle.
 * Plain state-machine navigation (no react-navigation): exactly one screen is
 * mounted at a time and the switch happens immediately, never behind a fade
 * callback, so the capture harness always photographs the new screen.
 */
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import { Outcome } from './src/hooks/useGameLoop';
import { useBackGuard } from './src/hooks/useBackGuard';
import { recordRound } from './src/game/progress';
import { STAGE_COUNT } from './src/game/stages';
import { WORDS_PER_STAGE } from './src/constants/config';
import { THEME } from './src/constants/theme';

type Screen = 'loader' | 'menu' | 'game' | 'result';

type Round = {
  outcome: Outcome;
  score: number;
  lit: number;
  found: string[];
};

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [stageIndex, setStageIndex] = useState(0);
  const [best, setBest] = useState(0);
  const [words, setWords] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [runKey, setRunKey] = useState(0);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startRound = useCallback(() => {
    setRunKey(k => k + 1);
    setRound(null);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback(
    (outcome: Outcome, score: number, lit: number, found: string[]) => {
      const next = recordRound(score, lit);
      setBest(next.best);
      setWords(next.totalWords);
      setRound({ outcome, score, lit, found });
      setStageIndex(i => (i + 1) % STAGE_COUNT);
      setScreen('result');
    },
    [],
  );

  useBackGuard(screen, goMenu);

  let content: React.ReactNode = null;
  if (screen === 'loader') {
    content = <LoaderScreen onDone={goMenu} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        best={best}
        words={words}
        night={(stageIndex % STAGE_COUNT) + 1}
        onPlay={startRound}
      />
    );
  } else if (screen === 'game') {
    content = (
      <GameScreen
        key={runKey}
        stageIndex={stageIndex}
        onGameOver={handleGameOver}
        onBack={goMenu}
      />
    );
  } else {
    content = (
      <ResultScreen
        outcome={round ? round.outcome : 'timeup'}
        score={round ? round.score : 0}
        lit={round ? round.lit : 0}
        total={WORDS_PER_STAGE}
        foundWords={round ? round.found : []}
        best={best}
        onPlayAgain={startRound}
        onMenu={goMenu}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.bg.base },
});
