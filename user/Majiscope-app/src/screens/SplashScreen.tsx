import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrandWordmark from '../components/BrandWordmark';
import { gradients, radii, shadows } from '../theme/tokens';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(onFinish);
    }, 2600);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, pulseAnim, onFinish]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={[...gradients.splash]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[styles.logoOuter, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.08)']} style={styles.logoRing}>
            <View style={styles.logoInner}>
              <Image source={require('../../assets/logo1 (1).png')} style={styles.logo} resizeMode="contain" />
            </View>
          </LinearGradient>
        </Animated.View>

        <BrandWordmark size="lg" surface="dark" />
        <Text style={styles.tagline}>Report · Track · Resolve</Text>

        <View style={styles.loaderRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.loaderDot,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  orb1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -100 },
  orb2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(34,211,238,0.15)', bottom: 80, left: -60 },
  orb3: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(59,130,246,0.2)', top: '45%', right: 30 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logoOuter: { marginBottom: 28 },
  logoRing: {
    width: 156,
    height: 156,
    borderRadius: 78,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.float,
  },
  logoInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 96, height: 96 },
  tagline: {
    marginTop: 16,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  loaderRow: { flexDirection: 'row', gap: 8, marginTop: 36 },
  loaderDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});
