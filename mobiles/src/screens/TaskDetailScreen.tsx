import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTaskStore } from '../store/taskStore';
import { StatusBadge } from '../components/StatusBadge';
import { ResolvedImage, inferMediaKind } from '../components/ResolvedImage';
import { ImageLightboxModal } from '../components/shared/ImageLightboxModal';
import { calculateDistanceInMeters, Coordinates, getCurrentLocation } from '../utils/locationUtils';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;
type MediaKind = 'image' | 'video' | 'file';

type MediaItem = {
  uri: string;
  kind: MediaKind;
  label: string;
};

const SITE_RADIUS_METERS = 200;

const InlineVideoCard: React.FC<{
  uri: string;
  label: string;
  onOpenExternal: (uri: string) => void;
}> = ({ uri, label, onOpenExternal }) => {
  const player = useVideoPlayer({ uri }, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = false;
  });

  return (
    <View style={styles.videoWrap}>
      <VideoView
        player={player}
        style={styles.videoPlayer}
        nativeControls
        allowsFullscreen
        contentFit="cover"
        surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
      />
      <View style={styles.videoMetaRow}>
        <View style={styles.mediaLabelInline}>
          <Text style={styles.mediaLabelText}>{label}</Text>
        </View>
        <TouchableOpacity
          style={styles.videoExternalButton}
          onPress={() => void onOpenExternal(uri)}
          activeOpacity={0.85}
        >
          <Ionicons name="open-outline" size={14} color="#1d4ed8" />
          <Text style={styles.videoExternalButtonText}>Open</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId));
  const role = useTaskStore((state) => state.currentUser?.role);
  const startTaskAsEngineer = useTaskStore((state) => state.startTaskAsEngineer);
  const startTaskAsLeader = useTaskStore((state) => state.startTaskAsLeader);
  const mapRef = useRef<MapView | null>(null);

  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [refreshingLocation, setRefreshingLocation] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ uri: string; label: string } | null>(null);

  const refreshLocation = useCallback(async () => {
    if (!task) return;

    setRefreshingLocation(true);
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
      setRefreshingLocation(false);
    }
  }, [task]);

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  useEffect(() => {
    if (!task || !mapRef.current || !currentCoords) return;

    mapRef.current.fitToCoordinates(
      [
        { latitude: task.latitude, longitude: task.longitude },
        { latitude: currentCoords.latitude, longitude: currentCoords.longitude },
      ],
      {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated: true,
      }
    );
  }, [currentCoords, task]);

  const reportMedia = useMemo<MediaItem[]>(() => {
    if (!task) return [];

    return task.reporterPhotos.map((uri, index) => {
      const kind = inferMediaKind(uri);
      return {
        uri,
        kind,
        label:
          kind === 'image'
            ? `Photo ${index + 1}`
            : kind === 'video'
            ? `Video ${index + 1}`
            : `Attachment ${index + 1}`,
      };
    });
  }, [task]);

  const resolvedMedia = useMemo<MediaItem[]>(() => {
    if (!task) return [];

    const submissionAfter = task.engineerReport?.afterPhotos ?? task.afterPhotos ?? [];
    const leaderResolved = task.leaderResolution?.photos ?? [];
    const fallbackLegacy = submissionAfter.length === 0 && leaderResolved.length === 0
      ? task.engineerReport?.beforePhotos ?? task.beforePhotos ?? []
      : [];

    const uniqueUris = Array.from(new Set([...submissionAfter, ...leaderResolved, ...fallbackLegacy]));

    return uniqueUris.map((uri, index) => {
      const kind = inferMediaKind(uri);
      const isLegacy = fallbackLegacy.includes(uri);
      return {
        uri,
        kind,
        label:
          kind === 'image'
            ? isLegacy
              ? `Legacy ${index + 1}`
              : `Resolved ${index + 1}`
            : kind === 'video'
            ? isLegacy
              ? `Legacy Video ${index + 1}`
              : `Resolved Video ${index + 1}`
            : isLegacy
            ? `Legacy Attachment ${index + 1}`
            : `Resolved Attachment ${index + 1}`,
      };
    });
  }, [task]);

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Task not found.</Text>
      </View>
    );
  }

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

  const formattedDistance =
    distanceMeters == null
      ? refreshingLocation
        ? 'Refreshing...'
        : 'Locating...'
      : distanceMeters < 1000
      ? `${distanceMeters.toFixed(0)} m away`
      : `${(distanceMeters / 1000).toFixed(2)} km away`;

  const accuracyText =
    currentCoords?.accuracy != null
      ? `GPS accuracy about ${Math.round(currentCoords.accuracy)} m`
      : 'Waiting for GPS accuracy';

  const summaryCards = [
    {
      label: 'Assigned team',
      value: task.assignedTeam || 'Unassigned',
      icon: 'people-outline' as const,
      tone: '#2563eb',
    },
    {
      label: 'Team leader',
      value: task.teamLeader || 'Not set',
      icon: 'person-outline' as const,
      tone: '#7c3aed',
    },
    {
      label: 'Distance',
      value: formattedDistance,
      icon: 'navigate-outline' as const,
      tone: '#ea580c',
    },
  ];

  const handleStartTask = () => {
    if (!canStart) return;

    if (isLeader) {
      startTaskAsLeader(task.id);
      Alert.alert('Task started', 'You are now working on this task as Team Leader.');
      return;
    }

    startTaskAsEngineer(task.id);
    Alert.alert('Task started', 'Status updated to In Progress.');
  };

  const handleOpenSubmitRepair = () => {
    if (!canSubmitFromDetail) return;
    navigation.navigate('SubmitRepair', { taskId: task.id });
  };

  const handleOpenMedia = async (uri: string) => {
    const supported = await Linking.canOpenURL(uri);
    if (!supported) {
      Alert.alert('Attachment unavailable', 'This media file could not be opened on the device.');
      return;
    }

    await Linking.openURL(uri);
  };

  const handleOpenImageLightbox = (uri: string, label: string) => {
    setLightboxImage({ uri, label });
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroGlowLarge} />
        <View style={styles.heroGlowSmall} />

        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.taskId}>{task.trackingId || task.id}</Text>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.subtitle}>{task.description}</Text>
          </View>
          <View style={styles.headerBadges}>
            <StatusBadge label={task.priority} variant="priority" />
            <StatusBadge label={task.status} variant="status" style={{ marginTop: 8 }} />
          </View>
        </View>

        <View style={styles.stepsRow} accessibilityRole="summary">
          {['Go to site', 'Start task', 'Repair', 'Submit'].map((label, index) => {
            const active = index + 1 <= currentStep;
            return (
              <View style={styles.stepItem} key={label}>
                <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
                  <Text style={[styles.stepIndex, active && styles.stepIndexActive]}>{index + 1}</Text>
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
              </View>
            );
          })}
        </View>
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

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionSubtitle}>
              The map stays inside the app so the crew can verify the exact leak point on-site.
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshChip} onPress={() => void refreshLocation()} activeOpacity={0.85}>
            <Ionicons name="locate-outline" size={15} color="#ffffff" />
            <Text style={styles.refreshChipText}>{refreshingLocation ? 'Refreshing' : 'Refresh'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            mapType="standard"
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
            <Marker
              coordinate={{ latitude: task.latitude, longitude: task.longitude }}
              title={task.title}
              description={task.description}
            />
            {currentCoords && (
              <Marker coordinate={currentCoords} title="Your location" pinColor="blue" />
            )}
            <Circle
              center={{ latitude: task.latitude, longitude: task.longitude }}
              radius={SITE_RADIUS_METERS}
              strokeColor="#0077b6"
              fillColor="#0077b620"
            />
          </MapView>
        </View>

        <View style={styles.mapMetaStrip}>
          <View style={styles.mapMetaPill}>
            <Ionicons name="radio-outline" size={14} color={colors.primary} />
            <Text style={styles.mapMetaText}>{accuracyText}</Text>
          </View>
          <View style={styles.mapMetaPill}>
            <Ionicons name="pin-outline" size={14} color={colors.primary} />
            <Text style={styles.mapMetaText}>Work zone radius {SITE_RADIUS_METERS} m</Text>
          </View>
          <View style={styles.mapMetaPill}>
            <Ionicons name="person-outline" size={14} color={colors.primary} />
            <Text style={styles.mapMetaText}>Blue marker is your current location</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Reported Media</Text>
        <Text style={styles.sectionSubtitle}>
          Original reporter attachments are shown here before field work begins.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaScroll}>
          {reportMedia.map((item, index) =>
            item.kind === 'image' ? (
              <TouchableOpacity
                key={`${item.uri}-${index}`}
                style={styles.mediaWrap}
                onPress={() => handleOpenImageLightbox(item.uri, item.label)}
                activeOpacity={0.9}
              >
                <ResolvedImage
                  uri={item.uri}
                  style={styles.photo}
                  fallbackContainerStyle={styles.photoFallback}
                />
                <View style={styles.mediaLabel}>
                  <Text style={styles.mediaLabelText}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ) : item.kind === 'video' ? (
              <InlineVideoCard
                key={`${item.uri}-${index}`}
                uri={item.uri}
                label={item.label}
                onOpenExternal={handleOpenMedia}
              />
            ) : (
              <TouchableOpacity
                key={`${item.uri}-${index}`}
                style={styles.fileCard}
                onPress={() => void handleOpenMedia(item.uri)}
                activeOpacity={0.85}
              >
                <View style={styles.fileCardTop}>
                  <Ionicons name="document-outline" size={20} color="#1d4ed8" />
                  <Text style={styles.fileCardIcon}>File</Text>
                </View>
                <Text style={styles.fileCardTitle}>{item.label}</Text>
                <Text style={styles.fileCardBody}>Tap to open this attachment</Text>
              </TouchableOpacity>
            )
          )}
          {reportMedia.length === 0 && (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="images-outline" size={26} color="#94a3b8" />
              <Text style={styles.photoPlaceholderText}>No media was provided with this report.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Resolved Images</Text>
        <Text style={styles.sectionSubtitle}>
          Photos and media uploaded by the engineer or team leader during repair resolution are shown here.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaScroll}>
          {resolvedMedia.map((item, index) =>
            item.kind === 'image' ? (
              <TouchableOpacity
                key={`${item.uri}-${index}`}
                style={styles.mediaWrap}
                onPress={() => handleOpenImageLightbox(item.uri, item.label)}
                activeOpacity={0.9}
              >
                <ResolvedImage
                  uri={item.uri}
                  style={styles.photo}
                  fallbackContainerStyle={styles.photoFallback}
                />
                <View style={styles.mediaLabel}>
                  <Text style={styles.mediaLabelText}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ) : item.kind === 'video' ? (
              <InlineVideoCard
                key={`${item.uri}-${index}`}
                uri={item.uri}
                label={item.label}
                onOpenExternal={handleOpenMedia}
              />
            ) : (
              <TouchableOpacity
                key={`${item.uri}-${index}`}
                style={styles.fileCard}
                onPress={() => void handleOpenMedia(item.uri)}
                activeOpacity={0.85}
              >
                <View style={styles.fileCardTop}>
                  <Ionicons name="document-outline" size={20} color="#1d4ed8" />
                  <Text style={styles.fileCardIcon}>File</Text>
                </View>
                <Text style={styles.fileCardTitle}>{item.label}</Text>
                <Text style={styles.fileCardBody}>Tap to open this attachment</Text>
              </TouchableOpacity>
            )
          )}
          {resolvedMedia.length === 0 && (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="images-outline" size={26} color="#94a3b8" />
              <Text style={styles.photoPlaceholderText}>No resolved images have been attached yet.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <Text style={styles.sectionSubtitle}>Track what has happened from report creation to field execution.</Text>
        <View style={styles.timelineContainer}>
          {task.timeline
            .slice()
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((entry, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineRail}>
                  <View style={styles.timelineDot} />
                  {index !== task.timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStatus}>{entry.status}</Text>
                  <Text style={styles.timelineTimestamp}>{new Date(entry.timestamp).toLocaleString()}</Text>
                  {entry.note ? <Text style={styles.timelineNote}>{entry.note}</Text> : null}
                </View>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity
          style={[styles.primaryButton, !canStart && styles.buttonDisabled]}
          onPress={handleStartTask}
          disabled={!canStart}
          activeOpacity={0.85}
        >
          <Ionicons name="play-outline" size={18} color="#ffffff" />
          <Text style={styles.primaryButtonText}>
            {task.status === 'In Progress' || task.status === 'In Progress (Leader)' ? 'Task In Progress' : 'Start Task'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, !canSubmitFromDetail && styles.buttonDisabled]}
          onPress={handleOpenSubmitRepair}
          activeOpacity={0.85}
          disabled={!canSubmitFromDetail}
        >
          <Ionicons name="checkmark-done-outline" size={18} color="#ffffff" />
          <Text style={styles.submitButtonText}>
            {role === 'Team Leader' ? 'Resolve & Submit' : 'Submit Repair Report'}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      <ImageLightboxModal
        visible={Boolean(lightboxImage)}
        uri={lightboxImage?.uri}
        label={lightboxImage?.label}
        onClose={() => setLightboxImage(null)}
      />
    </>
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
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
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
    bottom: -30,
    left: -16,
  },
  heroTop: {
    flexDirection: 'row',
    gap: 12,
  },
  heroCopy: {
    flex: 1,
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
    marginBottom: 6,
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  headerBadges: {
    alignItems: 'flex-end',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 8,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIndex: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  stepIndexActive: {
    color: '#ffffff',
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#0f172a',
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
    gap: 12,
    marginBottom: 12,
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
  refreshChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignSelf: 'flex-start',
  },
  refreshChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  mapContainer: {
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  mapMetaStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mapMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mapMetaText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  mediaScroll: {
    paddingTop: 4,
  },
  mediaWrap: {
    position: 'relative',
    marginRight: 10,
  },
  videoWrap: {
    width: 210,
    marginRight: 10,
  },
  photo: {
    width: 170,
    height: 118,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
  },
  photoFallback: {
    width: 170,
    height: 118,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoFallbackText: {
    display: 'none',
  },
  videoPlayer: {
    width: 210,
    height: 118,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    overflow: 'hidden',
  },
  mediaLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  mediaLabelText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  mediaLabelInline: {
    backgroundColor: 'rgba(15,23,42,0.08)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  videoMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  videoExternalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  videoExternalButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  fileCard: {
    width: 170,
    height: 118,
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 14,
    justifyContent: 'space-between',
  },
  fileCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileCardIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
    textTransform: 'uppercase',
  },
  fileCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  fileCardBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  photoPlaceholder: {
    width: 220,
    height: 118,
    padding: 16,
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
    textAlign: 'center',
  },
  timelineContainer: {
    marginTop: 8,
    gap: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineRail: {
    alignItems: 'center',
    width: 14,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#dbeafe',
    marginTop: 4,
    marginBottom: -2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 12,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  timelineTimestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  timelineNote: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
    lineHeight: 18,
  },
  actionsCard: {
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0f5fff',
    borderRadius: 16,
    paddingVertical: 14,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2a9d8f',
    borderRadius: 16,
    paddingVertical: 14,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
