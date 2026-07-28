import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BrandWordmarkProps = {
    size?: 'sm' | 'md' | 'lg';
    surface?: 'light' | 'dark';
    centered?: boolean;
};

const sizeMap = {
    sm: 22,
    md: 32,
    lg: 44,
} as const;

export default function BrandWordmark({
    size = 'md',
    surface = 'dark',
    centered = true,
}: BrandWordmarkProps) {
    const fontSize = sizeMap[size];
    const scopeColors =
        surface === 'dark'
            ? ['#ffffff', '#ecfeff', '#cffafe', '#ecfeff', '#ffffff']
            : ['#0f172a', '#334155', '#475569', '#334155', '#0f172a'];

    return (
        <View style={[styles.wrap, centered ? styles.center : styles.left]}>
            <Text style={[styles.wordmark, { fontSize }]}>
                <Text style={styles.majiM}>M</Text>
                <Text style={styles.majiA}>a</Text>
                <Text style={styles.majiJ}>j</Text>
                <Text style={styles.majiI}>i</Text>
                <Text style={[styles.scopeBase, { color: scopeColors[0] }]}>S</Text>
                <Text style={[styles.scopeBase, { color: scopeColors[1] }]}>c</Text>
                <Text style={[styles.scopeBase, { color: scopeColors[2] }]}>o</Text>
                <Text style={[styles.scopeBase, { color: scopeColors[3] }]}>p</Text>
                <Text style={[styles.scopeBase, { color: scopeColors[4] }]}>e</Text>
            </Text>
            <View style={styles.underlineRow}>
                <View style={styles.underlineSide} />
                <View style={styles.underlineCenter} />
                <View style={styles.underlineSide} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        position: 'relative',
    },
    center: {
        alignItems: 'center',
    },
    left: {
        alignItems: 'flex-start',
    },
    wordmark: {
        fontWeight: '900',
        letterSpacing: -0.4,
        textShadowColor: 'rgba(14, 165, 233, 0.26)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    majiM: {
        color: '#67e8f9',
        fontWeight: '900',
    },
    majiA: {
        color: '#60a5fa',
        fontWeight: '900',
    },
    majiJ: {
        color: '#38bdf8',
        fontWeight: '900',
    },
    majiI: {
        color: '#5eead4',
        fontWeight: '900',
    },
    scopeBase: {
        fontWeight: '900',
    },
    underlineRow: {
        marginTop: 6,
        width: 96,
        height: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    underlineCenter: {
        width: 36,
        height: 4,
        borderRadius: 999,
        backgroundColor: '#22d3ee',
    },
    underlineSide: {
        flex: 1,
        height: 3,
        borderRadius: 999,
        backgroundColor: 'rgba(34, 211, 238, 0.22)',
    },
});
