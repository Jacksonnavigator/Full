import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AlertNotice, Card, EmptyState } from '../components/ui';
import AppHeader from '../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { useTheme } from '../context/ThemeContext';
import { SCREEN_PADDING_H, SCREEN_PADDING_TOP } from '../theme/screenLayout';
import { getLocation, getLocationDetails } from '../services/LocationService';
import { ResolvedUtilityContact, resolveUtilityForCoordinates } from '../services/utilityService';
import { radii } from '../theme/tokens';
import { useAppLanguage } from '../context/LanguageContext';

type ContactCard = {
  id: string;
  title: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  action: () => void;
};

export default function EmergencyContactScreen() {
  const { colors } = useTheme();
  const { language } = useAppLanguage();
  const navigation = useNavigation<any>();
  const bottomPadding = useBottomTabPadding();
  const [loading, setLoading] = useState(true);
  const [resolvedUtility, setResolvedUtility] = useState<ResolvedUtilityContact | null>(null);
  const [areaLabel, setAreaLabel] = useState<string | null>(null);

  const loadEmergencyUtility = useCallback(async () => {
    try {
      setLoading(true);
      const coords = await getLocation();
      const locationDetails = await getLocationDetails(coords.latitude, coords.longitude);
      const utility = await resolveUtilityForCoordinates(coords.latitude, coords.longitude);

      setAreaLabel(
        locationDetails.district ||
          locationDetails.city ||
          locationDetails.region ||
          locationDetails.fullAddress ||
          null
      );
      setResolvedUtility(utility);
    } catch (error) {
      console.warn('[EmergencyContactScreen] Unable to resolve utility contacts:', error);
      setResolvedUtility(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmergencyUtility();
  }, [loadEmergencyUtility]);

  const emergencyContacts: ContactCard[] = [
    resolvedUtility?.contact_phone
      ? {
          id: 'phone',
          title: language === 'sw' ? 'Mpigia Huduma' : 'Call Utility',
          value: resolvedUtility.contact_phone,
          icon: 'phone',
          color: colors.success,
          action: () => {
            Linking.openURL(`tel:${resolvedUtility.contact_phone}`).catch(() => {
              Alert.alert('Error', 'Unable to open phone dialer');
            });
          },
        }
      : null,
    resolvedUtility?.contact_email
      ? {
          id: 'email',
          title: language === 'sw' ? 'Tuma Barua Pepe kwa Huduma' : 'Email Utility',
          value: resolvedUtility.contact_email,
          icon: 'email',
          color: colors.primary,
          action: () => {
            Linking.openURL(`mailto:${resolvedUtility.contact_email}`).catch(() => {
              Alert.alert('Error', 'Unable to open email app');
            });
          },
        }
      : null,
    resolvedUtility?.contact_address
      ? {
          id: 'address',
          title: language === 'sw' ? 'Anwani ya Huduma' : 'Utility Address',
          value: resolvedUtility.contact_address,
          icon: 'location-on',
          color: colors.danger,
          action: () => {
            Linking.openURL(`geo:0,0?q=${encodeURIComponent(resolvedUtility.contact_address || '')}`).catch(() => {
              Alert.alert('Error', 'Unable to open map');
            });
          },
        }
      : null,
  ].filter(Boolean) as ContactCard[];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader title={language === 'sw' ? 'Anwani za Dharura' : 'Emergency Contacts'} subtitle={language === 'sw' ? 'Anwani za huduma za eneo lako — gusa ili upigie au kutuma barua pepe.' : 'Utility contacts for your area — tap to call or email.'} onLanguagePress={() => navigation.navigate('LanguageSelection')} />

        <Card style={{ ...styles.detectedCard, backgroundColor: colors.primaryMuted }} padding="md">
          <View style={styles.detectedCardHeader}>
            <MaterialIcons name="my-location" size={20} color={colors.primary} />
            <Text style={[styles.detectedCardTitle, { color: colors.primaryDark }]}>{language === 'sw' ? 'Huduma Iliyogunduliwa' : 'Detected Utility'}</Text>
          </View>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{language === 'sw' ? 'Inakagua eneo lako la sasa...' : 'Checking your current area...'}</Text>
            </View>
          ) : resolvedUtility ? (
            <>
              <Text style={[styles.detectedUtilityName, { color: colors.text }]}>{resolvedUtility.utility_name}</Text>
              {resolvedUtility.dma_name ? (
                <Text style={[styles.detectedMeta, { color: colors.primary }]}>{language === 'sw' ? 'DMA:' : 'DMA:'} {resolvedUtility.dma_name}</Text>
              ) : null}
              {areaLabel ? (
                <Text style={[styles.detectedMeta, { color: colors.textSecondary }]}>{language === 'sw' ? 'Eneo:' : 'Area:'} {areaLabel}</Text>
              ) : null}
            </>
          ) : (
            <Text style={[styles.detectedFallback, { color: colors.textSecondary }]}>
              {language === 'sw' ? 'Hatukuweza kugundua huduma ya eneo lako la sasa bado. Onyesha upya baada ya kuwezesha huduma za eneo.' : 'We could not detect a utility for your current area yet. Refresh after enabling location services.'}
            </Text>
          )}
        </Card>

        <PrimaryButton
          title={language === 'sw' ? 'Onyesha upya anwani za huduma' : 'Refresh utility contacts'}
          onPress={() => void loadEmergencyUtility()}
          variant="secondary"
          loading={loading}
        />

        {emergencyContacts.length > 0 ? (
          <View style={styles.contactsContainer}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={contact.action}
                activeOpacity={0.85}
              >
                <View style={[styles.iconBox, { backgroundColor: contact.color }]}>
                  <MaterialIcons name={contact.icon} size={26} color="#ffffff" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.textSecondary }]}>{contact.title}</Text>
                  <Text style={[styles.contactValue, { color: colors.text }]}>{contact.value}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ) : !loading ? (
          <EmptyState
            icon="contact-phone"
            title={language === 'sw' ? 'Hakuna anwani za huduma zilizohifadhiwa bado' : 'No utility contacts saved yet'}
            message={language === 'sw' ? 'Huduma husika ya eneo hili bado haijahifadhi nambari yake ya simu, barua pepe, au anwani ya umma.' : 'The responsible utility for this area has not saved its public phone, email, or address yet.'}
          />
        ) : null}

        <AlertNotice
          title={language === 'sw' ? 'Muhimu' : 'Important'}
          message={language === 'sw' ? 'Kama hali ni ya hatari ya maisha, wasiliana na huduma za dharura za eneo mara moja. Tumia anwani za huduma zilizo hapo juu kwa kuripoti matatizo ya maji ya dharura.' : 'If the situation is life-threatening, contact local emergency services immediately. Use the utility contacts above for urgent water problem reporting.'}
          variant="warning"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: SCREEN_PADDING_H, paddingTop: SCREEN_PADDING_TOP },
  detectedCard: { marginBottom: 8 },
  detectedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  detectedCardTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  detectedUtilityName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  detectedMeta: { fontSize: 13, marginBottom: 2 },
  detectedFallback: { fontSize: 13, lineHeight: 19 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingText: { fontSize: 13 },
  contactsContainer: { marginTop: 6, marginBottom: 8, gap: 8 },
  contactCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 12, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  contactValue: { fontSize: 15, fontWeight: '600' },
});
