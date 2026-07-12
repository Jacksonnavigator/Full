export const animations = {
    // Duration in milliseconds
    duration: {
        fast: 150,
        normal: 250,
        slow: 350,
        slower: 500,
    },

    // Easing curves
    easing: {
        ease: 'ease' as const,
        easeIn: 'ease-in' as const,
        easeOut: 'ease-out' as const,
        easeInOut: 'ease-in-out' as const,
        linear: 'linear' as const,
    },

    // Spring configurations for Animated.spring
    spring: {
        gentle: {
            tension: 40,
            friction: 7,
        },
        medium: {
            tension: 50,
            friction: 7,
        },
        bouncy: {
            tension: 80,
            friction: 6,
        },
    },

    // Scale values for press animations
    scale: {
        press: 0.96,
        hover: 1.02,
    },
};
