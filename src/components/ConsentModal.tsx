import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Switch,
} from 'react-native';
import { colors, borderRadius, fontFamily, fontWeight, fontSize } from '../theme';

interface ConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  title?: string;
  description?: string;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  visible,
  onAccept,
  title = 'Location & Data Consent',
  description = 'HydraNet requires your explicit consent to collect location and media data.',
}) => {
  const { height } = useWindowDimensions();
  const [checkedGPS, setCheckedGPS] = useState(false);
  const [checkedPrivacy, setCheckedPrivacy] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState(false);

  const allChecked = checkedGPS && checkedPrivacy && checkedTerms;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}} // Prevent back button; must accept
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { maxHeight: height * 0.9 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📍 {title}</Text>
            <Text style={styles.subtitle}>{description}</Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why We Need Location</Text>
              <Text style={styles.sectionText}>
                Your GPS location helps us identify the exact water leakage site, ensuring authorities dispatch repairs to the correct location quickly and accurately.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photo & Media Collection</Text>
              <Text style={styles.sectionText}>
                Photos you capture are used exclusively to document the water problem and assist repair teams. We never use them for any other purpose.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Privacy</Text>
              <Text style={styles.sectionText}>
                Your location and photos are shared only with relevant water authorities. We never sell your data to third parties. Information is deleted securely after the issue is resolved.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Rights</Text>
              <Text style={styles.sectionText}>
                You can revoke consent anytime in Settings. If you decline, you can still use HydraNet but cannot submit location-based reports.
              </Text>
            </View>

            {/* Checkboxes */}
            <View style={styles.checkboxSection}>
              <View style={styles.checkboxRow}>
                <Switch
                  value={checkedGPS}
                  onValueChange={setCheckedGPS}
                  trackColor={{ false: '#ccc', true: colors.primary }}
                  thumbColor={checkedGPS ? colors.primaryDark : '#f4f3f4'}
                />
                <Text style={styles.checkboxLabel}>
                  I consent to GPS location collection for precise leak reporting
                </Text>
              </View>

              <View style={styles.checkboxRow}>
                <Switch
                  value={checkedPrivacy}
                  onValueChange={setCheckedPrivacy}
                  trackColor={{ false: '#ccc', true: colors.primary }}
                  thumbColor={checkedPrivacy ? colors.primaryDark : '#f4f3f4'}
                />
                <Text style={styles.checkboxLabel}>
                  I understand my data is shared only with relevant authorities and deleted after resolution
                </Text>
              </View>

              <View style={styles.checkboxRow}>
                <Switch
                  value={checkedTerms}
                  onValueChange={setCheckedTerms}
                  trackColor={{ false: '#ccc', true: colors.primary }}
                  thumbColor={checkedTerms ? colors.primaryDark : '#f4f3f4'}
                />
                <Text style={styles.checkboxLabel}>
                  I have read and agree to the Terms & Conditions
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.acceptButton, !allChecked && styles.buttonDisabled]}
              onPress={onAccept}
              disabled={!allChecked}
              activeOpacity={0.8}
            >
              <Text style={styles.acceptButtonText}>
                {allChecked ? 'Accept & Continue' : 'Please accept all items'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerNote}>
              ✓ Your consent is recorded and can be revoked in Settings anytime.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: 6,
    fontFamily: fontFamily,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  checkboxSection: {
    gap: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    paddingTop: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  acceptButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    opacity: 0.6,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  footerNote: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
});
