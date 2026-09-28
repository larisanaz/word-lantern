import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Flame, Lightbulb, Star, Trophy } from 'lucide-react-native';
import AuroraBackdrop from '../components/AuroraBackdrop';
import SparkField from '../components/SparkField';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import HowToOverlay from '../components/HowToOverlay';
import { bgMenu, spriteLantern } from '../assets';
import { STAGE_COUNT } from '../game/stages';
import { TOP_INSET } from '../constants/config';
import { GRAD, NUM, THEME } from '../constants/theme';

type Props = {
  best: number;
  words: number;
  night: number;
  onPlay: () => void;
};

/** Bottom-sheet menu: festival art on top, frosted control sheet underneath. */
export default function MenuScreen({ best, words, night, onPlay }: Props) {
  const [howTo, setHowTo] = useState(false);
  const sheetIn = useRef(new Animated.Value(0)).current;
  const lanternIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sheetIn, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
    Animated.timing(lanternIn, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: true,
    }).start();
  }, [lanternIn, sheetIn]);

  const sheetRise = sheetIn.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const lanternRise = lanternIn.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const showStats = best > 0 && words > 0;

  return (
    <View style={styles.root}>
      <ImageBackground source={bgMenu} resizeMode="cover" style={styles.bg}>
        <LinearGradient colors={GRAD.menuArt} style={StyleSheet.absoluteFill} />
        <AuroraBackdrop variant="menu" />
        <SparkField count={200} seed={4242} />

        <View style={styles.art}>
          <View style={styles.pills}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>NIGHT {night}</Text>
            </View>
            <View style={styles.pill}>
              <Flame size={16} color={THEME.accent.gold} strokeWidth={2.4} />
              <Text style={styles.pillText}>LANTERNS {words}</Text>
            </View>
          </View>

          <Animated.View
            pointerEvents="none"
            style={[styles.lanternWrap, { transform: [{ translateY: lanternRise }] }]}>
            <Image source={spriteLantern} style={styles.lantern} resizeMode="contain" />
          </Animated.View>
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={{ opacity: sheetIn, transform: [{ translateY: sheetRise }] }}>
          <LinearGradient colors={GRAD.sheet} style={styles.sheet}>
            <Text style={styles.title}>WORD LANTERN</Text>
            <Text style={styles.tagline}>CONNECT LETTERS - LIGHT THE TRAIL</Text>

            <View style={styles.daily}>
              <View style={styles.dailyIcon}>
                <Star size={22} color={THEME.accent.blue} strokeWidth={2.4} />
              </View>
              <View style={styles.dailyMid}>
                <Text style={styles.dailyLabel}>DAILY WORD</Text>
                <Text style={styles.dailyWord}>L A _ _ _ _ N</Text>
              </View>
              <Text style={styles.dailyBonus}>+50</Text>
            </View>

            {showStats ? (
              <View style={styles.stats}>
                <View style={styles.statSlot}>
                  <StatCard Icon={Trophy} value={best} label="BEST GLOW" color={THEME.accent.gold} />
                </View>
                <View style={styles.statSlot}>
                  <StatCard Icon={Lightbulb} value={words} label="WORDS" color={THEME.accent.blue} />
                </View>
              </View>
            ) : (
              <Text style={styles.hint}>
                {STAGE_COUNT} trail stops wait in the dark. Find every hidden word to light them.
              </Text>
            )}

            <PrimaryButton label="START TRAIL" Icon={Flame} onPress={onPlay} />

            <View style={styles.secondary}>
              <SecondaryButton label="HOW TO PLAY" height={48} onPress={() => setHowTo(true)} />
            </View>
          </LinearGradient>
        </Animated.View>
      </ImageBackground>

      <HowToOverlay visible={howTo} onClose={() => setHowTo(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.bg.base },
  bg: { flex: 1, justifyContent: 'flex-end' },
  art: {
    flex: 1,
    paddingTop: TOP_INSET,
    paddingHorizontal: 16,
  },
  pills: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(12,16,34,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(244,201,93,0.28)',
  },
  pillText: {
    ...NUM,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: THEME.accent.gold,
  },
  lanternWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lantern: { width: 120, height: 120 },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(247,243,232,0.10)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 3,
    color: THEME.text.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(244,201,93,0.45)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  daily: {
    height: 68,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(77,108,250,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,108,250,0.35)',
    marginBottom: 12,
  },
  dailyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(77,108,250,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyMid: { flex: 1 },
  dailyLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.dim,
  },
  dailyWord: {
    marginTop: 2,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.text.primary,
  },
  dailyBonus: {
    ...NUM,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: THEME.accent.gold,
  },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  statSlot: { flex: 1 },
  hint: {
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  secondary: { marginTop: 10 },
});
