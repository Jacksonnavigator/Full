import React from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, glassStyle, shadows, spacing, fontFamily } from '../theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    gradient?: boolean;
    gradientColors?: string[];
    onPress?: (event: GestureResponderEvent) => void;
    padding?: keyof typeof spacing;
    shadow?: keyof typeof shadows;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    gradient = false,
    gradientColors,
    onPress,
    padding = 'lg',
    shadow = 'md',
}) => {
    const paddingValue = spacing[padding];
    const shadowStyle = shadows[shadow as keyof typeof shadows];

    if (gradient) {
        // Use frontend-synced gradient or fallback
        const gradColors = gradientColors || [colors.primary, colors.primaryDark];

        if (onPress) {
            return (
                <TouchableOpacity onPress={onPress} activeOpacity={0.86} style={style}>
                    <LinearGradient
                        colors={gradColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[
                            styles.card,
                            { padding: paddingValue, borderRadius: borderRadius },
                            glassStyle,
                            shadowStyle,
                        ]}
                    >
                        {children}
                    </LinearGradient>
                </TouchableOpacity>
            );
        }
        return (
            <LinearGradient
                colors={gradColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[
                    styles.card,
                    { padding: paddingValue, borderRadius: borderRadius },
                    glassStyle,
                    shadowStyle,
                    style,
                ]}
            >
                {children}
            </LinearGradient>
        );
    }

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.86}
                style={[
                    styles.card,
                    { padding: paddingValue },
                    shadowStyle,
                    style,
                ]}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View
            style={[
                styles.card,
                { padding: paddingValue, borderRadius: borderRadius },
                glassStyle,
                shadowStyle,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: borderRadius,
        fontFamily: fontFamily,
    },
});
