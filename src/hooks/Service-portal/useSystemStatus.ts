import { useCallback } from 'react';

export interface StatusItem {
    icon: 'checkmark-circle' | 'stop-circle' | 'alert-circle' | 'call-outline' | 'pause-circle' | 'flask' | 'construct' | 'time';
    count: number;
    label: string;
    color: string;
    bgColor: string;
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
}

interface UseSystemStatusReturn {
    statusData: StatusItem[];
    totalUnits: number;
    getStatsBarData: () => Array<{ color: string; percentage: number }>;
    getCardRows: () => StatusItem[][];
}

const useSystemStatus = (): UseSystemStatusReturn => {
    const statusData: StatusItem[] = [
        {
            icon: 'checkmark-circle',
            count: 1202,
            label: 'Operating Normal',
            color: '#3B82F6',
            bgColor: '#EFF6FF',
            percentage: 65,
            trend: 'up'
        },
        {
            icon: 'stop-circle',
            count: 6601,
            label: 'Full Stop',
            color: '#EF4444',
            bgColor: '#FEF2F2',
            percentage: 85,
            trend: 'down'
        },
        {
            icon: 'alert-circle',
            count: 1202,
            label: 'Alarm Stop',
            color: '#F59E0B',
            bgColor: '#FFFBEB',
            percentage: 45,
            trend: 'up'
        },
        {
            icon: 'call-outline',
            count: 6601,
            label: 'Stopped Calling',
            color: '#8B5CF6',
            bgColor: '#F5F3FF',
            percentage: 72,
            trend: 'neutral'
        },
        {
            icon: 'pause-circle',
            count: 1202,
            label: 'Standby Mode',
            color: '#EC4899',
            bgColor: '#FDF2F8',
            percentage: 38,
            trend: 'down'
        },
        {
            icon: 'flask',
            count: 6601,
            label: 'Test System',
            color: '#14B8A6',
            bgColor: '#F0FDFA',
            percentage: 90,
            trend: 'up'
        },
        {
            icon: 'construct',
            count: 1202,
            label: 'Under Installation',
            color: '#06B6D4',
            bgColor: '#ECFEFF',
            percentage: 55,
            trend: 'neutral'
        },
        {
            icon: 'time',
            count: 6601,
            label: 'Waiting Position',
            color: '#6366F1',
            bgColor: '#EEF2FF',
            percentage: 68,
            trend: 'up'
        },
    ];

    const totalUnits = statusData.reduce((sum, item) => sum + item.count, 0);

    const getStatsBarData = useCallback(() => {
        return statusData.map(item => ({
            color: item.color,
            percentage: (item.count / totalUnits) * 100,
        }));
    }, [statusData, totalUnits]);

    const getCardRows = useCallback(() => {
        const rows = [];
        for (let i = 0; i < statusData.length; i += 2) {
            rows.push(statusData.slice(i, i + 2));
        }
        return rows;
    }, [statusData]);

    return {
        statusData,
        totalUnits,
        getStatsBarData,
        getCardRows,
    };
};

export default useSystemStatus;
