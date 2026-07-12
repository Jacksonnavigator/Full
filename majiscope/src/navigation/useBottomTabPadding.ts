import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Visual height of the floating tab bar (excluding bottom safe inset). */
export const TAB_BAR_HEIGHT = 72;

/** Bottom padding for scroll views so content clears the floating tab bar. */
export function useBottomTabPadding(extra = 24): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8) + extra;
}
