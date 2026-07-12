import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { TAB_BAR_HEIGHT } from './useBottomTabPadding';

const TAB_CONFIG: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    iconFocused: keyof typeof Ionicons.glyphMap;
    label: string;
  }
> = {
  Tasks: { icon: 'clipboard-outline', iconFocused: 'clipboard', label: 'Tasks' },
  Profile: { icon: 'person-outline', iconFocused: 'person', label: 'Profile' },
  TeamTasks: { icon: 'people-outline', iconFocused: 'people', label: 'Tasks' },
  Review: { icon: 'checkmark-done-outline', iconFocused: 'checkmark-done', label: 'Review' },
  Performance: { icon: 'bar-chart-outline', iconFocused: 'bar-chart', label: 'Stats' },
  Dashboard: { icon: 'grid-outline', iconFocused: 'grid', label: 'Home' },
  Reports: { icon: 'document-text-outline', iconFocused: 'document-text', label: 'Reports' },
  People: { icon: 'people-outline', iconFocused: 'people', label: 'People' },
  Teams: { icon: 'layers-outline', iconFocused: 'layers', label: 'Teams' },
};

export default function EngineerFloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);

  return (
    <View style={[styles.outer, { paddingBottom: bottomInset }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            icon: 'ellipse-outline' as const,
            iconFocused: 'ellipse' as const,
            label: route.name,
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.85}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={config.label}
            >
              {focused ? (
                <LinearGradient colors={['#0891b2', '#06b6d4']} style={styles.iconBubble}>
                  <Ionicons name={config.iconFocused} size={20} color="#fff" />
                </LinearGradient>
              ) : (
                <View style={styles.iconBubbleInactive}>
                  <Ionicons name={config.icon} size={20} color={colors.textMuted} />
                </View>
              )}
              <Text
                style={[styles.label, focused && styles.labelActive]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 28,
    minHeight: TAB_BAR_HEIGHT,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(8,145,178,0.14)',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    minHeight: TAB_BAR_HEIGHT - 16,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconBubbleInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 14,
    textAlign: 'center',
    width: '100%',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
