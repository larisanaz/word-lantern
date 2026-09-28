import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRAD, THEME } from '../constants/theme';

type Props = {
  letter: string;
  lit: boolean;
  /** Hint reveal: shows the glyph without counting as solved. */
  peek?: boolean;
  size: number;
  delay: number;
};

/**
 * One letter slot on the word board. Dark slot until its word is solved, then
 * it flares up to a lit lantern. Scale-only spring, so the native driver is safe.
 */
export default function LanternTile({ letter, lit, peek, size, delay }: Props) {
  const scale = useRef(new Animated.Value(lit ? 1 : 0.92)).current;
  const was = useRef(lit);

  useEffect(() => {
    if (lit && !was.current) {
      was.current = true;
      scale.setValue(0.6);
      Animated.sequence([
        Animated.delay(delay),
        Animated.spring(scale, {
          toValue: 1.12,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
    if (!lit) {
      was.current = false;
    }
  }, [delay, lit, scale]);

  const box = { width: size, height: size, borderRadius: 12 };

  if (lit) {
    return (
      <Animated.View style={[box, styles.glow, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={GRAD.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[box, styles.center]}>
          <Text style={[styles.letter, { fontSize: Math.round(size * 0.44) }]}>{letter}</Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[box, styles.dark, styles.center, { transform: [{ scale }] }]}>
      {peek ? (
        <Text style={[styles.peek, { fontSize: Math.round(size * 0.4) }]}>{letter}</Text>
      ) : (
        <Animated.View style={styles.dot} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  dark: {
    backgroundColor: 'rgba(247,243,232,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(247,243,232,0.10)',
  },
  glow: {
    shadowColor: '#F4C95D',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  letter: {
    fontWeight: '800',
    color: THEME.text.onGold,
  },
  peek: {
    fontWeight: '800',
    color: 'rgba(247,243,232,0.55)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(247,243,232,0.18)',
  },
});
