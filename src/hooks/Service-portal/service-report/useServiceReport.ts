import { useCallback } from 'react';

export interface SystemData {
    id: string;
    systemName: string;
    xrgiId: string;
    recentCalls: string;
    country: string;
    status: 'active' | 'inactive' | 'maintenance';
}

interface UseServiceReportReturn {
    systems: SystemData[];
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    handleSystemPress: (system: SystemData) => void;
    handleBackButton: () => void;
}

const useServiceReport = (navigation: any): UseServiceReportReturn => {
    // Navigation handlers
    const handleBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSystemPress = useCallback((system: SystemData) => {
        // Navigate to the detail screen with system data
        navigation.navigate('ServiceReportDetail', { system });
        console.log('Navigate to system:', system.id);
    }, [navigation]);

    // Sample data - replace with your actual data
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
        systems,
        getStatusColor,
        getStatusText,
        handleSystemPress,
        handleBackButton
    };
};

export default useServiceReport;
