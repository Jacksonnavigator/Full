import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TermsScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Terms & Conditions</Text>
                <Text style={styles.lastUpdated}>Last Updated: February 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About HydraNet</Text>
                    <Text style={styles.paragraph}>
                        HydraNet helps you report water problems like leaks, contamination, and supply issues. Your reports help authorities respond quickly.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location & Photos</Text>
                    <Text style={styles.paragraph}>
                        To effectively report water problems, you must capture your GPS location before attaching media. This ensures we can accurately identify the exact location of the problem. Photos and short videos help authorities understand the situation better and respond more effectively. Both your location data and attached media are shared only with relevant authorities to facilitate quick resolution.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Responsibilities</Text>
                    <Text style={styles.paragraph}>
                        As a user of HydraNet, you are responsible for reporting genuine water problems only. Please provide accurate and truthful information in your reports. Do not misuse the system by submitting false reports or uploading inappropriate or offensive content. Using this platform responsibly helps authorities focus their resources on real problems.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Privacy</Text>
                    <Text style={styles.paragraph}>
                        Your privacy is important to us. Your location and attached media are used exclusively for water problem reporting and resolution. We never sell your data to third parties or use it for any other purposes. Your information is retained only as long as necessary to help resolve the reported problem, after which it is securely deleted.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Important Notice</Text>
                    <Text style={[styles.paragraph, styles.importantText]}>
                        ⚠️ Response times depend on local authorities. We cannot guarantee specific timeframes. Emergency situations are prioritized.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By using HydraNet, you agree to these terms.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 8,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 24,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 8,
    },
    importantText: {
        backgroundColor: '#fef3c7',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    footer: {
        backgroundColor: '#dbeafe',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#93c5fd',
    },
    footerText: {
        fontSize: 14,
        color: '#1e40af',
        lineHeight: 22,
        textAlign: 'center',
        fontWeight: '500',
    },
});
