import { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Facility } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { UserData } from '@/screens/authScreens/types';
import { RegisterController } from '@/controllers/RegisterController';

const useUnitList = (navigation: NativeStackNavigationProp<RootStackParamList, 'UnitList'>) => {
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
    }

    useEffect(() => {
        GetFacilityStatistics();
    }, []);

    const handleBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSystemPress = useCallback((system: Facility) => {
        navigation.navigate('UnitDetail', { system });
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

    return {
        // State
        systems,
        isLoading,
        error,

        // Handlers
        handleBackButton,
        handleSystemPress,
        getStatusColor,
        getStatusText,

        // Computed values
        totalSystems: systems.length,
        activeSystems: systems.filter(s => s.status === 'Active').length
    };
};

export default useUnitList;
