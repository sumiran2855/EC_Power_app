import { SystemController } from '@/controllers/SystemController';
import { useCallback, useEffect, useState } from 'react';

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
    loading: boolean;
    apiData: any;
}

const useSystemStatus = (): UseSystemStatusReturn => {
    const [apiData, setApiData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const statusData: StatusItem[] = [
        {
            icon: 'checkmark-circle',
            count: apiData?.ok || 0,
            label: 'Operating Normal',
            color: '#3B82F6',
            bgColor: '#EFF6FF',
            percentage: apiData ? ((apiData.ok / apiData.total) * 100) : 0,
            trend: 'up'
        },
        {
            icon: 'stop-circle',
            count: apiData?.fullstop || 0,
            label: 'Full Stop',
            color: '#EF4444',
            bgColor: '#FEF2F2',
            percentage: apiData ? ((apiData.fullstop / apiData.total) * 100) : 0,
            trend: 'down'
        },
        {
            icon: 'alert-circle',
            count: apiData?.alarmstop || 0,
            label: 'Alarm Stop',
            color: '#F59E0B',
            bgColor: '#FFFBEB',
            percentage: apiData ? ((apiData.alarmstop / apiData.total) * 100) : 0,
            trend: 'up'
        },
        {
            icon: 'call-outline',
            count: apiData?.notcalled || 0,
            label: 'Stopped Calling',
            color: '#8B5CF6',
            bgColor: '#F5F3FF',
            percentage: apiData ? ((apiData.notcalled / apiData.total) * 100) : 0,
            trend: 'neutral'
        },
        {
            icon: 'pause-circle',
            count: apiData?.standby || 0,
            label: 'Standby Mode',
            color: '#EC4899',
            bgColor: '#FDF2F8',
            percentage: apiData ? ((apiData.standby / apiData.total) * 100) : 0,
            trend: 'down'
        },
        {
            icon: 'flask',
            count: apiData?.testsites || 0,
            label: 'Test System',
            color: '#14B8A6',
            bgColor: '#F0FDFA',
            percentage: apiData ? ((apiData.testsites / apiData.total) * 100) : 0,
            trend: 'up'
        },
        {
            icon: 'construct',
            count: apiData?.underinstallation || 0,
            label: 'Under Installation',
            color: '#06B6D4',
            bgColor: '#ECFEFF',
            percentage: apiData ? ((apiData.underinstallation / apiData.total) * 100) : 0,
            trend: 'neutral'
        },
        {
            icon: 'time',
            count: apiData?.parked || 0,
            label: 'Waiting Position',
            color: '#6366F1',
            bgColor: '#EEF2FF',
            percentage: apiData ? ((apiData.parked / apiData.total) * 100) : 0,
            trend: 'up'
        },
    ];

    const totalUnits = apiData?.total || 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await SystemController.GetSystemStatus();
                setApiData(data);
            } catch (error) {
                console.log("Error fetching system status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        loading,
        apiData,
    };
};

export default useSystemStatus;
