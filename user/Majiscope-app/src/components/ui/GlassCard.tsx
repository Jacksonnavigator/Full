import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { radii, shadows } from '../../theme/tokens';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

/** Frosted white card for use on gradient backgrounds */
export default function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  return (
    <View style={[styles.card, { padding }, style]}>
      <View style={styles.shine} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    ...shadows.float,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
  },
});
