import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { BrandWordmark } from '../shared/BrandWordmark';
import { borderRadius, colors, spacing, typography } from '../../theme';

export type DMAHeroStat = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
};

type DMAHeroCardProps = {
  title: string;
  chipLabel: string;
  primaryMeta: string;
  secondaryMeta?: string;
  statusLabel?: string;
  statusValue?: string;
  avatarText?: string;
  stats?: DMAHeroStat[];
  children?: React.ReactNode;
};

export const DMAHeroCard: React.FC<DMAHeroCardProps> = ({
  title,
  chipLabel,
  primaryMeta,
  secondaryMeta,
  statusLabel,
  statusValue,
  avatarText = 'DM',
  stats = [],
  children,
}) => (
  <LinearGradient
    colors={['#0f172a', '#155e75', '#2563eb']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.heroCard}
  >
    <View style={styles.heroGlowLarge} />
    <View style={styles.heroGlowSmall} />

    <View style={styles.heroBody}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarText}</Text>
        </View>
        <View style={styles.statusDot} />
      </View>

      <View style={styles.heroInfo}>
        <BrandWordmark size="sm" surface="dark" centered={false} />
        <Text style={styles.heroName}>{title}</Text>
        <View style={styles.roleChip}>
          <Text style={styles.roleChipText}>{chipLabel}</Text>
        </View>
        <Text style={styles.heroMeta}>{primaryMeta}</Text>
        {secondaryMeta ? <Text style={styles.heroMeta}>{secondaryMeta}</Text> : null}
      </View>

      {statusLabel && statusValue ? (
        <View style={styles.statusCard}>
          <Text style={styles.statusCardLabel}>{statusLabel}</Text>
          <Text style={styles.statusCardValue}>{statusValue}</Text>
        </View>
      ) : null}
    </View>

    {stats.length > 0 ? (
      <View style={styles.heroStatsRow}>
        {stats.map((stat) => (
          <View key={`${stat.label}-${stat.value}`} style={styles.heroStat}>
            <Ionicons name={stat.icon} size={18} color="#ffffff" />
            <Text style={styles.heroStatNumber}>{stat.value}</Text>
            <Text style={styles.heroStatLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    ) : null}

    {children ? <View style={styles.heroFooter}>{children}</View> : null}
  </LinearGradient>
);

type DMASectionHeadingProps = {
  label: string;
  count?: string;
};

export const DMASectionHeading: React.FC<DMASectionHeadingProps> = ({ label, count }) => (
  <View style={styles.sectionLabelRow}>
    <Text style={styles.sectionLabel}>{label}</Text>
    {count ? <Text style={styles.sectionCount}>{count}</Text> : null}
  </View>
);

type DMATileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  tone: string;
};

export const DMATile: React.FC<DMATileProps> = ({ icon, label, value, tone }) => (
  <View style={styles.tile}>
    <View style={[styles.tileIconWrap, { backgroundColor: `${tone}12` }]}>
      <Ionicons name={icon} size={18} color={tone} />
    </View>
    <Text style={[styles.tileValue, { color: tone }]}>{value}</Text>
    <Text style={styles.tileLabel}>{label}</Text>
  </View>
);

type DMADetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export const DMADetailRow: React.FC<DMADetailRowProps> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabelWrap}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export const getDMAInitials = (value?: string | null) =>
  String(value || 'DMA')
    .split(' ')
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

const styles = StyleSheet.create({
  heroCard: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -70,
    right: -36,
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -24,
    left: -10,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0f172a',
    backgroundColor: '#34d399',
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  roleChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  roleChipText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '700',
  },
  heroMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
  },
  statusCard: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statusCardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusCardValue: {
    marginTop: 2,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '800',
  },
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
  },
  heroStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  heroFooter: {
    marginTop: 12,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionCount: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  tile: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileValue: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  tileLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  detailLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
});

export const dmaChromeStyles = styles;
