import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NUM, THEME } from '../constants/theme';

type Props = {
  Icon: React.ComponentType<any>;
  value: string | number;
  label: string;
  color: string;
};

/**
 * One pill shape for every stat on every screen. The row differentiates by
 * colour and number, never by swapping in a differently-proportioned glyph.
 * width:'100%' (never flex:1) so a flex:1 parent slot cannot collapse it.
 */
export default function StatCard({ Icon, value, label, color }: Props) {
  return (
    <View style={[styles.card, { borderColor: color + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Icon size={22} color={color} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, { color }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,37,71,0.72)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    ...NUM,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.dim,
  },
});
