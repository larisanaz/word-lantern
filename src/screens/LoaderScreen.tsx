import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AuroraBackdrop from '../components/AuroraBackdrop';
import SparkField from '../components/SparkField';
import { bgLoader, spriteLantern } from '../assets';
import { LOADER_BAR_MS, LOADER_BAR_W, LOADER_DURATION_MS } from '../constants/config';
import { GRAD, THEME } from '../constants/theme';

type Props = { onDone: () => void };

/**
 * Brand card shown while the bundle warms up. Deliberately far darker and
 * grainier than the menu so the two frames never read as the same picture.
 * Nothing here is interactive; the hand-off is a plain wall-clock timeout.
 */
export default function LoaderScreen({ onDone }: Props) {
  const lift = useRef(new Animated.Value(0.7)).current;
  const halo = useRef(new Animated.Value(0.35)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.timing(halo, {
      toValue: 0.9,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.timing(titleIn, {
      toValue: 1,
      duration: 700,
      delay: 250,
      useNativeDriver: true,
    }).start();

    // The only non-native animation in the app: width cannot run on the GPU.
    Animated.timing(bar, {
      toValue: LOADER_BAR_W,
      duration: LOADER_BAR_MS,
      useNativeDriver: false,
    }).start();

    const hop = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => clearTimeout(hop);
  }, [bar, fade, halo, lift, titleIn]);

  const rise = titleIn.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <ImageBackground source={bgLoader} resizeMode="cover" style={styles.bg}>
        <LinearGradient colors={GRAD.loader} style={StyleSheet.absoluteFill} />
        <AuroraBackdrop variant="loader" />
        <SparkField count={1500} grain seed={1337} />

        <View style={styles.center}>
          <Animated.View style={[styles.haloOuter, { opacity: halo }]}>
            <View style={styles.ring3} />
            <View style={styles.ring2} />
            <View style={styles.ring1} />
          </Animated.View>

          <Animated.View style={[styles.badge, { transform: [{ scale: lift }] }]}>
            <LinearGradient
              colors={GRAD.gold}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badgeFill}>
              <Image source={spriteLantern} style={styles.sprite} resizeMode="contain" />
            </LinearGradient>
          </Animated.View>

          <Animated.View style={{ opacity: titleIn, transform: [{ translateY: rise }] }}>
            <Text style={styles.brand}>WORD LANTERN</Text>
            <Text style={styles.tagline}>LIGHT THE NIGHT TRAIL</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: bar }]}>
              <LinearGradient
                colors={GRAD.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING</Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.bg.deep },
  bg: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  haloOuter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(244,201,93,0.20)',
  },
  ring2: {
    position: 'absolute',
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 1,
    borderColor: 'rgba(244,201,93,0.12)',
  },
  ring3: {
    position: 'absolute',
    width: 236,
    height: 236,
    borderRadius: 118,
    borderWidth: 1,
    borderColor: 'rgba(244,201,93,0.06)',
  },
  badge: {
    width: 132,
    height: 132,
    borderRadius: 66,
    shadowColor: '#F4C95D',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    marginBottom: 34,
  },
  badgeFill: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: { width: 84, height: 84 },
  brand: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: 5,
    color: THEME.text.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(244,201,93,0.55)',
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 3,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  footer: { alignItems: 'center', paddingBottom: 72 },
  track: {
    width: LOADER_BAR_W,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(247,243,232,0.10)',
    overflow: 'hidden',
  },
  fill: { height: 5, borderRadius: 3, overflow: 'hidden' },
  loading: {
    marginTop: 14,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 4,
    color: THEME.text.dim,
  },
});
