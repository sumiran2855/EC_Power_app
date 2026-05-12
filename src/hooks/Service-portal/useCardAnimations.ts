import { useRef } from 'react';
import { Animated } from 'react-native';

export const useCardAnimations = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animatedStyle = {
        transform: [{ scale: scaleAnim }],
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            damping: 15,
            stiffness: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            damping: 15,
            stiffness: 100,
            useNativeDriver: true,
        }).start();
    };

    const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up':
                return '#10B981';
            case 'down':
                return '#EF4444';
            default:
                return '#64748B';
        }
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up':
                return 'trending-up';
            case 'down':
                return 'trending-down';
            default:
                return 'remove';
        }
    };

    return {
        scaleAnim,
        animatedStyle,
        handlePressIn,
        handlePressOut,
        getTrendColor,
        getTrendIcon,
    };
};

export default useCardAnimations;
