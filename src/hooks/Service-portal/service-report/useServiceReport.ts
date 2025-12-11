import { RegisterController } from '@/controllers/RegisterController';
import { Facility, UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { useCallback, useEffect, useState } from 'react';

interface UseServiceReportReturn {
    systems: Facility[];
    isLoading: boolean;
    error: string | null;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    handleSystemPress: (system: Facility) => void;
    handleBackButton: () => void;
}

const useServiceReport = (navigation: any): UseServiceReportReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [systems, setSystems] = useState<Facility[]>([]);

    const handleBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSystemPress = useCallback((system: Facility) => {
        navigation.navigate('ServiceReportDetail', { system });
    }, [navigation]);

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

    return {
        isLoading,
        error,
        systems,
        getStatusColor,
        getStatusText,
        handleSystemPress,
        handleBackButton
    };
};

export default useServiceReport;
