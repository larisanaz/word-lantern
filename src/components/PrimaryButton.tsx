import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRAD, THEME } from '../constants/theme';

type Props = {
  label: string;
  /** lucide icon component. Typed loose so any glyph from the set fits. */
  Icon?: React.ComponentType<any>;
  onPress: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Gold CTA. The Pressable is the OUTER node and drives the spring, so the
 * animated wrapper can never swallow the tap on an Android release build.
 */
export default function PrimaryButton({ label, Icon, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const down = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const up = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      style={styles.press}
      hitSlop={HIT}
      onPressIn={down}
      onPressOut={up}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.shell, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={GRAD.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? <Icon size={24} color={THEME.text.onGold} strokeWidth={2.5} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 60,
  },
  shell: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    shadowColor: '#F4C95D',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  grad: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.text.onGold,
  },
});
