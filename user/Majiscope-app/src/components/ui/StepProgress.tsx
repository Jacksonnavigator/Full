import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { gradients, radii } from '../../theme/tokens';

interface StepProgressProps {
  steps: string[];
  completedCount: number;
  /** Index (0-based) of the step the user should focus on next. */
  currentStepIndex: number;
}

export default function StepProgress({ steps, completedCount, currentStepIndex }: StepProgressProps) {
  const { colors } = useTheme();
  const total = steps.length;
  const safeIndex = Math.min(Math.max(currentStepIndex, 0), total - 1);
  const progress = Math.min(completedCount / total, 1);
  const allDone = completedCount >= total;
  const label = allDone ? 'Ready to submit' : steps[safeIndex];

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card }]}>
      <View style={styles.row}>
        <Text style={[styles.stepMeta, { color: colors.textSecondary }]}>
          {allDone ? 'All steps complete' : `Step ${safeIndex + 1} of ${total}`}
        </Text>
        <Text style={[styles.stepLabel, { color: colors.primary }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <LinearGradient
          colors={[...gradients.button]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${Math.max(progress * 100, allDone ? 100 : 6)}%` }]}
        />
      </View>
      <View style={styles.dots}>
        {steps.map((step, index) => {
          const done = index < completedCount;
          const current = index === safeIndex && !allDone;
          return (
            <View key={step} style={styles.dotItem}>
              {done ? (
                <LinearGradient colors={[...gradients.accent]} style={styles.dotDone} />
              ) : (
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: current ? colors.primaryMuted : colors.surface,
                      borderColor: current ? colors.primary : colors.border,
                      transform: [{ scale: current ? 1.15 : 1 }],
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 0,
    borderRadius: radii.lg,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepMeta: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flexShrink: 0,
  },
  stepLabel: { fontSize: 14, fontWeight: '800', flex: 1, textAlign: 'right' },
  track: { height: 8, borderRadius: radii.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill },
  dots: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 2 },
  dotItem: { flex: 1, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  dotDone: { width: 10, height: 10, borderRadius: 5 },
});
