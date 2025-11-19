import { RegisterController } from '@/controllers/RegisterController';
import { Facility, UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { useCallback, useEffect, useState } from 'react';

interface UseSystemConfigurationReturn {
    systems: Facility[];
    handleBackButton: () => void;
    handleSystemPress: (system: Facility) => void;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    isLoading: boolean;
}

const useSystemConfiguration = (navigation: any): UseSystemConfigurationReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [systems, setSystems] = useState<Facility[]>([]);

    const handleBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSystemPress = useCallback((system: Facility) => {
        navigation.navigate('SystemConfigurationDetail', { system });
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

    const getFacilityList = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        const userData = await StorageService.user.getData<UserData>();
        if (!userData) {
            return null;
        }
        try {
            const response = await RegisterController.GetFacilityList(userData?.id);
            const transformedData: Facility[] = response?.success ? response.data?.map((facility: any) => ({
                id: facility.id,
                name: facility.name,
                status: facility.hasServiceContract ? 'Active' : 'Inactive',
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
            console.error('Error fetching facility statistics:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getFacilityList();
    }, []);

    return {
        systems,
        handleBackButton,
        handleSystemPress,
        getStatusColor,
        getStatusText,
        isLoading
    };
};

export default useSystemConfiguration;
