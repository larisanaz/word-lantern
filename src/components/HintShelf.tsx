import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lightbulb, Sparkles, X } from 'lucide-react-native';
import SecondaryButton from './SecondaryButton';
import { GRAD, NUM, THEME } from '../constants/theme';

type Props = {
  visible: boolean;
  hints: number;
  onPick: (kind: 'letter' | 'word') => void;
  onClose: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Bottom shelf offering the two ways to spend a hint. Overlay, not a screen. */
export default function HintShelf({ visible, hints, onPick, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable style={styles.scrimTap} onPress={onClose} accessibilityLabel="Close hints" />
        <LinearGradient colors={GRAD.sheet} style={styles.sheet}>
          <View style={styles.head}>
            <View style={styles.headLeft}>
              <View style={styles.iconWrap}>
                <Lightbulb size={22} color={THEME.accent.blue} strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.title}>HINT SHELF</Text>
                <Text style={styles.count}>{hints} LEFT</Text>
              </View>
            </View>
            <Pressable
              style={styles.closePress}
              hitSlop={HIT}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close">
              <View style={styles.close}>
                <X size={20} color={THEME.text.secondary} strokeWidth={2.4} />
              </View>
            </Pressable>
          </View>

          <Text style={styles.body}>
            Spend one lantern oil to open part of the next hidden word.
          </Text>

          <View style={styles.actions}>
            <SecondaryButton
              label="ONE LETTER"
              Icon={Lightbulb}
              tint={THEME.accent.blue}
              disabled={hints <= 0}
              stretch
              onPress={() => onPick('letter')}
            />
            <SecondaryButton
              label="WHOLE WORD"
              Icon={Sparkles}
              tint={THEME.accent.gold}
              disabled={hints <= 0}
              stretch
              onPress={() => onPick('word')}
            />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(8,11,26,0.86)', justifyContent: 'flex-end' },
  scrimTap: { flex: 1 },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(247,243,232,0.10)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(77,108,250,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.text.primary,
  },
  count: {
    ...NUM,
    marginTop: 2,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.accent.gold,
  },
  closePress: { width: 44, height: 44, alignItems: 'flex-end', justifyContent: 'center' },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(247,243,232,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  actions: { marginTop: 16, flexDirection: 'row', gap: 12 },
});
