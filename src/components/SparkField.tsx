import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SCREEN } from '../constants/config';

type Props = {
  /** How many sparks to scatter across the full canvas. */
  count?: number;
  seed?: number;
  /** Fine even grain (loader) versus sparse festival sparkle (result). */
  grain?: boolean;
};

type Spark = { x: number; y: number; r: number; c: string; o: number };

const TINTS = ['#F4C95D', '#F4C95D', '#4D6CFA', '#D96C75'];

/**
 * Static festival sparks. Built once inside useMemo and never animated, so the
 * window still reaches idle and the screenshot harness can capture the frame.
 */
export default function SparkField({ count = 900, seed = 1337, grain = false }: Props) {
  const sparks = useMemo<Spark[]>(() => {
    let s = (seed >>> 0) || 1;
    const rnd = () => {
      s ^= s << 13;
      s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
    const out: Spark[] = [];
    for (let i = 0; i < count; i++) {
      const bright = !grain && i % 13 === 0;
      out.push({
        x: rnd() * SCREEN.W,
        y: rnd() * SCREEN.H,
        r: grain ? 0.8 + rnd() * 0.8 : bright ? 1.7 + rnd() * 1.3 : 0.9 + rnd() * 1.0,
        c: TINTS[i % TINTS.length],
        o: grain ? 0.1 + rnd() * 0.12 : 0.12 + rnd() * 0.2,
      });
    }
    return out;
  }, [count, grain, seed]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={SCREEN.W} height={SCREEN.H}>
        {sparks.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.c} fillOpacity={p.o} />
        ))}
      </Svg>
    </View>
  );
}
