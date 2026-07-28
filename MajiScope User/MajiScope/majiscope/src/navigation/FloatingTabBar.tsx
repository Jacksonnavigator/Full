import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { gradients, radii, shadows } from '../theme/tokens';

const TAB_CONFIG: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; iconFocused: keyof typeof MaterialIcons.glyphMap; label: string }> = {
  Report: { icon: 'add-circle-outline', iconFocused: 'add-circle', label: 'Report' },
  ViewReport: { icon: 'assignment', iconFocused: 'assignment', label: 'My Reports' },
  Emergency: { icon: 'phone-in-talk', iconFocused: 'phone-in-talk', label: 'Emergency' },
  Terms: { icon: 'description', iconFocused: 'description', label: 'Terms' },
};

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={[styles.bar, shadows.float]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_CONFIG[route.name] || { icon: 'circle', iconFocused: 'circle', label: route.name };
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.85} style={styles.tab}>
              {focused ? (
                <LinearGradient colors={[...gradients.button]} style={styles.activePill}>
                  <MaterialIcons name={config.iconFocused} size={22} color="#fff" />
                  <Text style={styles.activeLabel}>{config.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactive}>
                  <MaterialIcons name={config.icon} size={24} color={colors.textSecondary} />
                  <Text style={[styles.inactiveLabel, { color: colors.textSecondary }]}>{config.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 8 },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: radii.xxl,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(8,145,178,0.12)',
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderRadius: radii.pill,
  },
  activeLabel: { color: '#fff', fontSize: 11, fontWeight: '800' },
  inactive: { alignItems: 'center', gap: 2, paddingVertical: 6 },
  inactiveLabel: { fontSize: 10, fontWeight: '600' },
});
