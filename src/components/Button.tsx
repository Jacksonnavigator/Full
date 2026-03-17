import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, fontFamily, fontWeight, fontSize, buttonGradient } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
}) => {
    const getButtonContent = () => {
        const textColor = getTextColor();
        const sizePx = size === 'sm' ? fontSize.sm : size === 'lg' ? fontSize.lg : fontSize.md;
        return (
            <>
                {loading ? (
                    <ActivityIndicator color={textColor} size="small" />
                ) : (
                    <Text style={[styles.text, { color: textColor, fontSize: sizePx, fontFamily }, textStyle]}>
                        {title}
                    </Text>
                )}
            </>
        );
    };

    const getTextColor = () => {
        if (disabled) return colors.mutedForeground;
        if (variant === 'outline' || variant === 'ghost') return colors.primary;
        if (variant === 'secondary') return colors.foreground;
        return colors.primaryForeground;
    };

    const getPadding = () => {
        if (size === 'sm') return { paddingVertical: 8, paddingHorizontal: 16 };
        if (size === 'lg') return { paddingVertical: 16, paddingHorizontal: 24 };
        return { paddingVertical: 12, paddingHorizontal: 20 };
    };

    if (variant === 'primary' && !disabled) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.85}
                style={[fullWidth && { width: '100%' }, style]}
            >
                <LinearGradient
                    colors={buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.button,
                        getPadding(),
                        { borderRadius },
                    ]}
                >
                    {getButtonContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // For danger, secondary, outline, ghost, fallback to flat style for now

    // Fallback for other variants or disabled state
    const buttonStyle = [
        styles.button,
        getPadding(),
        variant === 'secondary' && { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1 },
        variant === 'outline' && { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 2 },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        disabled && styles.disabled,
        fullWidth && { width: '100%' },
        { borderRadius },
        style,
    ];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.85}
            style={buttonStyle}
        >
            {getButtonContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        backgroundColor: colors.muted,
        opacity: 0.5,
    },
    text: {
        fontWeight: fontWeight.semibold,
        fontFamily,
    },
});
