import { RegisterController } from '@/controllers/RegisterController';
import { Facility, UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { useCallback, useEffect, useState } from 'react';

export interface SystemData {
    id: string;
    systemName: string;
    xrgiId: string;
    recentCalls: string;
    country: string;
    status: 'Active' | 'Inactive' | 'Data Missing';
}
interface UseStatisticsReturn {
    systems: Facility[];
    isLoading: boolean;
    error: string | null;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    activeSystemsCount: number;
    totalSystemsCount: number;
}

const useStatistics = (): UseStatisticsReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [systems, setSystems] = useState<Facility[]>([]);

    const GetFacilityStatistics = async () => {
        setIsLoading(true);
        setError(null);
        const userData = await StorageService.user.getData<UserData>();
        if (!userData) {
            return null;
        }
        try {
            const response = await RegisterController.GetFacilityList(userData?.id);
            const transformedData: Facility[] = response?.success ? response.data?.map((facility: any) => ({
                id: facility.id,
                name: facility.name,
                status: facility.status,
                xrgiID: facility.xrgiID,
                hasServiceContract: facility.hasServiceContract,
                modelNumber: facility.modelNumber,
                location: {
                    country: facility.location?.country,
                },
            })) : [];
            setSystems(transformedData);
            return null;
        } catch (error) {
            console.log('Error fetching facility statistics:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        GetFacilityStatistics();
    }, []);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'Active':
                return '#10b981';
            case 'Inactive':
                return '#ef4444';
            case 'Data Missing':
                return '#f59e0b';
            default:
                return '#64748b';
        }
    }, []);

    const getStatusText = useCallback((status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }, []);

    const activeSystemsCount = systems.filter(s => s.status === 'Active').length;
    const totalSystemsCount = systems.length;

    return {
        systems,
        isLoading,
        error,
        getStatusColor,
        getStatusText,
        activeSystemsCount,
        totalSystemsCount
    };
};

export default useStatistics;
