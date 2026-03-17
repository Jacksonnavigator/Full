import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface CustomTabBarProps extends BottomTabBarProps {
  onFabPress?: (event: GestureResponderEvent) => void;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  onFabPress,
}) => {
  const fabScale = React.useRef(new Animated.Value(1)).current;

  const handleFabPress = (event: GestureResponderEvent) => {
    // Animate FAB press
    Animated.sequence([
      Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (onFabPress) {
      onFabPress(event);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        {state.routes
          .slice(0, -1) // Exclude the last tab (hidden)
          .map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = {
                preventDefault: () => {},
              } as any;

              if (isFocused) {
                // Route is already focused, do nothing
              } else {
                navigation.navigate(route.name);
              }
            };

            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            if (route.name === 'Tasks' || route.name === 'TeamTasks') {
              iconName = isFocused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'Activity') {
              iconName = isFocused ? 'pulse' : 'pulse-outline';
            } else if (route.name === 'Review') {
              iconName = isFocused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === 'Resolve') {
              iconName = isFocused ? 'hammer' : 'hammer-outline';
            } else if (route.name === 'Performance') {
              iconName = isFocused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Notifications') {
              iconName = isFocused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = isFocused ? 'person' : 'person-outline';
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? colors.brandPrimary : colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
      </View>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [{ scale: fabScale }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={handleFabPress}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.cardLight,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 8 : 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    height: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
