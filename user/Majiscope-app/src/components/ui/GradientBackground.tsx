import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../theme/tokens';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'mesh' | 'splash';
}

export default function GradientBackground({ children, style, variant = 'mesh' }: GradientBackgroundProps) {
  const colors = variant === 'splash' ? gradients.splash : gradients.mesh;

  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={[...colors]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />
      <View style={[styles.orb, styles.orbMid]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  content: { flex: 1 },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  orbTop: { width: 280, height: 280, top: -120, right: -80 },
  orbBottom: { width: 220, height: 220, bottom: -60, left: -70, backgroundColor: 'rgba(6,182,212,0.15)' },
  orbMid: { width: 140, height: 140, top: '40%', left: -50, backgroundColor: 'rgba(59,130,246,0.12)' },
});
