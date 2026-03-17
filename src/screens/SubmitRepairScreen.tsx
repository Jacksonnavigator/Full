import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTaskStore } from '../store/taskStore';
import {
  calculateDistanceInMeters,
  Coordinates,
  getCurrentLocation
} from '../utils/locationUtils';
import { showSuccessToast } from '../utils/toast';
import { submitRepairWork } from '../services/reportService_v2';
import { queueAction, setupNetworkListener } from '../services/offlineQueueService';
import * as Network from 'expo-network';

type Props = NativeStackScreenProps<RootStackParamList, 'SubmitRepair'>;

const GEOFENCE_RADIUS_METERS = 200;

export const SubmitRepairScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId));
  const role = useTaskStore((state) => state.currentUser?.role);
  const submitEngineerReport = useTaskStore((state) => state.submitEngineerReport);
  const leaderDirectResolve = useTaskStore((state) => state.leaderDirectResolve);

  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [materials, setMaterials] = useState<string[]>([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const MATERIAL_OPTIONS = [
    '100mm PVC pipe',
    '150mm PVC pipe',
    'Gasket set',
    'Gate valve',
    'Repair clamp',
    'Concrete / backfill',
    'Other'
  ];

  useEffect(() => {
    const fetchLocation = async () => {
      if (!task) return;
      const coords = await getCurrentLocation();
      if (coords) {
        setCurrentCoords(coords);
        const distance = calculateDistanceInMeters(coords, {
          latitude: task.latitude,
          longitude: task.longitude
        });
        setDistanceMeters(distance);
      }
    };

    fetchLocation();
  }, [task]);

  const pickImages = async (type: 'before' | 'after') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      if (type === 'before') {
        setBeforePhotos((prev) => [...prev, ...uris]);
      } else {
        setAfterPhotos((prev) => [...prev, ...uris]);
      }
    }
  };

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Task not found.</Text>
      </View>
    );
  }

  const withinGeofence =
    distanceMeters != null ? distanceMeters <= GEOFENCE_RADIUS_METERS : false;

  const formattedDistance =
    distanceMeters == null
      ? 'Checking location...'
      : `${distanceMeters.toFixed(0)} m from leak site`;

  const isEngineer = role === 'Engineer';
  const isLeader = role === 'Team Leader';

  const notesOk = notes.trim().length > 0;
  const photosOk = isLeader
    ? afterPhotos.length > 0 || beforePhotos.length > 0
    : afterPhotos.length > 0;

  const canSubmit = withinGeofence && notesOk && photosOk && !submitting;

  const handleSubmit = async () => {
    setAttemptedSubmit(true);

    if (!withinGeofence) {
      Alert.alert(
        'Too far from site',
        'You must be within 200 meters of the leak location to submit a repair.'
      );
      return;
    }

    if (!notesOk || !photosOk) {
      // Inline errors will be shown; no need for extra alerts
      return;
    }

    setSubmitting(true);
    try {
      const trimmedNotes = notes.trim();
      const selectedMaterials = materials;
      const networkState = await Network.getNetworkStateAsync();
      const isOnline = networkState.isConnected ?? false;

      if (role === 'Team Leader') {
        const photos = afterPhotos.length > 0 ? afterPhotos : beforePhotos;
        if (photos.length === 0) {
          Alert.alert('Missing photos', 'Please add at least one photo before submitting.');
          setSubmitting(false);
          return;
        }
        
        if (!isOnline) {
          // Queue the submission for later
          await queueAction('LEADER_RESOLVE', {
            taskId: task.id,
            notes: trimmedNotes,
            photos,
            timestamp: new Date().toISOString()
          });
          showSuccessToast('Submission queued. Will sync when online.');
        } else {
          leaderDirectResolve({
            taskId: task.id,
            notes: trimmedNotes,
            photos
          });
          showSuccessToast('Marked as resolved by Team Leader.');
        }
      } else {
        if (!isOnline) {
          // Queue the submission for later
          await queueAction('ENGINEER_SUBMIT', {
            taskId: task.id,
            notes: trimmedNotes,
            materials: selectedMaterials,
            beforePhotos,
            afterPhotos,
            timestamp: new Date().toISOString()
          });
          showSuccessToast('Submission queued. Will sync when online.');
          setupNetworkListener(); // Set up listener to process queue when online
        } else {
          submitEngineerReport({
            taskId: task.id,
            notes: trimmedNotes,
            materials: selectedMaterials,
            beforePhotos,
            afterPhotos
          });
          showSuccessToast('Repair submitted to Team Leader.');
        }
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting repair:', error);
      Alert.alert('Error', 'Failed to submit repair. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPhotoStrip = (title: string, photos: string[]) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sectionSubtitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {photos.map((uri, index) => (
          <Image
            key={`${uri}-${index}`}
            source={{ uri }}
            style={styles.photo}
          />
        ))}
        {photos.length === 0 && (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>No photos yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.taskId}>{task.id}</Text>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.geofenceRow}>
          <View
            style={[
              styles.geofencePill,
              withinGeofence ? styles.geofenceOk : styles.geofenceBlocked
            ]}
          >
            <Text
              style={[
                styles.geofenceText,
                withinGeofence ? styles.geofenceTextOk : styles.geofenceTextBlocked
              ]}
            >
              {withinGeofence ? 'Inside 200 m zone' : 'Outside 200 m zone'}
            </Text>
          </View>
          <Text style={styles.distance}>{formattedDistance}</Text>
        </View>
        {!withinGeofence && distanceMeters != null && (
          <Text style={styles.warningText}>
            Move closer to the leak location before submitting.
          </Text>
        )}
      </View>

      <View style={styles.stepsRow}>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCircleDone]}>
            <Text style={[styles.stepIndex, styles.stepIndexActive]}>1</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Go to site</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCircleDone]}>
            <Text style={[styles.stepIndex, styles.stepIndexActive]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Start task</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCircleDone]}>
            <Text style={[styles.stepIndex, styles.stepIndexActive]}>3</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Repair</Text>
        </View>
        <View style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              (task.status === 'Submitted by Engineer' ||
                task.status === 'Approved by Team Leader' ||
                task.status === 'Closed by Manager') &&
                styles.stepCircleDone
            ]}
          >
            <Text
              style={[
                styles.stepIndex,
                (task.status === 'Submitted by Engineer' ||
                  task.status === 'Approved by Team Leader' ||
                  task.status === 'Closed by Manager') &&
                  styles.stepIndexActive
              ]}
            >
              4
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              (task.status === 'Submitted by Engineer' ||
                task.status === 'Approved by Team Leader' ||
                task.status === 'Closed by Manager') &&
                styles.stepLabelActive
            ]}
          >
            Submit report
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <Text style={styles.sectionSubtitle}>
          Capture clear photos before and after repair for quality checks.
        </Text>

        {renderPhotoStrip('Before repair', beforePhotos)}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => pickImages('before')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>Add Before Photos</Text>
        </TouchableOpacity>

        {renderPhotoStrip('After repair', afterPhotos)}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => pickImages('after')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>Add After Photos</Text>
        </TouchableOpacity>

        {attemptedSubmit && !photosOk && (
          <Text style={styles.errorTextInline}>
            {isLeader
              ? 'Add at least one photo (before or after).'
              : 'Add at least one AFTER repair photo.'}
          </Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Repair Notes</Text>
        <Text style={styles.sectionSubtitle}>
          Include materials used, pipe size, valve IDs, and any follow-up actions.
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Example: Replaced 2m of 100mm PVC, flushed line, pressure test passed at 6 bar..."
          style={styles.notesInput}
          multiline
          textAlignVertical="top"
        />
        {attemptedSubmit && !notesOk && (
          <Text style={styles.errorTextInline}>Repair notes are required.</Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Materials used</Text>
        <Text style={styles.sectionSubtitle}>
          Tap to toggle items that were used during the repair.
        </Text>
        <View style={styles.chipRow}>
          {MATERIAL_OPTIONS.map((item) => {
            const selected = materials.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.materialChip, selected && styles.materialChipSelected]}
                onPress={() =>
                  setMaterials((prev) =>
                    prev.includes(item) ? prev.filter((m) => m !== item) : [...prev, item]
                  )
                }
              >
                <Text
                  style={[
                    styles.materialChipText,
                    selected && styles.materialChipTextSelected
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          !canSubmit && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!canSubmit}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Submit repair report"
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Submitting...' : 'Submit Repair'}
        </Text>
      </TouchableOpacity>
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
    backgroundColor: '#e0f2ff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14
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
    color: '#023e8a',
    marginBottom: 4
  },
  distance: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 8
  },
  warningText: {
    fontSize: 13,
    color: '#fed7aa',
    marginBottom: 12
  },
  geofenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  geofencePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  geofenceOk: {
    backgroundColor: '#14532d'
  },
  geofenceBlocked: {
    backgroundColor: '#7c2d12'
  },
  geofenceText: {
    fontSize: 11,
    fontWeight: '600'
  },
  geofenceTextOk: {
    color: '#bbf7d0'
  },
  geofenceTextBlocked: {
    color: '#fed7aa'
  },
  sectionCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827'
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151'
  },
  errorTextInline: {
    marginTop: 4,
    fontSize: 12,
    color: '#b91c1c'
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6
  },
  materialChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb'
  },
  materialChipSelected: {
    borderColor: '#0f5fff',
    backgroundColor: '#e0f2ff'
  },
  materialChipText: {
    fontSize: 12,
    color: '#374151'
  },
  materialChipTextSelected: {
    color: '#023e8a',
    fontWeight: '600'
  },
  photo: {
    width: 110,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#e5e7eb'
  },
  photoPlaceholder: {
    width: 160,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoPlaceholderText: {
    fontSize: 13,
    color: '#9ca3af'
  },
  notesInput: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9fafb',
    color: '#0f172a'
  },
  secondaryButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#0077b6'
  },
  secondaryButtonText: {
    color: '#0077b6',
    fontSize: 14,
    fontWeight: '500'
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#2a9d8f',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af'
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
  stepCircleDone: {
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

