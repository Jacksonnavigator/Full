import { spacing } from './tokens';

/** Shared horizontal inset for tab screens (App.tsx already applies top safe area). */
export const SCREEN_PADDING_H = spacing.md;

/** Top inset inside scroll content — keep minimal under app safe area. */
export const SCREEN_PADDING_TOP = spacing.xs;

/** Gap between stacked sections/cards. */
export const SCREEN_SECTION_GAP = spacing.sm + 2;

/** Extra scroll padding beyond tab bar + home indicator. */
export const TAB_SCROLL_EXTRA = spacing.sm;

/** Visual height of floating tab bar (excluding bottom safe inset). */
export const TAB_BAR_HEIGHT = 62;
