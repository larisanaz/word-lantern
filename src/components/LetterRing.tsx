import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import GoButton from './GoButton';
import { LETTER, RING_BOX, RING_RADIUS } from '../constants/config';
import { THEME } from '../constants/theme';

type Props = {
  letters: string[];
  used: number[];
  onLetter: (index: number) => void;
  onSubmit: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function LetterKey({
  ch,
  used,
  left,
  top,
  onPress,
}: {
  ch: string;
  used: boolean;
  left: number;
  top: number;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const down = useCallback(() => {
    Animated.spring(scale, { toValue: 0.92, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);
  const up = useCallback(() => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Pressable
      style={[styles.keyPress, { left, top }]}
      hitSlop={HIT}
      onPressIn={down}
      onPressOut={up}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={ch}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.key, used ? styles.keyUsed : styles.keyIdle, { transform: [{ scale }] }]}>
        <Text style={[styles.keyText, used ? styles.keyTextUsed : null]}>{ch}</Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Letters laid out on a circle. The radius already subtracts the key size, so
 * a key can never spill outside the ring box whatever the letter count is.
 */
export default function LetterRing({ letters, used, onLetter, onSubmit }: Props) {
  const n = letters.length || 1;
  return (
    <View style={styles.box}>
      {letters.map((ch, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
        const left = RING_BOX / 2 + RING_RADIUS * Math.cos(a) - LETTER / 2;
        const top = RING_BOX / 2 + RING_RADIUS * Math.sin(a) - LETTER / 2;
        return (
          <LetterKey
            key={`${ch}-${i}`}
            ch={ch}
            used={used.indexOf(i) >= 0}
            left={left}
            top={top}
            onPress={() => onLetter(i)}
          />
        );
      })}
      <GoButton onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: RING_BOX,
    height: RING_BOX,
    alignSelf: 'center',
  },
  keyPress: {
    position: 'absolute',
    width: LETTER,
    height: LETTER,
  },
  key: {
    width: LETTER,
    height: LETTER,
    borderRadius: LETTER / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyIdle: {
    backgroundColor: 'rgba(247,243,232,0.08)',
    borderColor: 'rgba(247,243,232,0.16)',
  },
  keyUsed: {
    backgroundColor: 'rgba(77,108,250,0.28)',
    borderColor: '#4D6CFA',
  },
  keyText: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    color: THEME.text.primary,
  },
  keyTextUsed: {
    color: '#DCE3FF',
  },
});
