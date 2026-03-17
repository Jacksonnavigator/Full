import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// NEW: Import new architecture components
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@/hooks/useQuery';
import { ReportService } from '@/services/api/reports';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, borderRadius, spacing, shadows, fontWeight } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportAssignment'>;

interface Team {
  id: string;
  name: string;
  description?: string;
}

interface Engineer {
  id: string;
  name: string;
  role: string;
}

export const DMAReportAssignmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reportId } = route.params;
  const { currentUser } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedEngineer, setSelectedEngineer] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  // Animation effect
  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  // Get report details
  const {
    data: report,
    isLoading: reportLoading,
    error: reportError
  } = useQuery(
    ['report', reportId],
    () => ReportService.getReportDetail(reportId),
    {
      enabled: !!reportId,
    }
  ) as { data: any, isLoading: boolean, error: any };

  // Get teams for this DMA
  const {
    data: teams,
    isLoading: teamsLoading
  } = useQuery(
    ['teams', currentUser?.dma_id],
    () => fetchTeamsForDMA(currentUser?.dma_id || ''),
    {
      enabled: !!currentUser?.dma_id,
    }
  ) as { data: Team[] | undefined, isLoading: boolean };

  // Get engineers for selected team
  const {
    data: engineers,
    isLoading: engineersLoading
  } = useQuery(
    ['engineers', selectedTeam],
    () => fetchEngineersForTeam(selectedTeam),
    {
      enabled: !!selectedTeam,
    }
  ) as { data: Engineer[] | undefined, isLoading: boolean };

  // Mock functions - replace with actual API calls
  async function fetchTeamsForDMA(dmaId: string): Promise<Team[]> {
    // TODO: Implement actual API call
    return [
      { id: 'team1', name: 'Team Alpha', description: 'Main repair team' },
      { id: 'team2', name: 'Team Beta', description: 'Specialized team' },
    ];
  }

  async function fetchEngineersForTeam(teamId: string): Promise<Engineer[]> {
    // TODO: Implement actual API call
    return [
      { id: 'eng1', name: 'John Engineer', role: 'engineer' },
      { id: 'eng2', name: 'Jane Engineer', role: 'engineer' },
      { id: 'lead1', name: 'Bob Leader', role: 'team_leader' },
    ];
  }

  const handleAssign = async () => {
    if (!selectedTeam || !selectedEngineer) {
      Alert.alert('Missing Selection', 'Please select both a team and an engineer.');
      return;
    }

    setIsAssigning(true);
    try {
      await ReportService.assignReport(reportId, {
        team_id: selectedTeam,
        engineer_id: selectedEngineer,
      });

      Alert.alert(
        'Success',
        'Report has been assigned successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Assignment Failed', error.message || 'Failed to assign report');
    } finally {
      setIsAssigning(false);
    }
  };

  const renderTeamOption = (team: Team) => (
    <TouchableOpacity
      key={team.id}
      style={[
        styles.optionCard,
        selectedTeam === team.id && styles.optionCardSelected
      ]}
      onPress={() => {
        setSelectedTeam(team.id);
        setSelectedEngineer(''); // Reset engineer selection
      }}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionHeader}>
          <Text style={styles.optionTitle}>{team.name}</Text>
          {selectedTeam === team.id && (
            <Ionicons name="checkmark-circle" size={20} color={colors.brandPrimary} />
          )}
        </View>
        {team.description && (
          <Text style={styles.optionDescription}>{team.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEngineerOption = (engineer: Engineer) => (
    <TouchableOpacity
      key={engineer.id}
      style={[
        styles.optionCard,
        selectedEngineer === engineer.id && styles.optionCardSelected
      ]}
      onPress={() => setSelectedEngineer(engineer.id)}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionHeader}>
          <Text style={styles.optionTitle}>{engineer.name}</Text>
          <View style={styles.roleContainer}>
            <Badge
              label={engineer.role === 'team_leader' ? 'Leader' : 'Engineer'}
              variant={engineer.role === 'team_leader' ? 'info' : 'default'}
              size="small"
            />
            {selectedEngineer === engineer.id && (
              <Ionicons name="checkmark-circle" size={20} color={colors.brandPrimary} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (reportLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading report details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (reportError || !report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load report</Text>
          <Button label="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandPrimary} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <LinearGradient
          colors={[colors.brandPrimary, colors.brandSecondary]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Assign Report</Text>
            <Text style={styles.headerSubtitle}>{report.tracking_id}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.content, { opacity: contentAnim, transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Summary */}
        <Card style={styles.reportCard}>
          <Text style={styles.sectionTitle}>Report Details</Text>
          <Text style={styles.reportDescription}>{report.description}</Text>
          <View style={styles.reportMeta}>
            <Text style={styles.reportMetaText}>Priority: {report.priority}</Text>
            <Text style={styles.reportMetaText}>Status: {report.status}</Text>
          </View>
        </Card>

        {/* Team Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Team</Text>
          {teamsLoading ? (
            <Text style={styles.loadingText}>Loading teams...</Text>
          ) : (
            teams?.map(renderTeamOption)
          )}
        </View>

        {/* Engineer Selection */}
        {selectedTeam && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Engineer</Text>
            {engineersLoading ? (
              <Text style={styles.loadingText}>Loading engineers...</Text>
            ) : (
              engineers?.map(renderEngineerOption)
            )}
          </View>
        )}

        {/* Assign Button */}
        <View style={styles.actionsContainer}>
          <Button
            label="Assign Report"
            onPress={handleAssign}
            loading={isAssigning}
            disabled={!selectedTeam || !selectedEngineer}
            style={styles.assignButton}
          />
          <Button
            label="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.cancelButton}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    marginBottom: spacing.md,
  },
  header: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.lg,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  reportCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  reportDescription: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportMetaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionCardSelected: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.cardLight,
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  optionTitle: {
    ...typography.h4,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.textMuted,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionsContainer: {
    marginTop: spacing.xl,
  },
  assignButton: {
    marginBottom: spacing.md,
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default DMAReportAssignmentScreen;