import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTaskStore } from '../store/taskStore';
import { StatusBadge } from '../components/StatusBadge';
import { calculateDistanceInMeters, Coordinates, getCurrentLocation } from '../utils/locationUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId));
  const role = useTaskStore((state) => state.currentUser?.role);
  const startTaskAsEngineer = useTaskStore((state) => state.startTaskAsEngineer);
  const startTaskAsLeader = useTaskStore((state) => state.startTaskAsLeader);

  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const coords = await getCurrentLocation();
      if (coords && task) {
        setCurrentCoords(coords);
        const distance = calculateDistanceInMeters(
          coords,
          { latitude: task.latitude, longitude: task.longitude }
        );
        setDistanceMeters(distance);
      }
    };

    fetchLocation();
  }, [task]);

  if (!task) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Task not found.</Text>
        </View>
      );
  }

  const isEngineer = role === 'Engineer';
  const isLeader = role === 'Team Leader';

  const currentStep =
    task.status === 'New' || task.status === 'Assigned'
      ? 1
      : task.status === 'Rejected by Team Leader'
      ? 2
      : task.status === 'In Progress' || task.status === 'In Progress (Leader)'
      ? 3
      : 4;

  const canStart =
    isLeader
      ? task.status === 'Assigned'
      : task.status === 'Assigned' || task.status === 'Rejected by Team Leader';

  const canSubmitFromDetail =
    isLeader ? task.status === 'In Progress (Leader)' : task.status === 'In Progress';

  const renderStep = (label: string, index: number) => {
    const active = index <= currentStep;
    return (
      <View style={styles.stepItem} key={label}>
        <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
          <Text style={[styles.stepIndex, active && styles.stepIndexActive]}>{index}</Text>
        </View>
        <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
      </View>
    );
  };

  const formattedDistance =
    distanceMeters == null
      ? 'Locating...'
      : distanceMeters < 1000
      ? `${distanceMeters.toFixed(0)} m away`
      : `${(distanceMeters / 1000).toFixed(2)} km away`;

  const handleStartTask = () => {
    if (!task || !canStart) return;
    if (isLeader) {
      startTaskAsLeader(task.id);
      Alert.alert('Task started', 'You are now working on this task as Team Leader.');
      return;
    }
    // Engineer
    startTaskAsEngineer(task.id);
    Alert.alert('Task started', 'Status updated to In Progress.');
  };

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  const handleOpenSubmitRepair = () => {
    if (!canSubmitFromDetail) {
      return;
    }
    navigation.navigate('SubmitRepair', { taskId: task.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.taskId}>{task.id}</Text>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.subtitle}>{task.description}</Text>
        </View>
        <View style={styles.headerBadges}>
          <StatusBadge label={task.priority} variant="priority" />
          <StatusBadge
            label={task.status}
            variant="status"
            style={{ marginTop: 6 }}
          />
        </View>
      </View>

      <View style={styles.stepsRow} accessibilityRole="summary">
        {renderStep('Go to site', 1)}
        {renderStep('Start task', 2)}
        {renderStep('Repair', 3)}
        {renderStep('Submit report', 4)}
      </View>

      <View style={styles.infoRowCard}>
        <View>
          <Text style={styles.infoLabel}>Assigned team</Text>
          <Text style={styles.infoValue}>{task.assignedTeam}</Text>
        </View>
        <View>
          <Text style={styles.infoLabel}>Team leader</Text>
          <Text style={styles.infoValue}>{task.teamLeader}</Text>
        </View>
        <View>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>{formattedDistance}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.sectionSubtitle}>
          Verify you are at the right leak before starting work.
        </Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: task.latitude,
              longitude: task.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
          >
            <Marker
              coordinate={{ latitude: task.latitude, longitude: task.longitude }}
              title={task.title}
              description={task.description}
            />
            {currentCoords && (
              <>
                <Marker
                  coordinate={currentCoords}
                  title="Your location"
                  pinColor="blue"
                />
                <Circle
                  center={{ latitude: task.latitude, longitude: task.longitude }}
                  radius={200}
                  strokeColor="#0077b6"
                  fillColor="#0077b620"
                />
              </>
            )}
          </MapView>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Reporter photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {task.reporterPhotos.map((uri, index) => (
            <Image
              key={`${uri}-${index}`}
              source={{ uri }}
              style={styles.photo}
            />
          ))}
          {task.reporterPhotos.length === 0 && (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>No photos provided.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <View style={styles.timelineContainer}>
          {task.timeline
            .slice()
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
            .map((entry, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStatus}>{entry.status}</Text>
                  <Text style={styles.timelineTimestamp}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </Text>
                  {entry.note ? (
                    <Text style={styles.timelineNote}>{entry.note}</Text>
                  ) : null}
                </View>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.actionsCard}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !canStart && styles.primaryButtonDisabled
            ]}
            onPress={handleStartTask}
            disabled={!canStart}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Start this task"
          >
            <Text style={styles.primaryButtonText}>
              {task.status === 'In Progress' || task.status === 'In Progress (Leader)'
                ? 'Task In Progress'
                : 'Start Task'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleOpenInMaps}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Open in Google Maps</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleOpenSubmitRepair}
          activeOpacity={0.85}
          disabled={!canSubmitFromDetail}
          accessibilityRole="button"
          accessibilityLabel="Open submit repair screen"
        >
          <Text style={styles.submitButtonText}>
            {role === 'Team Leader' ? 'Resolve & Submit (Leader)' : 'Submit Repair Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6ff'
  },
  content: {
    padding: 16,
    paddingBottom: 24
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f6ff'
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444'
  },
  headerCard: {
    flexDirection: 'row',
    marginBottom: 14,
    backgroundColor: '#e0f2ff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  taskId: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#023e8a'
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b'
  },
  headerBadges: {
    marginLeft: 12,
    alignItems: 'flex-end'
  },
  infoRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827'
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827'
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10
  },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8
  },
  map: {
    flex: 1
  },
  photo: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#e5e7eb'
  },
  photoPlaceholder: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoPlaceholderText: {
    fontSize: 13,
    color: '#9ca3af'
  },
  timelineContainer: {
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 12,
    marginTop: 6
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0077b6',
    marginRight: 8,
    marginTop: 4
  },
  timelineContent: {
    flex: 1
  },
  timelineStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827'
  },
  timelineTimestamp: {
    fontSize: 12,
    color: '#6b7280'
  },
  timelineNote: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 2
  },
  actionsCard: {
    backgroundColor: '#f3f6ff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0077b6',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center'
  },
  primaryButtonDisabled: {
    backgroundColor: '#9ca3af'
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0077b6',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#0077b6',
    fontSize: 15,
    fontWeight: '600'
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#2a9d8f',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 4
  },
  stepItem: {
    alignItems: 'center',
    flex: 1
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  stepCircleActive: {
    backgroundColor: '#0f5fff',
    borderColor: '#0f5fff'
  },
  stepIndex: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },
  stepIndexActive: {
    color: '#ffffff'
  },
  stepLabel: {
    marginTop: 4,
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center'
  },
  stepLabelActive: {
    color: '#0f172a',
    fontWeight: '600'
  }
});

