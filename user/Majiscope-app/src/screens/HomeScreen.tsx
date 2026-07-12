import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useAppLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getLocation, getLocationName } from '../services/LocationService';
import { SCREEN_PADDING_H, SCREEN_PADDING_TOP } from '../theme/screenLayout';

export default function HomeScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { language } = useAppLanguage();
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLocation = async () => {
            try {
                setIsLoadingLocation(true);
                const coords = await getLocation();
                const locationName = await getLocationName(coords.latitude, coords.longitude);
                if (isMounted) {
                    setCurrentLocation(locationName);
                }
            } catch (error) {
                console.log('Location detection skipped or failed', error);
                if (isMounted) {
                    setCurrentLocation(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingLocation(false);
                }
            }
        };

        void fetchLocation();

        return () => {
            isMounted = false;
        };
    }, []);

    const copy = language === 'sw'
        ? {
            headerTitle: 'MajiScope',
            headerSubtitle: 'Ripoti matatizo ya maji kwa picha, eneo, na maelezo mafupi.',
            actionTitle: 'Ripoti Tatizo la Maji',
            actionSubtitle: 'Anza ripoti mpya kwa kufuata hatua rahisi.',
            actionButton: 'Anza Ripoti',
            historyButton: 'Angalia Ripoti Zangu',
            stepsTitle: 'Jinsi ya Kuripoti',
            step1Title: 'Chukua Picha au Video',
            step1Text: 'Rekodi shida ya maji kwa uwazi.',
            step2Title: 'Chukua Mahali ya GPS',
            step2Text: isLoadingLocation ? 'Inatambua eneo...' : currentLocation ? `Eneo: ${currentLocation}` : 'Pata viwianishi vya sasa',
            step3Title: 'Eleza na Wasilisha',
            step3Text: 'Toa maelezo, chagua kipaumbele, kisha utume ripoti.',
            tipTitle: 'Kidokezo',
            tipText: 'Ongeza picha au video kwanza, kisha pata GPS na uburute pini kwenye ramani hadi eneo halisi.',
          }
        : {
            headerTitle: 'MajiScope',
            headerSubtitle: 'Report water problems with media, location, and a short description.',
            actionTitle: 'Report a Water Problem',
            actionSubtitle: 'Start a new report with a few guided steps.',
            actionButton: 'Start Report',
            historyButton: 'View My Reports',
            stepsTitle: 'How to Report',
            step1Title: 'Take Photo or Video',
            step1Text: 'Document the water problem clearly.',
            step2Title: 'Capture GPS Location',
            step2Text: isLoadingLocation ? 'Detecting location...' : currentLocation ? `Location: ${currentLocation}` : 'Get your current coordinates',
            step3Title: 'Describe and Submit',
            step3Text: 'Add details, select priority, then submit the report.',
            tipTitle: 'Tip',
            tipText: 'Add photo or video first, then capture GPS and drag the map pin to the exact spot.',
          };

    const steps = [
        { title: copy.step1Title, text: copy.step1Text, icon: 'photo-camera' as const },
        { title: copy.step2Title, text: copy.step2Text, icon: 'my-location' as const },
        { title: copy.step3Title, text: copy.step3Text, icon: 'send' as const },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}> 
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <AppHeader
                    title={copy.headerTitle}
                    subtitle={copy.headerSubtitle}
                    onLanguagePress={() => navigation.navigate('LanguageSelection')}
                />

                <LinearGradient colors={['#0891b2', '#2563eb']} style={styles.heroCard}>
                    <View style={styles.heroIconWrap}>
                        <MaterialIcons name="water-drop" size={34} color="#ffffff" />
                    </View>
                    <Text style={styles.heroTitle}>{copy.actionTitle}</Text>
                    <Text style={styles.heroSubtitle}>{copy.actionSubtitle}</Text>
                    <PrimaryButton title={copy.actionButton} onPress={() => navigation.navigate('Report')} />
                    <TouchableOpacity style={styles.secondaryAction} onPress={() => navigation.navigate('ViewReport')} activeOpacity={0.85}>
                        <Text style={styles.secondaryActionText}>{copy.historyButton}</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={[styles.section, { backgroundColor: colors.card }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{copy.stepsTitle}</Text>
                    {steps.map((step, index) => (
                        <View key={step.title} style={styles.instructionRow}>
                            <View style={styles.stepCircle}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                            </View>
                            <View style={styles.stepIcon}>
                                <MaterialIcons name={step.icon} size={20} color="#0891b2" />
                            </View>
                            <View style={styles.stepCopy}>
                                <Text style={[styles.instructionTitle, { color: colors.text }]}>{step.title}</Text>
                                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>{step.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.tipCard}>
                    <MaterialIcons name="info" size={22} color="#1d4ed8" />
                    <View style={styles.tipCopy}>
                        <Text style={styles.tipTitle}>{copy.tipTitle}</Text>
                        <Text style={styles.tipText}>{copy.tipText}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SCREEN_PADDING_H,
        paddingTop: SCREEN_PADDING_TOP,
        paddingBottom: 110,
    },
    heroCard: {
        marginTop: 18,
        padding: 20,
        borderRadius: 24,
        gap: 12,
    },
    heroIconWrap: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#ffffff',
    },
    heroSubtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: 'rgba(255,255,255,0.88)',
    },
    secondaryAction: {
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.16)',
        alignItems: 'center',
    },
    secondaryActionText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 14,
    },
    section: {
        marginTop: 18,
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(8,145,178,0.12)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 14,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 14,
    },
    stepCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#0891b2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumber: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '900',
    },
    stepIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#ecfeff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCopy: {
        flex: 1,
    },
    instructionTitle: {
        fontSize: 15,
        fontWeight: '800',
    },
    instructionText: {
        marginTop: 3,
        fontSize: 13,
        lineHeight: 18,
    },
    tipCard: {
        marginTop: 16,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#eff6ff',
        borderWidth: 1,
        borderColor: '#bfdbfe',
        flexDirection: 'row',
        gap: 10,
    },
    tipCopy: {
        flex: 1,
    },
    tipTitle: {
        color: '#1e3a8a',
        fontSize: 14,
        fontWeight: '900',
    },
    tipText: {
        marginTop: 3,
        color: '#1d4ed8',
        fontSize: 13,
        lineHeight: 18,
    },
});