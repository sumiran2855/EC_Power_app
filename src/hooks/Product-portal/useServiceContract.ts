import { RegisterController } from '@/controllers/RegisterController';
import { Facility, UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

type RootStackParamList = {
    XRGI_System: undefined;
    XRGI_Details: { item: Facility };
};

type XRGISystemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'XRGI_System'>;

const useServiceContract = () => {
    const navigation = useNavigation<XRGISystemScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [systems, setSystems] = useState<Facility[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filterOptions = [
        { label: 'All', value: 'All' },
        { label: 'Has Service Contract', value: 'Active' },
        { label: 'Requested', value: 'Pending' },
    ];

    useEffect(() => {
        const fetchSystems = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const userData = await StorageService.user.getData<UserData>();
                if (!userData?.id) {
                    setIsLoading(false);
                    return;
                }
                const response = await RegisterController.GetFacilityList(userData.id);
                const transformedData: Facility[] = response?.success ? response.data?.map((facility: any) => ({
                    id: facility.id || facility.xrgiID,
                    name: facility.name,
                    xrgiID: facility.xrgiID,
                    status: facility.hasServiceContract ? 'Active' : 'Inactive',
                    modelNumber: facility.modelNumber,
                    location: facility.location,
                    hasEnergyCheckPlus: facility.hasEnergyCheckPlus,
                    EnergyCheck_plus: facility.EnergyCheck_plus,
                    isInstalled: facility.isInstalled,
                    hasServiceContract: facility.hasServiceContract,
                    needServiceContract: facility.needServiceContract,
                    salesPartner: facility.salesPartner,
                    serviceProvider: facility.serviceProvider,
                    DaSigned: facility.DaSigned,
                    energyCheckPlus: facility.energyCheckPlus,
                    smartPriceControl: facility.smartPriceControl,
                    installedSmartPriceController: facility.installedSmartPriceController,
                    distributeHoursEvenly: facility.distributeHoursEvenly,
                })) : [];
                setSystems(transformedData);
            } catch (err: any) {
                console.log('Error fetching systems:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSystems();
    }, []);

    const filteredSystems = useMemo(() => {
        let filtered = systems;

        if (selectedFilter !== 'All') {
            const statusMap: Record<string, boolean> = {
                'Active': true,
                'Pending': false,
            };

            if (selectedFilter in statusMap) {
                const mappedStatus = statusMap[selectedFilter];
                filtered = filtered.filter(system => system.hasServiceContract === mappedStatus);
            }
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                system =>
                    system.name.toLowerCase().includes(query) ||
                    system.xrgiID.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [searchQuery, selectedFilter, systems]);


    // Separate systems by status
    const pendingSystems = useMemo(() =>
        filteredSystems.filter(s => s.hasServiceContract === false),
        [filteredSystems]
    );
    const activeSystems = useMemo(() =>
        filteredSystems.filter(s => s.hasServiceContract === true),
        [filteredSystems]
    );

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleCardPress = (item: Facility) => {
        navigation.navigate('XRGI_Details', { item });
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete System',
            'Are you sure you want to remove this system?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setSystems(prev => prev.filter(s => s.xrgiID !== id));
                    },
                },
            ]
        );
    };

    const handleFilterSelect = (filterValue: string) => {
        setSelectedFilter(filterValue);
        setShowFilterModal(false);
    };

    return {
        // State
        searchQuery,
        selectedFilter,
        showFilterModal,
        isLoading,
        error,

        // Data
        filterOptions,
        pendingSystems,
        activeSystems,

        // Handlers
        setSearchQuery,
        setShowFilterModal,
        handleBackButton,
        handleCardPress,
        handleDelete,
        handleFilterSelect,
    };
};

export default useServiceContract;
