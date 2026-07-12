import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Circle, Marker, Polygon, Polyline } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTaskStore } from '../store/taskStore';
import AppHeader from '../components/AppHeader';
import { useAuthStore } from '../store/authStore';
import { calculateDistanceInMeters, Coordinates, getCurrentLocation } from '../utils/locationUtils';
import { showSuccessToast } from '../utils/toast';
import {
  fetchUtilityPipeNetworkPreview,
  toUtilityPipeNetworkOverlay,
  UtilityPipeNetworkPreview,
} from '../services/utilityPipeNetworkService';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SubmitRepair'>;

const GEOFENCE_BASE_RADIUS_METERS = 200;
const MAX_ACCURACY_BUFFER_METERS = 150;

export const SubmitRepairScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId));
  const role = useTaskStore((state) => state.currentUser?.role);
  const submitEngineerReport = useTaskStore((state) => state.submitEngineerReport);
  const leaderDirectResolve = useTaskStore((state) => state.leaderDirectResolve);
  const isOffline = useTaskStore((state) => state.isOffline);
  const authUtilityId = useAuthStore(
    (state) => state.currentUser?.utility_id || (state.currentUser as any)?.utilityId || null
  );
  const mapRef = useRef<MapView | null>(null);

  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [materials, setMaterials] = useState<string[]>([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [pipeNetworkPreview, setPipeNetworkPreview] = useState<UtilityPipeNetworkPreview | null>(null);
  const [loadingPipeNetwork, setLoadingPipeNetwork] = useState(false);
  const [pipeNetworkMessage, setPipeNetworkMessage] = useState<string | null>(null);

  const { language } = useAppLanguage();

  const MATERIAL_OPTIONS = [
    '100mm PVC pipe',
    '150mm PVC pipe',
    'Gasket set',
    'Gate valve',
    'Repair clamp',
    'Concrete / backfill',
    'Other',
  ];

  useEffect(() => {
    void refreshLocation();
  }, [task]);

  useEffect(() => {
    let isActive = true;

    const loadPipeNetwork = async () => {
      if (!authUtilityId) {
        if (isActive) {
          setPipeNetworkPreview(null);
          setPipeNetworkMessage(null);
        }
        return;
      }

      setLoadingPipeNetwork(true);
      try {
        const preview = await fetchUtilityPipeNetworkPreview(authUtilityId);
        if (!isActive) return;

        setPipeNetworkPreview(preview);
        setPipeNetworkMessage(
          preview
            ? 'Utility pipe network overlay loaded for this repair site.'
            : 'No previewable utility pipe network is uploaded for this utility yet.'
        );
      } catch (error) {
        console.warn('Unable to load utility pipe network preview:', error);
        if (!isActive) return;
        setPipeNetworkPreview(null);
        setPipeNetworkMessage('Pipe network could not be loaded right now.');
      } finally {
        if (isActive) {
          setLoadingPipeNetwork(false);
        }
      }
    };

    void loadPipeNetwork();

    return () => {
      isActive = false;
    };
  }, [authUtilityId]);

  const refreshLocation = async () => {
    if (!task) return;

    setLocating(true);
    try {
      const coords = await getCurrentLocation();
      if (!coords) return;

      setCurrentCoords(coords);
      setDistanceMeters(
        calculateDistanceInMeters(coords, {
          latitude: task.latitude,
          longitude: task.longitude,
        })
      );
    } finally {
      setLocating(false);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAfterPhotos((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to capture repair evidence.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setAfterPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Task not found.</Text>
      </View>
    );
  }

  const accuracyBuffer = Math.min(currentCoords?.accuracy ?? 0, MAX_ACCURACY_BUFFER_METERS);
  const effectiveRadius = GEOFENCE_BASE_RADIUS_METERS + accuracyBuffer;
  const withinGeofence = distanceMeters != null ? distanceMeters <= effectiveRadius : false;

  const formattedDistance =
    distanceMeters == null
      ? locating
        ? 'Refreshing location...'
        : 'Checking location...'
      : `${distanceMeters.toFixed(0)} m from leak site`;

  const formattedAccuracy =
    currentCoords?.accuracy != null
      ? `GPS accuracy about ${Math.round(currentCoords.accuracy)} m`
      : 'GPS accuracy still loading';

  const isLeader = role === 'Team Leader';
  const notesOk = notes.trim().length > 0;
  const photosOk = afterPhotos.length > 0;
  const canSubmit = withinGeofence && notesOk && photosOk && !submitting;

  const summaryCards = [
    {
      label: 'Work zone',
      value: withinGeofence ? 'Inside range' : 'Outside range',
      icon: 'locate-outline' as const,
      tone: withinGeofence ? '#16a34a' : '#dc2626',
    },
    {
      label: 'Distance',
      value: formattedDistance,
      icon: 'navigate-outline' as const,
      tone: '#2563eb',
    },
    {
      label: 'Allowance',
      value: `${Math.round(effectiveRadius)} m`,
      icon: 'radio-outline' as const,
      tone: '#7c3aed',
    },
  ];

  const pipeNetworkOverlay = useMemo(
    () => toUtilityPipeNetworkOverlay(pipeNetworkPreview),
    [pipeNetworkPreview]
  );

  useEffect(() => {
    if (!task || !mapRef.current) return;

    const coordinates = [
      { latitude: task.latitude, longitude: task.longitude },
      ...pipeNetworkOverlay.bounds,
      ...(currentCoords ? [currentCoords] : []),
    ];

    if (coordinates.length === 0) return;

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
      animated: true,
    });
  }, [currentCoords, pipeNetworkOverlay.bounds, task]);

  const handleSubmit = async () => {
    setAttemptedSubmit(true);

    if (!withinGeofence) {
      Alert.alert(
        'Too far from site',
        `You must be close to the leak location to submit. Current allowance: ${Math.round(effectiveRadius)} meters.`
      );
      return;
    }

    if (!notesOk || !photosOk) {
      return;
    }

    setSubmitting(true);
    try {
      const trimmedNotes = notes.trim();

      if (isLeader) {
        await leaderDirectResolve({
          taskId: task.id,
          notes: trimmedNotes,
          photos: afterPhotos,
        });
        showSuccessToast(
          isOffline ? 'Submission queued. Will sync when online.' : 'Sent for DMA approval.'
        );
      } else {
        await submitEngineerReport({
          taskId: task.id,
          notes: trimmedNotes,
          materials,
          beforePhotos: [],
          afterPhotos,
        });
        showSuccessToast(
          isOffline ? 'Submission queued. Will sync when online.' : 'Repair submitted for team leader review.'
        );
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error submitting repair:', error);
      Alert.alert('Error', 'Failed to submit repair. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroGlowLarge} />
        <View style={styles.heroGlowSmall} />
        <Text style={styles.taskId}>{task.trackingId || task.id}</Text>
          <AppHeader
            title={task ? task.title : getText(language, 'Submit Repair', 'Tuma Ukarabati')}
            subtitle={task ? task.description : getText(language, 'Report repair details and evidence.', 'Ripoti maelezo ya ukarabati na ushahidi.')}
          />
      </View>

      <View style={styles.summaryRow}>
        {summaryCards.map((card) => (
          <View key={card.label} style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: `${card.tone}14` }]}>
              <Ionicons name={card.icon} size={18} color={card.tone} />
            </View>
            <Text style={styles.summaryLabel}>{card.label}</Text>
            <Text style={styles.summaryValue}>{card.value}</Text>
          </View>
        ))}
      </View>

      {!withinGeofence && distanceMeters != null && (
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={18} color="#b45309" />
          <Text style={styles.warningText}>
            Refresh your location if you are already on site. The app now adds a GPS accuracy buffer to reduce false blocks.
          </Text>
        </View>
      )}

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Site Verification</Text>
            <Text style={styles.sectionSubtitle}>
              Keep the location details visible here while you capture the repair evidence.
            </Text>
          </View>
        </View>

        <View style={styles.locationFactsGrid}>
          <View style={styles.locationFactCard}>
            <Text style={styles.locationFactLabel}>Reported site</Text>
            <Text style={styles.locationFactValue}>{task.address?.trim() || task.title}</Text>
          </View>
          <View style={styles.locationFactCard}>
            <Text style={styles.locationFactLabel}>Leak coordinates</Text>
            <Text style={styles.locationFactValue}>
              {`${task.latitude.toFixed(5)}, ${task.longitude.toFixed(5)}`}
            </Text>
          </View>
          <View style={styles.locationFactCard}>
            <Text style={styles.locationFactLabel}>Your GPS</Text>
            <Text style={styles.locationFactValue}>
              {currentCoords
                ? `${currentCoords.latitude.toFixed(5)}, ${currentCoords.longitude.toFixed(5)}`
                : 'Still checking your current location'}
            </Text>
          </View>
        </View>

        <View style={styles.siteMapWrap}>
          <View style={styles.siteMapHeader}>
            <View>
              <Text style={styles.siteMapTitle}>Repair Map Context</Text>
              <Text style={styles.siteMapSubtitle}>
                Confirm the leak point, your live GPS, and the uploaded utility pipe network before you submit.
              </Text>
            </View>
            {loadingPipeNetwork ? (
              <View style={styles.siteMapStatusPill}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.siteMapStatusText}>Loading</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.siteMapContainer}>
            <MapView
              ref={mapRef}
              style={styles.siteMap}
              initialRegion={{
                latitude: task.latitude,
                longitude: task.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              showsMyLocationButton
              toolbarEnabled={false}
            >
              {pipeNetworkOverlay.polygons.map((coordinates, index) => (
                <Polygon
                  key={`submit-pipe-polygon-${index}`}
                  coordinates={coordinates}
                  strokeColor="#0f766e"
                  fillColor="#14b8a61f"
                  strokeWidth={2}
                />
              ))}
              {pipeNetworkOverlay.lines.map((coordinates, index) => (
                <Polyline
                  key={`submit-pipe-line-${index}`}
                  coordinates={coordinates}
                  strokeColor="#0f766e"
                  strokeWidth={3}
                />
              ))}
              {pipeNetworkOverlay.points.map((coordinate, index) => (
                <Marker
                  key={`submit-pipe-point-${index}`}
                  coordinate={coordinate}
                  pinColor="#0f766e"
                  title={getText(language, 'Utility pipe network point', 'Sehemu ya mtandao wa bomba')}
                />
              ))}
              <Marker coordinate={{ latitude: task.latitude, longitude: task.longitude }} title={task.title} />
              <Circle
                center={{ latitude: task.latitude, longitude: task.longitude }}
                radius={effectiveRadius}
                strokeColor="#38bdf8"
                fillColor="rgba(56,189,248,0.12)"
              />
            </MapView>
          </View>

          <Text style={styles.siteMapMetaText}>
            {loadingPipeNetwork
              ? getText(language, 'Loading utility pipe network...', 'Inapakia mtandao wa bomba...')
              : pipeNetworkMessage || getText(language, 'Utility pipe network unavailable', 'Mtandao wa bomba haupatikani')}
          </Text>
          <Text style={styles.siteMapMetaText}>
            {getText(
              language,
              'Green lines show the uploaded utility pipe network around the repair site.',
              'Mstari wa kijani unaonyesha mtandao wa bomba uliopakiwa karibu na eneo la ukarabati.'
            )}
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderStack}>
          <View>
            <Text style={styles.sectionTitle}>{getText(language, 'Completion Photos', 'Picha za Kumaliza')}</Text>
            <Text style={styles.sectionSubtitle}>
              {getText(
                language,
                'Only the repaired result is required. Before photos are no longer part of this flow.',
                'Matokeo yaliyorekebishwa pekee ndiyo yanayohitajika. Picha za kabla hazihitajiki tena.'
              )}
            </Text>
          </View>
          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.secondaryChip} onPress={takePhoto} activeOpacity={0.85}>
              <Ionicons name="camera-outline" size={15} color={colors.primary} />
              <Text style={styles.secondaryChipText}>{getText(language, 'Camera', 'Kamera')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addChip} onPress={pickImages} activeOpacity={0.85}>
              <Ionicons name="images-outline" size={15} color="#ffffff" />
              <Text style={styles.addChipText}>{getText(language, 'Gallery', 'Ghala ya Picha')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.captureHint}>
          {getText(
            language,
            'Use the camera when you are on site, or pick existing repair photos from the gallery.',
            'Tumia kamera ukiwa kwenye eneo, au chagua picha zilizopo kutoka kwenye ghala ya picha.'
          )}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroll}>
          {afterPhotos.map((uri, index) => (
            <Image key={`${uri}-${index}`} source={{ uri }} style={styles.photo} />
          ))}
          {afterPhotos.length === 0 && (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={26} color="#94a3b8" />
              <Text style={styles.photoPlaceholderText}>{getText(language, 'No completion photos yet.', 'Hakuna picha za kumaliza bado.')}</Text>
            </View>
          )}
        </ScrollView>

        {attemptedSubmit && !photosOk && (
          <Text style={styles.errorTextInline}>Add at least one completion photo before submitting.</Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{getText(language, 'Repair Notes', 'Maandishi ya Ukarabati')}</Text>
        <Text style={styles.sectionSubtitle}>
          {getText(
            language,
            'Explain what was fixed, the parts used, and anything the next team should know.',
            'Eleza kile kilichorekebishwa, sehemu zilizotumika, na chochote timu inayofuata inapaswa kujua.'
          )}
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={getText(
            language,
            'Example: Replaced 2m of 100mm PVC, flushed line, pressure test passed...',
            'Mfano: Nimebadilisha mita 2 ya bomba la 100mm PVC, nimeosha laini, jaribio la shinikizo limfanikiwa...'
          )}
          style={styles.notesInput}
          multiline
          textAlignVertical="top"
        />
        {attemptedSubmit && !notesOk && (
          <Text style={styles.errorTextInline}>{getText(language, 'Repair notes are required.', 'Maandishi ya ukarabati yanahitajika.')}</Text>
        )}
      </View>

      {!isLeader && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{getText(language, 'Materials Used', 'Vifaa Vilivyotumika')}</Text>
          <Text style={styles.sectionSubtitle}>
            {getText(
              language,
              'Tap any item used during the repair. This helps the leader review the field work faster.',
              'Gusa kipengee chochote kilichotumika wakati wa ukarabati. Hii inamsaidia kiongozi kuona kazi ya uwanjani haraka.'
            )}
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
                  activeOpacity={0.85}
                >
                  <Text style={[styles.materialChipText, selected && styles.materialChipTextSelected]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
        activeOpacity={0.85}
      >
        <Ionicons name="checkmark-done-outline" size={18} color="#ffffff" />
        <Text style={styles.submitButtonText}>
          {submitting
            ? getText(language, 'Submitting...', 'Inatumwa...')
            : isLeader
            ? getText(language, 'Resolve Repair Case', 'Suluhisha kesi ya ukarabati')
            : getText(language, 'Submit Repair', 'Tuma Ukarabati')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(37,99,235,0.06)',
    top: -50,
    right: -30,
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(6,182,212,0.08)',
    bottom: -32,
    left: -18,
  },
  taskId: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  geofencePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  geofenceOk: {
    backgroundColor: '#14532d',
  },
  geofenceBlocked: {
    backgroundColor: '#7c2d12',
  },
  geofenceText: {
    fontSize: 12,
    fontWeight: '700',
  },
  geofenceTextOk: {
    color: '#bbf7d0',
  },
  geofenceTextBlocked: {
    color: '#fed7aa',
  },
  helperText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 10,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  locationButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  warningCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fdba74',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#9a3412',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  sectionHeaderStack: {
    gap: 12,
    marginBottom: 12,
  },
  mediaActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignSelf: 'flex-start',
  },
  addChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  secondaryChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  captureHint: {
    marginTop: -2,
    marginBottom: 8,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  locationFactsGrid: {
    gap: 10,
    marginBottom: 14,
  },
  locationFactCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fbff',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  locationFactLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  locationFactValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
    lineHeight: 18,
  },
  siteMapWrap: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fbff',
    padding: 12,
    gap: 10,
  },
  siteMapHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  siteMapTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  siteMapSubtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  siteMapStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  siteMapStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  siteMapContainer: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  siteMap: {
    flex: 1,
  },
  siteMapMetaText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
  photoScroll: {
    paddingTop: 4,
  },
  photo: {
    width: 122,
    height: 92,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: '#e5e7eb',
  },
  photoPlaceholder: {
    width: 190,
    height: 92,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  errorTextInline: {
    marginTop: 10,
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 132,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    lineHeight: 20,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  materialChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f8fafc',
  },
  materialChipSelected: {
    borderColor: '#0f5fff',
    backgroundColor: '#e0f2ff',
  },
  materialChipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  materialChipTextSelected: {
    color: '#023e8a',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: '#2a9d8f',
    borderRadius: 16,
    paddingVertical: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
