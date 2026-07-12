import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResolvedImage } from '../ResolvedImage';

export const ImageLightboxModal: React.FC<{
  visible: boolean;
  uri?: string | null;
  label?: string | null;
  onClose: () => void;
}> = ({ visible, uri, label, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.85}>
          <Ionicons name="close" size={22} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.content}>
          {uri ? (
            <ResolvedImage
              uri={uri}
              style={styles.image}
              resizeMode="contain"
              fallbackContainerStyle={styles.imageFallback}
              fallbackText="Image unavailable"
            />
          ) : null}
          {label ? <Text style={styles.caption}>{label}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 2,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  image: {
    width: '100%',
    height: 420,
    borderRadius: 18,
    backgroundColor: '#0f172a',
  },
  imageFallback: {
    width: '100%',
    height: 420,
    borderRadius: 18,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: '#111827',
  },
  caption: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '600',
  },
});
