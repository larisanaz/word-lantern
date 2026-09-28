import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GO_SIZE } from '../constants/config';
import { GRAD, THEME } from '../constants/theme';

type Props = { onPress: () => void };

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Centre-of-ring submit action. Plain text label, no glyph, always centred. */
export default function GoButton({ onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const down = useCallback(() => {
    Animated.spring(scale, { toValue: 0.93, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);
  const up = useCallback(() => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Pressable
      style={styles.press}
      hitSlop={HIT}
      onPressIn={down}
      onPressOut={up}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="GO">
      <Animated.View pointerEvents="box-none" style={[styles.shell, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={GRAD.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.grad}>
          <Text style={styles.label}>GO</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: GO_SIZE,
    height: GO_SIZE,
    marginLeft: -GO_SIZE / 2,
    marginTop: -GO_SIZE / 2,
  },
  shell: {
    width: GO_SIZE,
    height: GO_SIZE,
    borderRadius: GO_SIZE / 2,
    shadowColor: '#F4C95D',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  grad: {
    width: GO_SIZE,
    height: GO_SIZE,
    borderRadius: GO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.text.onGold,
  },
});
