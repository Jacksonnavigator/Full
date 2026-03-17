import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, fontWeight, fontSize, borderRadius, spacing, shadows } from '../theme';

interface HydraHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  style?: ViewStyle;
}

export const HydraHeader: React.FC<HydraHeaderProps> = ({
  title,
  subtitle,
  rightSlot,
  style
}) => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.appName}>HydraNet</Text>
            <Text style={styles.appTag}>Engineer</Text>
          </View>
        </View>
        {rightSlot ? <View style={styles.right}>{rightSlot}</View> : null}
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...shadows.lg,
    fontFamily: fontFamily,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    ...shadows.sm,
  },
  logo: {
    width: 28,
    height: 28,
  },
  appName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: 0.5,
    fontFamily: fontFamily,
  },
  appTag: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily,
  },
  right: {
    marginLeft: spacing.sm
  },
  textBlock: {
    marginTop: spacing.md
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: 0.5,
    fontFamily: fontFamily,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    lineHeight: fontSize.sm * 1.5,
    fontFamily: fontFamily,
  }
});


