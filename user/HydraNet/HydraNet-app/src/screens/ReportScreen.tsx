
// -----------------------------
// MIGRATED: Now using new architecture patterns
// -----------------------------
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// NEW: Import new architecture components
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { TaskService } from '@/services/api/tasks';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { CONFIG } from '@/lib/config';
// NEW: Import utilities
import { getCurrentLocation } from '@/utils/locationUtils';
import { uploadReportImage } from '@/services/imageUploadService';

// NEW: Placeholder functions for missing utilities (can be implemented later)
const compressImage = async (uri: string) => uri; // Placeholder - implement compression later
const requestLocation = getCurrentLocation; // Use the new location utility

export default function ReportScreen() {
  const { currentUser } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');

  // NEW: Use useApi hook for location and image operations
  const {
    execute: getLocation,
    isLoading: locationLoading
  } = useApi(async () => {
    // NEW: Use the new location utility
    const coords = await requestLocation();
    if (coords) setLocation(coords);
    return coords;
  });

  const {
    execute: submitReport,
    isLoading: submitLoading
  } = useApi(async () => {
    if (!imageUri || !location || !description) {
      throw new Error('Complete all fields!');
    }

    // NEW: Use the new image compression utility
    const compressedUri = await compressImage(imageUri);

    // NEW: Use the new TaskService to create a report/task
    const reportData = {
      title: `Report from ${currentUser?.name || 'User'}`,
      description,
      priority: priority.toLowerCase(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      image_url: compressedUri,
      device_id: 'DEVICE123',
      reported_by: currentUser?.id
    };

    return await TaskService.createTask(reportData);
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
      <Card variant="elevated" style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
          Submit Report
        </Text>
        <Text style={{ fontSize: 16, color: '#6b7280' }}>
          Report an issue with utilities or infrastructure
        </Text>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>
          Photo Evidence
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <Button
            label="Take Photo"
            onPress={takePhoto}
            variant="secondary"
            size="small"
            style={{ flex: 1 }}
          />
          <Button
            label="Pick Image"
            onPress={pickImage}
            variant="outline"
            size="small"
            style={{ flex: 1 }}
          />
        </View>

        {imageUri && (
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#059669', marginBottom: 8 }}>
              ✓ Photo selected
            </Text>
          </View>
        )}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>
          Location
        </Text>

        <Button
          label="Get Current Location"
          onPress={handleGetLocation}
          loading={locationLoading}
          variant="secondary"
          style={{ marginBottom: 12 }}
        />

        {location && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Badge label="Location obtained" variant="success" />
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>
          Report Details
        </Text>

        <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 8 }}>Description</Text>
        <TextInput
          placeholder="Describe the issue..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            marginBottom: 16,
            textAlignVertical: 'top'
          }}
        />

        <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 8 }}>Priority</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Low', 'Medium', 'High'].map((p) => (
            <Button
              key={p}
              label={p}
              onPress={() => setPriority(p)}
              variant={priority === p ? 'primary' : 'outline'}
              size="small"
              style={{ flex: 1 }}
            />
          ))}
        </View>
      </Card>

      <Button
        label="Submit Report"
        onPress={handleSubmitReport}
        loading={submitLoading}
        disabled={!imageUri || !location || !description.trim()}
        style={{ marginBottom: 16 }}
      />

      <Card variant="outlined">
        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
          Make sure to include a photo and get your location before submitting
        </Text>
      </Card>
    </ScrollView>
  );
}

