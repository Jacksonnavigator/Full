import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '@/hooks/useAuth';
import { BrandWordmark } from '@/components/shared/BrandWordmark';
import { Button } from '@/components/shared/Button';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const { login, isLoading, error, requestPasswordReset } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }

    try {
      const result = await login({
        email: email.trim(),
        password: password.trim(),
      });

      if (result && result.success === false) {
        Alert.alert('Login Failed', result.error || 'Please check your credentials');
      }
    } catch (loginError: any) {
      Alert.alert('Login Failed', loginError?.message || loginError || 'Please check your credentials');
    }
  };

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !isLoading;

  const handleForgotPassword = async () => {
    const targetEmail = (resetEmail || email).trim().toLowerCase();
    if (!targetEmail) {
      Alert.alert('Missing Email', 'Enter your account email so we can send the reset link.');
      return;
    }

    try {
      setIsRequestingReset(true);
      const result = await requestPasswordReset(targetEmail);

      if (!result.success) {
        Alert.alert('Reset Failed', result.error || 'Unable to send the reset link right now.');
        return;
      }

      if (result.resetUrl) {
        Alert.alert(
          'Reset Link Ready',
          `${result.message || 'A reset link is ready.'}\n\nIf email delivery is delayed, you can open the reset page directly now.`,
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Open Link',
              onPress: () => {
                void Linking.openURL(result.resetUrl as string);
              },
            },
          ],
        );
        return;
      }

      Alert.alert(
        'Check Your Email',
        result.message || 'If your account exists, a password reset email has been sent.',
      );
    } catch (resetError: any) {
      Alert.alert('Reset Failed', resetError?.message || 'Unable to send the reset link right now.');
    } finally {
      setIsRequestingReset(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <LinearGradient
          colors={['#dff4ff', '#edf7ff', '#f8fbff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.topGlow} />
          <View style={styles.bottomGlow} />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.logoWrap}>
                <View style={styles.logoContainer}>
                  <Image
                    source={require('../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <BrandWordmark size="lg" surface="light" />
              <Text style={styles.tagline}>Water Infrastructure Intelligence</Text>
              <Text style={styles.subtitle}>Sign in to access your dashboard and field work queue.</Text>

              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={colors.brandPrimary} />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.brandPrimary} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((current) => !current)}
                  activeOpacity={0.7}
                  style={styles.visibilityButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setShowResetForm((current) => !current);
                  setResetEmail((current) => current || email);
                }}
                activeOpacity={0.7}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {showResetForm ? (
                <View style={styles.resetCard}>
                  <Text style={styles.resetTitle}>Send password reset email</Text>
                  <Text style={styles.resetDescription}>
                    Enter the engineer or team leader email and Majiscope will send a secure reset link.
                  </Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="mail-outline" size={18} color={colors.brandPrimary} />
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor={colors.textMuted}
                      value={resetEmail}
                      onChangeText={setResetEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isRequestingReset}
                      style={styles.input}
                    />
                  </View>
                  <Button
                    label={isRequestingReset ? 'Sending...' : 'Send Reset Link'}
                    onPress={handleForgotPassword}
                    loading={isRequestingReset}
                    disabled={isRequestingReset}
                    fullWidth
                    style={styles.resetButton}
                  />
                </View>
              ) : null}

              <Button
                label="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                disabled={!canSubmit}
                fullWidth
                style={styles.loginButton}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Text style={styles.footerText}>
                MajiScope · Water Infrastructure Intelligence · Tanzania
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef9ff',
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  topGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(15, 95, 255, 0.10)',
    top: -70,
    right: -50,
  },
  bottomGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(45, 212, 191, 0.10)',
    bottom: -80,
    left: -40,
  },
  card: {
    backgroundColor: colors.cardLight,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.xl,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d9ebff',
    shadowColor: '#0f5fff',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  logo: {
    width: 58,
    height: 58,
  },
  tagline: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: typography.fontSize.xs,
    color: '#4f96b8',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.textMedium,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMedium,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    backgroundColor: '#f8fbff',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textDark,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  visibilityButton: {
    marginLeft: spacing.sm,
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.brandPrimary,
  },
  resetCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#f2f9ff',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#d6e8ff',
    gap: spacing.sm,
  },
  resetTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.brandDark,
  },
  resetDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.textMedium,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: spacing.xs,
  },
  loginButton: {
    marginTop: spacing.xl,
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.destructive,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  footerText: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
