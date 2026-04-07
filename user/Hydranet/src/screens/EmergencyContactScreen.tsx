import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

interface Contact {
    id: number;
    title: string;
    value: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
    action: () => void;
}

export default function EmergencyContactScreen() {
    const emergencyContacts: Contact[] = [
        {
            id: 1,
            title: 'Phone Number',
            value: '+255682334222',
            icon: 'phone',
            color: '#10b981',
            action: () => {
                Linking.openURL('tel:+255682334222').catch(() => {
                    Alert.alert('Error', 'Unable to open phone dialer');
                });
            },
        },
        {
            id: 2,
            title: 'Email',
            value: 'denisisamson228@gmail.com',
            icon: 'email',
            color: '#3b82f6',
            action: () => {
                Linking.openURL('mailto:denisisamson228@gmail.com').catch(() => {
                    Alert.alert('Error', 'Unable to open email client');
                });
            },
        },
        {
            id: 3,
            title: 'Address',
            value: 'Water Department Office, Arusha, Tanzania',
            icon: 'location-on',
            color: '#ef4444',
            action: () => {
                Linking.openURL(
                    'geo:-6.8,39.3?q=Water+Department+Office+Arusha'
                ).catch(() => {
                    Alert.alert('Error', 'Unable to open map');
                });
            },
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Emergency Contacts</Text>
                    <Text style={styles.subtitle}>Quick access to support</Text>
                </View>

                <View style={styles.contactsContainer}>
                    {emergencyContacts.map((contact) => (
                        <TouchableOpacity
                            key={contact.id}
                            style={styles.contactCard}
                            onPress={contact.action}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: contact.color }]}>
                                <MaterialIcons name={contact.icon} size={32} color="white" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactTitle}>{contact.title}</Text>
                                <Text style={styles.contactValue}>{contact.value}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>📞 Available 24/7</Text>
                    <Text style={styles.infoText}>
                        Our emergency support team is available round the clock to assist you with any urgent water-related issues.
                    </Text>
                </View>

                <View style={styles.urgencyBox}>
                    <Text style={styles.urgencyTitle}>⚠️ For Life-Threatening Situations</Text>
                    <Text style={styles.urgencyText}>
                        Please contact local emergency services immediately at 911 or your country's emergency number.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    header: {
        marginBottom: 24,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    contactsContainer: {
        marginBottom: 24,
    },
    contactCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    infoBox: {
        backgroundColor: '#dbeafe',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#1e40af',
        lineHeight: 20,
    },
    urgencyBox: {
        backgroundColor: '#fee2e2',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    urgencyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#991b1b',
        marginBottom: 8,
    },
    urgencyText: {
        fontSize: 14,
        color: '#991b1b',
        lineHeight: 20,
    },
});
