import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { gradients, radii } from '../../theme/tokens';

interface StepProgressProps {
  steps: string[];
  completedCount: number;
  currentLabel?: string;
}

export default function StepProgress({ steps, completedCount, currentLabel }: StepProgressProps) {
  const { colors } = useTheme();
  const total = steps.length;
  const progress = Math.min(completedCount / total, 1);
  const activeIndex = Math.min(completedCount, total - 1);
  const label = currentLabel || steps[activeIndex] || steps[0];

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.row}>
        <Text style={[styles.stepMeta, { color: colors.textSecondary }]}>
          Step {Math.min(completedCount + 1, total)} of {total}
        </Text>
        <Text style={[styles.stepLabel, { color: colors.primary }]}>{label}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <LinearGradient
          colors={[...gradients.button]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${Math.max(progress * 100, 4)}%` }]}
        />
      </View>
      <View style={styles.dots}>
        {steps.map((step, index) => {
          const done = index < completedCount;
          const current = index === activeIndex && !done;
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
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepMeta: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stepLabel: { fontSize: 15, fontWeight: '800' },
  track: { height: 8, borderRadius: radii.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill },
  dots: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 2 },
  dotItem: { flex: 1, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  dotDone: { width: 12, height: 12, borderRadius: 6 },
});
