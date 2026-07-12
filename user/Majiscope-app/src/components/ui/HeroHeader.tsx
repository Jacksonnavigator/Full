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
  compact?: boolean;
}

export default function HeroHeader({ title, subtitle, icon, badge, style, compact = false }: HeroHeaderProps) {
  return (
    <LinearGradient
      colors={[...gradients.hero]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, compact && styles.wrapCompact, style]}
    >
      <View style={styles.glowLarge} />
      <View style={styles.row}>
        <View style={styles.copy}>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText} numberOfLines={1}>
                {badge}
              </Text>
            </View>
          ) : null}
          <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {icon ? (
          <View style={[styles.iconCircle, compact && styles.iconCircleCompact]}>
            <MaterialIcons name={icon} size={compact ? 24 : 28} color="#fff" />
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xl,
    padding: 14,
    marginBottom: 10,
    overflow: 'hidden',
    ...shadows.card,
  },
  wrapCompact: {
    padding: 12,
    marginBottom: 8,
  },
  glowLarge: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -30,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1, minWidth: 0 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    marginBottom: 4,
    maxWidth: '100%',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3, lineHeight: 28 },
  titleCompact: { fontSize: 20, lineHeight: 26 },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18, marginTop: 4, fontWeight: '500' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    flexShrink: 0,
  },
  iconCircleCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
