import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { gradients, radii, shadows } from '../../theme/tokens';

interface HeroHeaderProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  badge?: string;
  style?: ViewStyle;
}

export default function HeroHeader({ title, subtitle, icon, badge, style }: HeroHeaderProps) {
  return (
    <LinearGradient
      colors={[...gradients.hero]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, style]}
    >
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />
      <View style={styles.row}>
        <View style={styles.copy}>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {icon ? (
          <View style={styles.iconCircle}>
            <MaterialIcons name={icon} size={28} color="#fff" />
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xxl,
    padding: 22,
    marginBottom: 20,
    overflow: 'hidden',
    ...shadows.card,
  },
  glowLarge: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -40,
    right: -30,
  },
  glowSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: 20,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  copy: { flex: 1 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: 8,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.3, lineHeight: 32 },
  subtitle: { color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 21, marginTop: 8, fontWeight: '500' },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
