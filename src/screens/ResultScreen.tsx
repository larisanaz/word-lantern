import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lightbulb, Star, Trophy } from 'lucide-react-native';
import AuroraBackdrop from '../components/AuroraBackdrop';
import SparkField from '../components/SparkField';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { bgResult, spriteLanternLit } from '../assets';
import { Outcome } from '../hooks/useGameLoop';
import { GRAD, THEME } from '../constants/theme';

type Props = {
  outcome: Outcome;
  score: number;
  lit: number;
  total: number;
  foundWords: string[];
  best: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

/** Round summary. Third distinct palette, so it never reads as loader or game. */
export default function ResultScreen({
  outcome,
  score,
  lit,
  total,
  foundWords,
  best,
  onPlayAgain,
  onMenu,
}: Props) {
  const won = outcome === 'win';
  const pop = useRef(new Animated.Value(0.8)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, tension: 120, friction: 7, useNativeDriver: true }).start();
    Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [fade, pop]);

  return (
    <View style={styles.root}>
      <ImageBackground source={bgResult} resizeMode="cover" style={styles.bg}>
        <LinearGradient colors={GRAD.result} style={StyleSheet.absoluteFill} />
        <AuroraBackdrop variant="result" />
        <SparkField count={800} seed={90210} />

        <ScreenHeader title="TRAIL REPORT" subtitle={won ? 'STAGE CLEARED' : 'STAGE PAUSED'} />

        <Animated.View pointerEvents="box-none" style={[styles.body, { opacity: fade }]}>
          <Text style={[styles.headline, won ? styles.headlineWin : styles.headlineLose]}>
            {won ? 'YOU WON!' : 'NO LUCK!'}
          </Text>

          <Animated.View pointerEvents="none" style={{ transform: [{ scale: pop }] }}>
            <Image source={spriteLanternLit} style={styles.sprite} resizeMode="contain" />
          </Animated.View>

          <Text style={styles.caption}>{won ? 'TRAIL ILLUMINATED' : 'TRAIL STILL DARK'}</Text>

          {score > 0 ? (
            <View style={styles.stats}>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Lightbulb}
                  value={`${lit}/${total}`}
                  label="WORDS"
                  color={THEME.accent.gold}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard Icon={Star} value={score} label="GLOW" color={THEME.accent.blue} />
              </View>
              <View style={styles.statSlot}>
                <StatCard Icon={Trophy} value={best} label="BEST" color={THEME.accent.rose} />
              </View>
            </View>
          ) : (
            <Text style={styles.empty}>No lantern lit this time. The trail is still waiting.</Text>
          )}

          {foundWords.length > 0 ? (
            <View style={styles.chips}>
              {foundWords.slice(0, 5).map(w => (
                <View key={w} style={styles.chip}>
                  <Text style={styles.chipText}>{w}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Animated.View>

        <View style={styles.footer}>
          <PrimaryButton label="PLAY AGAIN" Icon={Star} onPress={onPlayAgain} />
          <View style={styles.secondary}>
            <SecondaryButton label="BACK TO TRAIL" height={48} onPress={onMenu} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.bg.deep },
  bg: { flex: 1 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  headline: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  headlineWin: {
    color: THEME.accent.gold,
    textShadowColor: 'rgba(244,201,93,0.5)',
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  headlineLose: {
    color: THEME.accent.rose,
    textShadowColor: 'rgba(217,108,117,0.4)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  sprite: { width: 108, height: 108, marginTop: 10 },
  caption: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.secondary,
  },
  stats: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  statSlot: { flex: 1 },
  empty: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  chips: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,201,93,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244,201,93,0.30)',
  },
  chipText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.accent.gold,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 28 },
  secondary: { marginTop: 10 },
});
