import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Flame, Lightbulb, Shuffle, Star } from 'lucide-react-native';
import AuroraBackdrop from '../components/AuroraBackdrop';
import ScreenHeader from '../components/ScreenHeader';
import StatChip from '../components/StatChip';
import SecondaryButton from '../components/SecondaryButton';
import WordRow from '../components/WordRow';
import LetterRing from '../components/LetterRing';
import HintShelf from '../components/HintShelf';
import useGameLoop, { Outcome } from '../hooks/useGameLoop';
import { bgGame } from '../assets';
import { STAGE_COUNT } from '../game/stages';
import {
  BOARD_BORDER,
  BOARD_PAD,
  BOARD_W,
  RING_PANEL_H,
  SHAKE_MS,
  STAT_STRIP_H,
  TILE,
  TILE_GAP,
} from '../constants/config';
import { GRAD, NUM, THEME } from '../constants/theme';

type Props = {
  stageIndex: number;
  onGameOver: (outcome: Outcome, score: number, lit: number, found: string[]) => void;
  onBack: () => void;
};

/** Split-panel puzzle board: word grid on top, letter ring in the bottom panel. */
export default function GameScreen({ stageIndex, onGameOver, onBack }: Props) {
  const game = useGameLoop({ stageIndex, onGameOver });
  const [shelf, setShelf] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [enter]);

  useEffect(() => {
    if (game.verdict !== 'miss') {
      return;
    }
    const q = SHAKE_MS / 4;
    Animated.sequence([
      Animated.timing(shake, { toValue: 8, duration: q, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: q, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 5, duration: q, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: q, useNativeDriver: true }),
    ]).start();
  }, [game.verdict, shake]);

  useEffect(() => {
    if (!game.celebrating) {
      return;
    }
    Animated.sequence([
      Animated.timing(flash, { toValue: 0.18, duration: 260, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 440, useNativeDriver: true }),
    ]).start();
  }, [flash, game.celebrating]);

  const pickHint = useCallback(
    (kind: 'letter' | 'word') => {
      game.spendHint(kind);
      setShelf(false);
    },
    [game],
  );

  const lit = game.found.length;
  const total = game.words.length;
  const currentColor =
    game.verdict === 'miss'
      ? THEME.accent.rose
      : game.current.length >= 3
      ? THEME.accent.gold
      : THEME.text.primary;

  return (
    <View style={styles.root}>
      <ImageBackground source={bgGame} resizeMode="cover" style={styles.bg}>
        <LinearGradient colors={GRAD.game} style={StyleSheet.absoluteFill} />
        <AuroraBackdrop variant="game" />

        <ScreenHeader title={`STAGE ${(stageIndex % STAGE_COUNT) + 1} / ${STAGE_COUNT}`}
          progress={total ? lit / total : 0}
          onBack={onBack}
          right={
            <View style={styles.headPill}>
              <Flame size={16} color={THEME.accent.gold} strokeWidth={2.4} />
              <Text style={styles.headPillText}>
                {lit}/{total}
              </Text>
            </View>
          }
        />

        <Animated.View pointerEvents="box-none" style={[styles.area, { opacity: enter }]}>
          <Animated.Text
            style={[styles.current, { color: currentColor, transform: [{ translateX: shake }] }]}
            numberOfLines={1}>
            {game.current || '. . .'}
          </Animated.Text>

          <View style={styles.board}>
            {game.words.map(w => (
              <WordRow
                key={w}
                word={w}
                solved={game.found.indexOf(w) >= 0}
                revealed={game.revealedFor(w)}
                tile={TILE}
              />
            ))}
          </View>

          {lit === 0 ? <Text style={styles.tip}>TAP LETTERS TO BUILD A WORD</Text> : null}
        </Animated.View>

        <View style={styles.strip}>
          <StatChip Icon={Lightbulb} value={game.hints} label="HINTS" color={THEME.accent.blue} />
          <StatChip Icon={Flame} value={lit} label="LIT" color={THEME.accent.gold} />
          <StatChip Icon={Star} value={game.score} label="GLOW" color={THEME.accent.rose} />
        </View>

        <LinearGradient colors={GRAD.ringPanel} style={styles.panel}>
          <LetterRing
            letters={game.letters}
            used={game.picked}
            onLetter={game.tapLetter}
            onSubmit={game.submit}
          />
          <View style={styles.panelActions}>
            <SecondaryButton
              label="HINT"
              Icon={Lightbulb}
              tint={THEME.accent.blue}
              disabled={game.hints <= 0}
              stretch
              onPress={() => setShelf(true)}
            />
            <SecondaryButton
              label="SHUFFLE"
              Icon={Shuffle}
              tint={THEME.text.secondary}
              stretch
              onPress={game.shuffle}
            />
          </View>
        </LinearGradient>

        <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flash }]} />
      </ImageBackground>

      <HintShelf visible={shelf} hints={game.hints} onPick={pickHint} onClose={() => setShelf(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.bg.base },
  bg: { flex: 1 },
  headPill: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244,201,93,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244,201,93,0.30)',
  },
  headPillText: {
    ...NUM,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: THEME.accent.gold,
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  current: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: 6,
    marginBottom: 12,
  },
  board: {
    width: BOARD_W,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderRadius: 24,
    borderColor: 'rgba(247,243,232,0.10)',
    backgroundColor: 'rgba(30,37,71,0.55)',
    gap: TILE_GAP,
  },
  tip: {
    marginTop: 12,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.dim,
  },
  strip: {
    height: STAT_STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  panel: {
    height: RING_PANEL_H,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(247,243,232,0.08)',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  panelActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F4C95D',
  },
});
