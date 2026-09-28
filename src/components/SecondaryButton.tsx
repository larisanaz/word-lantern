import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';

type Props = {
  label: string;
  Icon?: React.ComponentType<any>;
  onPress: () => void;
  disabled?: boolean;
  tint?: string;
  /** Explicit height so the tap target is always at least 48dp tall. */
  height?: number;
  stretch?: boolean;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Glass secondary action. Same icon sizing contract as the primary CTA. */
export default function SecondaryButton({
  label,
  Icon,
  onPress,
  disabled,
  tint,
  height = 48,
  stretch,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = tint || THEME.text.secondary;

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
      style={[styles.press, { height }, stretch ? styles.flex : styles.full]}
      hitSlop={HIT}
      disabled={disabled}
      onPressIn={down}
      onPressOut={up}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          { height, borderColor: tint ? tint + '59' : THEME.line.hair },
          disabled ? styles.dim : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={color} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    justifyContent: 'center',
  },
  full: { width: '100%' },
  flex: { flex: 1 },
  shell: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(247,243,232,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: { opacity: 0.4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
