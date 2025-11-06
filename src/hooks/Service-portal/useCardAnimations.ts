import { useSharedValue, withSpring } from 'react-native-reanimated';

export const useCardAnimations = () => {
    const scaleAnim = useSharedValue(1);

    const handlePressIn = () => {
        scaleAnim.value = withSpring(0.96, {
            damping: 15,
            stiffness: 100
        });
    };

    const handlePressOut = () => {
        scaleAnim.value = withSpring(1, {
            damping: 15,
            stiffness: 100
        });
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
        handlePressIn,
        handlePressOut,
        getTrendColor,
        getTrendIcon,
    };
};

export default useCardAnimations;
