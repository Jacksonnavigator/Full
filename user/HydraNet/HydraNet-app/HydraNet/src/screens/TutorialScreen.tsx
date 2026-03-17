import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TutorialScreenProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoAdvanceProgress, setAutoAdvanceProgress] = useState(100);

  const tutorialSteps = [
    {
      title: 'Step 1: Get Your Location',
      description: 'Capture GPS Coordinates',
      component: 'location',
      content: 'Tap this button to capture your current GPS location. This is the first step - required before you can take a photo. It helps authorities identify the exact problem location.',
      buttonLabel: 'Get Current Location',
      buttonIcon: 'location-on',
    },
    {
      title: 'Step 2: Take a Photo or Video',
      description: 'Capture the Water Problem',
      component: 'photo',
      content: 'After capturing location, tap this button to take or upload a photo or short video clip (max 60 seconds) of the water problem. Photos are automatically compressed for quick uploads. Videos provide more detail of the issue.',
      buttonLabel: '📷 Add Media',
      buttonIcon: 'camera-alt',
    },
    {
      title: 'Step 3: Select Priority',
      description: 'Choose Urgency Level',
      component: 'priority',
      content: 'After selecting a photo, choose the priority level:\n\n🚨 Urgently - For critical problems needing immediate action\n⚠️ Moderate - For issues that can be handled soon',
    },
    {
      title: 'Step 4: Add Description',
      description: 'Provide Problem Details',
      component: 'description',
      content: 'Write a clear description of the water problem. Include details about what\'s happening, how long it\'s been occurring, and any relevant observations.',
      placeholder: 'Describe the water problem (e.g., pipe burst, water leakage, contamination)',
    },
  ];

  // Update progress bar for auto-advance
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAutoAdvanceProgress((prev) => {
        if (prev <= 0) return 100;
        return prev - (100 / 40); // 40 updates over 4 seconds
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-advance to next step after 4 seconds
  useEffect(() => {
    const autoAdvanceTimer = setTimeout(() => {
      if (currentStep < tutorialSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }, 4000);

    return () => clearTimeout(autoAdvanceTimer);
  }, [currentStep, onComplete]);

  const step = tutorialSteps[currentStep];
  const bgColor = '#ffffff';
  const textColor = '#1e40af';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepCounter}>
            {currentStep + 1} / {tutorialSteps.length}
          </Text>
          <TouchableOpacity
            onPress={onComplete}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip Tour</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.subtitle}>{step.description}</Text>

        {/* Component Preview */}
        {step.component && (
          <View style={styles.componentPreview}>
            {step.component === 'location' && (
              <View style={styles.previewContent}>
                <View style={styles.buttonPreview}>
                  <MaterialIcons name={(step.buttonIcon || 'location-on') as any} size={24} color="#fff" />
                  <Text style={styles.buttonPreviewText}>{step.buttonLabel}</Text>
                </View>
                <Text style={styles.componentLabel}>Location Button</Text>
              </View>
            )}

            {step.component === 'photo' && (
              <View style={styles.previewContent}>
                <View style={styles.buttonPreview}>
                  <MaterialIcons name={(step.buttonIcon || 'camera-alt') as any} size={24} color="#fff" />
                  <Text style={styles.buttonPreviewText}>{step.buttonLabel}</Text>
                </View>
                <Text style={styles.componentLabel}>Photo Picker Button</Text>
              </View>
            )}

            {step.component === 'priority' && (
              <View style={styles.previewContent}>
                <View style={styles.priorityPreview}>
                  <View style={[styles.priorityOption, styles.urgentOption]}>
                    <Text style={styles.priorityEmoji}>🚨</Text>
                    <Text style={styles.priorityTitle}>Urgently</Text>
                    <Text style={styles.priorityDescription}>For critical problems needing immediate action</Text>
                  </View>
                  <View style={[styles.priorityOption, styles.moderateOption]}>
                    <Text style={styles.priorityEmoji}>⚠️</Text>
                    <Text style={styles.priorityTitle}>Moderate</Text>
                    <Text style={styles.priorityDescription}>For issues that can be handled soon</Text>
                  </View>
                </View>
                <Text style={styles.componentLabel}>Priority Selection</Text>
              </View>
            )}

            {step.component === 'description' && (
              <View style={styles.previewContent}>
                <View style={styles.textAreaPreview}>
                  <Text style={styles.textAreaLabel}>{step.placeholder}</Text>
                </View>
                <Text style={styles.componentLabel}>Description Text Area</Text>
              </View>
            )}

            {step.component === 'submit' && (
              <View style={styles.previewContent}>
                <View style={styles.buttonPreview}>
                  <MaterialIcons name={(step.buttonIcon || 'send') as any} size={24} color="#fff" />
                  <Text style={styles.buttonPreviewText}>{step.buttonLabel}</Text>
                </View>
                <Text style={styles.componentLabel}>Submit Button</Text>
              </View>
            )}
          </View>
        )}

        {/* Description Box */}
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{step.content}</Text>
        </View>

        {/* Progress Indicators */}
        <View style={styles.indicatorsContainer}>
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentStep && styles.indicatorActive,
                index < currentStep && styles.indicatorCompleted,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Auto-Advance Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${autoAdvanceProgress}%` }]} />
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentStep === 0}
          style={[styles.button, styles.buttonBack, currentStep === 0 && styles.buttonDisabled]}
        >
          <MaterialIcons
            name="arrow-back"
            size={20}
            color={currentStep === 0 ? '#cbd5e1' : '#fff'}
          />
          <Text style={[styles.buttonText, currentStep === 0 && styles.buttonTextDisabled]}>
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.button, styles.buttonNext]}
        >
          <Text style={styles.buttonText}>
            {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    borderRadius: 20,
  },
  skipButtonText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  componentPreview: {
    backgroundColor: 'rgba(30, 64, 175, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
  },
  previewContent: {
    alignItems: 'center',
  },
  buttonPreview: {
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonPreviewText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  priorityPreview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  urgentOption: {
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    borderColor: '#1e40af',
  },
  moderateOption: {
    backgroundColor: 'rgba(8, 145, 178, 0.1)',
    borderColor: '#0891b2',
  },
  priorityEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  priorityTitle: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  priorityDescription: {
    color: '#1e40af',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  textAreaPreview: {
    width: '100%',
    backgroundColor: 'rgba(30, 64, 175, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 80,
    justifyContent: 'center',
    marginBottom: 16,
  },
  textAreaLabel: {
    color: '#1e40af',
    fontSize: 14,
  },
  tabPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 64, 175, 0.05)',
    borderRadius: 10,
    marginBottom: 16,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    color: '#1e40af',
    fontSize: 11,
    fontWeight: '500',
  },
  componentLabel: {
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic',
  },
  contentBox: {
    backgroundColor: 'rgba(30, 64, 175, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
  },
  contentText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 22,
    textAlign: 'center',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(30, 64, 175, 0.2)',
  },
  indicatorActive: {
    backgroundColor: '#1e40af',
    width: 24,
  },
  indicatorCompleted: {
    backgroundColor: 'rgba(30, 64, 175, 0.5)',
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1e40af',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: 'rgba(30, 64, 175, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 64, 175, 0.1)',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
    gap: 8,
  },
  buttonNext: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  buttonBack: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#cbd5e1',
  },
});
