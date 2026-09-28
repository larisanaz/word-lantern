import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SCREEN } from '../constants/config';

type Variant = 'loader' | 'menu' | 'game' | 'result';

type Blob = { cx: number; cy: number; r: number; c: string; o: number };

const W = SCREEN.W;
const H = SCREEN.H;

const SETS: { [k in Variant]: Blob[] } = {
  loader: [
    { cx: W * 0.2, cy: H * 0.22, r: 170, c: '#4D6CFA', o: 0.05 },
    { cx: W * 0.85, cy: H * 0.72, r: 150, c: '#F4C95D', o: 0.04 },
  ],
  menu: [
    { cx: W * 0.16, cy: H * 0.18, r: 180, c: '#4D6CFA', o: 0.06 },
    { cx: W * 0.9, cy: H * 0.42, r: 140, c: '#D96C75', o: 0.04 },
  ],
  game: [
    { cx: W * 0.12, cy: H * 0.24, r: 175, c: '#4D6CFA', o: 0.05 },
    { cx: W * 0.92, cy: H * 0.74, r: 160, c: '#D96C75', o: 0.035 },
    { cx: W * 0.5, cy: H * 0.5, r: 120, c: '#F4C95D', o: 0.02 },
  ],
  result: [
    { cx: W * 0.5, cy: H * 0.26, r: 180, c: '#F4C95D', o: 0.06 },
    { cx: W * 0.14, cy: H * 0.78, r: 150, c: '#4D6CFA', o: 0.04 },
  ],
};

/** Soft aurora light pools sitting between the background art and the surfaces. */
export default function AuroraBackdrop({ variant }: { variant: Variant }) {
  const blobs = SETS[variant];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H}>
        {blobs.map((b, i) => (
          <React.Fragment key={i}>
            <Circle cx={b.cx} cy={b.cy} r={b.r} fill={b.c} fillOpacity={b.o} />
            <Circle cx={b.cx} cy={b.cy} r={b.r * 0.66} fill={b.c} fillOpacity={b.o * 0.7} />
            <Circle cx={b.cx} cy={b.cy} r={b.r * 0.36} fill={b.c} fillOpacity={b.o * 0.5} />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}
