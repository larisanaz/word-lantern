import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { TOP_INSET } from '../constants/config';
import { THEME } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  /** Progress 0..1 drawn as a thin gold rule under the title. */
  progress?: number;
  right?: React.ReactNode;
  onBack?: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * The one header used by every screen. Padding for the status bar lives here,
 * so no screen has to re-invent (and drift on) its own top bar.
 */
export default function ScreenHeader({ title, subtitle, progress, right, onBack }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const down = useCallback(() => {
    Animated.spring(scale, { toValue: 0.9, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);
  const up = useCallback(() => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);

  const pct = Math.max(0, Math.min(1, progress === undefined ? 0 : progress));

  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            style={styles.backPress}
            hitSlop={HIT}
            onPressIn={down}
            onPressOut={up}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Animated.View pointerEvents="box-none" style={[styles.back, { transform: [{ scale }] }]}>
              <ChevronLeft size={24} color={THEME.text.primary} strokeWidth={2.4} />
            </Animated.View>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {progress === undefined ? null : (
          <View style={styles.track}>
            <View style={[styles.fill, { width: 120 * pct }]} />
          </View>
        )}
      </View>

      <View style={styles.sideRight}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: TOP_INSET,
    height: TOP_INSET + 72,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12,16,34,0.55)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247,243,232,0.08)',
  },
  side: { width: 52, alignItems: 'flex-start' },
  sideRight: { width: 96, alignItems: 'flex-end' },
  backPress: { width: 44, height: 44, justifyContent: 'center' },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(247,243,232,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(247,243,232,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.text.secondary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.dim,
  },
  track: {
    marginTop: 6,
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(247,243,232,0.12)',
    overflow: 'hidden',
  },
  fill: { height: 4, borderRadius: 2, backgroundColor: THEME.accent.gold },
});
