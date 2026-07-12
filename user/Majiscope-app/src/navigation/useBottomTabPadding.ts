import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT, TAB_SCROLL_EXTRA } from '../theme/screenLayout';

export { TAB_BAR_HEIGHT };

/** Bottom padding for scroll views so content clears the floating tab bar. */
export function useBottomTabPadding(extra = TAB_SCROLL_EXTRA): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 6) + extra;
}
