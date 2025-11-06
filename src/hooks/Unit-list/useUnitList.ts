import { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export interface SystemData {
    id: string;
    systemName: string;
    xrgiId: string;
    recentCalls: string;
    country: string;
    status: 'active' | 'inactive' | 'maintenance';
}

const useUnitList = (navigation: NativeStackNavigationProp<RootStackParamList, 'UnitList'>) => {
    const systems: SystemData[] = [
        {
            id: '1',
            systemName: 'XRGI® 25',
            xrgiId: '1470167385',
            recentCalls: '5',
            country: 'US',
            status: 'active'
        },
        {
            id: '2',
            systemName: 'XRGI® 25',
            xrgiId: '1470167392',
            recentCalls: '12',
            country: 'US',
            status: 'active'
        },
        {
            id: '3',
            systemName: 'XRGI® 25',
            xrgiId: '1470167401',
            recentCalls: '-',
            country: 'US',
            status: 'maintenance'
        }
    ];

    const handleBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSystemPress = useCallback((system: SystemData) => {
        navigation.navigate('UnitDetail');
        console.log('Navigate to system:', system.id);
    }, [navigation]);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'active':
                return '#10b981';
            case 'inactive':
                return '#ef4444';
            case 'maintenance':
                return '#f59e0b';
            default:
                return '#64748b';
        }
    }, []);

    const getStatusText = useCallback((status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }, []);

    return {
        // State
        systems,
        
        // Handlers
        handleBackButton,
        handleSystemPress,
        getStatusColor,
        getStatusText,
        
        // Computed values
        totalSystems: systems.length,
        activeSystems: systems.filter(s => s.status === 'active').length
    };
};

export default useUnitList;
