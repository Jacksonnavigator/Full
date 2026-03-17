import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// NEW: Import new architecture components
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // NEW: Use the new useAuth hook
    const { login, isLoading, error } = useAuth();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please enter email and password');
            return;
        }

        try {
            // Use the new login method from useAuth hook
            const result = await login({
                email: email.trim(),
                password: password.trim()
            });

            if (result && result.success === false) {
                Alert.alert('Login Failed', result.error || 'Please check your credentials');
                return;
            }

            // Setup and show local notification (keeping this feature)
            try {
                if (Platform.OS === 'android') {
                    try {
                        await Notifications.setNotificationChannelAsync('default', {
                            name: 'default',
                            importance: Notifications.AndroidImportance.DEFAULT
                        });
                    } catch (channelError) {
                        console.warn('Notification channel setup warning:', channelError);
                    }
                }

                try {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Welcome back!',
                            body: `Successfully logged in to HydraNet`,
                            sound: true
                        },
                        trigger: null
                    });
                } catch (scheduleError) {
                    console.warn('Notification schedule warning:', scheduleError);
                }
            } catch (notifError) {
                console.warn('Notification setup warning:', notifError);
            }
        } catch (error: any) {
            // Error handling is now built into useAuth hook
            Alert.alert('Login Failed', error.message || 'Please check your credentials');
        }
    };

    const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !isLoading;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <LinearGradient
                colors={[colors.secondary, colors.background, colors.background] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.card}>
                    <View style={styles.logoRow}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/icon.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.appTitle}>HydraNet Engineer</Text>
                            <Text style={styles.subtitle}>Field repair task companion</Text>
                        </View>
                    </View>

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor={colors.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        editable={!isLoading}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor={colors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                        style={styles.input}
                    />

                    {/* NEW: Use the new Button component */}
                    <Button
                        label="Login"
                        onPress={handleLogin}
                        loading={isLoading}
                        disabled={!canSubmit}
                        style={styles.loginButton}
                    />

                    {/* NEW: Show error from useAuth hook if any */}
                    {error && (
                        <Text style={styles.errorText}>{error.message}</Text>
                    )}
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing['4xl']
    },
    card: {
        backgroundColor: colors.cardLight,
        borderRadius: borderRadius['2xl'],
        padding: spacing['3xl'],
        ...shadows['2xl'],
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing['3xl']
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.brandPrimarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
        ...shadows.md,
    },
    logo: {
        width: 48,
        height: 48,
    },
    appTitle: {
        fontSize: typography.fontSize['4xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.brandDark,
        marginBottom: spacing.xs,
        letterSpacing: typography.letterSpacing.tight,
    },
    subtitle: {
        fontSize: typography.fontSize.base,
        color: colors.textLight,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textMedium,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: Platform.OS === 'ios' ? spacing.lg : spacing.md,
        borderWidth: 2,
        borderColor: colors.borderLight,
        fontSize: typography.fontSize.base,
        color: colors.textDark,
        ...shadows.sm,
    },
    roleRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    roleButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: colors.borderMedium,
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: colors.backgroundLight,
    },
    roleButtonSelected: {
        borderColor: colors.brandPrimary,
    },
    roleButtonText: {
        fontSize: typography.fontSize.base,
        color: colors.textMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    roleButtonTextSelected: {
        color: colors.cardLight,
    },
    loginButton: {
        marginTop: spacing['3xl'],
    },
    errorText: {
        marginTop: spacing.md,
        color: colors.error,
        fontSize: typography.fontSize.sm,
        textAlign: 'center',
        fontWeight: typography.fontWeight.medium,
    }
});
