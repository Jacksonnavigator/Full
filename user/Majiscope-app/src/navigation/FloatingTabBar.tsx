import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { gradients, radii, shadows } from '../theme/tokens';
import { TAB_BAR_HEIGHT } from '../theme/screenLayout';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';

const TAB_CONFIG: Record<
  string,
  {
    icon: keyof typeof MaterialIcons.glyphMap;
    iconFocused: keyof typeof MaterialIcons.glyphMap;
    label: string;
  }
> = {
  Report: { icon: 'add-circle-outline', iconFocused: 'add-circle', label: 'Report' },
  ViewReport: { icon: 'assignment', iconFocused: 'assignment', label: 'History' },
  Emergency: { icon: 'phone-in-talk', iconFocused: 'phone-in-talk', label: 'SOS' },
  Terms: { icon: 'description', iconFocused: 'description', label: 'Terms' },
};

export default function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { language } = useAppLanguage();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 6);

  return (
    <View style={[styles.outer, { paddingBottom: bottomInset }]}>
      <View style={[styles.bar, shadows.float]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            icon: 'circle' as const,
            iconFocused: 'circle' as const,
            label: route.name,
          };
          const localizedLabel = getText(
            language,
            config.label,
            config.label === 'Report'
              ? 'Ripoti'
              : config.label === 'History'
                ? 'Historia'
                : config.label === 'SOS'
                  ? 'Dharura'
                  : config.label === 'Terms'
                    ? 'Sheria'
                    : config.label
          );

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.85}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={localizedLabel}
            >
              {focused ? (
                <LinearGradient colors={[...gradients.button]} style={styles.iconBubble}>
                  <MaterialIcons name={config.iconFocused} size={22} color="#fff" />
                </LinearGradient>
              ) : (
                <View style={[styles.iconBubble, styles.iconBubbleInactive, { backgroundColor: colors.surface }]}>
                  <MaterialIcons name={config.icon} size={22} color={colors.textSecondary} />
                </View>
              )}
              <Text
                style={[styles.label, { color: focused ? colors.primary : colors.textSecondary }, focused && styles.labelActive]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {localizedLabel}
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
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radii.xxl,
    minHeight: TAB_BAR_HEIGHT,
    paddingHorizontal: 2,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(8,145,178,0.12)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    minHeight: TAB_BAR_HEIGHT - 12,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconBubbleInactive: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    fontWeight: '800',
  },
});
