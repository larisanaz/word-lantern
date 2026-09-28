import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NUM, THEME } from '../constants/theme';

type Props = {
  Icon: React.ComponentType<any>;
  value: string | number;
  label: string;
  color: string;
};

/** Compact in-game readout. Same single-glyph, colour-coded contract as StatCard. */
export default function StatChip({ Icon, value, label, color }: Props) {
  return (
    <View style={[styles.chip, { borderColor: color + '44' }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Icon size={18} color={color} strokeWidth={2.4} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.value, { color }]} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(247,243,232,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    alignItems: 'flex-start',
  },
  value: {
    ...NUM,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
  },
  label: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: THEME.text.dim,
  },
});
