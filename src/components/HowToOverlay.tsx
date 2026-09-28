import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SecondaryButton from './SecondaryButton';
import { GRAD, THEME } from '../constants/theme';

type Props = { visible: boolean; onClose: () => void };

const STEPS = [
  { tag: '[1]', text: 'Tap letters on the ring to build a word from the glowing pool.' },
  { tag: '[2]', text: 'Press GO to check it. Three letters or more counts.' },
  { tag: '[3]', text: 'Every hidden word you find lights one more lantern on the trail.' },
];

/** Rules card. Overlay inside Menu, never its own screen state. */
export default function HowToOverlay({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <LinearGradient colors={GRAD.sheet} style={styles.card}>
          <Text style={styles.title}>HOW TO PLAY</Text>
          <Text style={styles.sub}>ONE TAP PER LETTER</Text>

          <View style={styles.steps}>
            {STEPS.map(s => (
              <View key={s.tag} style={styles.step}>
                <View style={styles.tagWrap}>
                  <Text style={styles.tag}>{s.tag}</Text>
                </View>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            ))}
          </View>

          <SecondaryButton label="GOT IT" tint={THEME.accent.gold} height={48} onPress={onClose} />
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(8,11,26,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(247,243,232,0.10)',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  title: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: 3,
    color: THEME.text.primary,
    textAlign: 'center',
  },
  sub: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: THEME.text.dim,
    textAlign: 'center',
  },
  steps: { marginTop: 18, marginBottom: 20, gap: 14 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  tagWrap: {
    width: 40,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(244,201,93,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(244,201,93,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.accent.gold,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
});
