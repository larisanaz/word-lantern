import React from 'react';
import { StyleSheet, View } from 'react-native';
import LanternTile from './LanternTile';
import { TILE_GAP } from '../constants/config';

type Props = {
  word: string;
  solved: boolean;
  /** Letter positions revealed by a hint while the word is still unsolved. */
  revealed: number[];
  tile: number;
};

/** One hidden word rendered as a row of lantern slots, centred in the board. */
export default function WordRow({ word, solved, revealed, tile }: Props) {
  const letters = word.split('');
  return (
    <View style={styles.row}>
      {letters.map((ch, i) => (
        <LanternTile
          key={i}
          letter={ch}
          lit={solved}
          peek={revealed.indexOf(i) >= 0}
          size={tile}
          delay={i * 60}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: TILE_GAP,
  },
});
