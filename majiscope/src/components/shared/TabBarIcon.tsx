import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

type Props = {
  focused: boolean;
  color: string;
  size: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
};

export function TabBarIcon({ focused, color, size, icon, iconOutline }: Props) {
  if (focused) {
    return (
      <LinearGradient colors={['#0891b2', '#06b6d4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.pill}>
        <Ionicons name={icon} size={size - 1} color="#fff" />
      </LinearGradient>
    );
  }
  return (
    <View style={styles.inactive}>
      <Ionicons name={iconOutline} size={size} color={color} />
    </View>
  );
}

export const floatingTabBarStyle = {
  position: 'absolute' as const,
  left: 16,
  right: 16,
  bottom: Platform.OS === 'ios' ? 12 : 10,
  paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  paddingTop: 8,
  height: Platform.OS === 'ios' ? 78 : 64,
  backgroundColor: 'rgba(255,255,255,0.98)',
  borderRadius: 28,
  borderTopWidth: 0,
  borderWidth: 1,
  borderColor: 'rgba(8,145,178,0.14)',
  elevation: 14,
  shadowColor: '#0891b2',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.18,
  shadowRadius: 20,
};

const styles = StyleSheet.create({
  pill: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: { paddingVertical: 4 },
});
