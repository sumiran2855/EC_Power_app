import { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';
import StorageService from '@/utils/secureStorage';
import { RegisterController } from '@/controllers/RegisterController';
import { Facility, UserData } from '@/screens/authScreens/types';

type RootStackParamList = {
    XRGI_System: undefined;
    XRGI_Details: { item: any };
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
                    name: facility.name,
                    status: facility.hasServiceContract ? 'active' : 'pending',
                    xrgiID: facility.xrgiID,
                    hasServiceContract: facility.hasServiceContract,
                })) : [];
                setSystems(transformedData);
            } catch (err: any) {
                console.error('Error fetching systems:', err);
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

    const handleCardPress = (item: any) => {
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
