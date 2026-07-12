import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { getReportTypeLabel, isLeakageReport, ReportType } from '../services/reportTypes';

type Props = {
  type?: ReportType | string | null;
  style?: ViewStyle;
};

export function ReportTypeBadge({ type, style }: Props) {
  const normalized = type === 'non_leakage' ? 'non_leakage' : 'leakage';
  const isLeakage = isLeakageReport(normalized);

  return (
    <View
      style={[
        styles.badge,
        isLeakage ? styles.leakageBadge : styles.nonLeakageBadge,
        style,
      ]}
    >
      <Text style={[styles.text, isLeakage ? styles.leakageText : styles.nonLeakageText]}>
        {getReportTypeLabel(normalized)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  leakageBadge: {
    backgroundColor: '#ecfeff',
    borderColor: '#67e8f9',
  },
  nonLeakageBadge: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  leakageText: {
    color: '#155e75',
  },
  nonLeakageText: {
    color: '#3730a3',
  },
});

export default ReportTypeBadge;
