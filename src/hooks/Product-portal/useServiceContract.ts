import { RegisterController } from '@/controllers/RegisterController';
import { Facility, UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
    XRGI_System: undefined;
    XRGI_Details: { item: Facility };
};

type XRGISystemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'XRGI_System'>;

const useServiceContract = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<XRGISystemScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [systems, setSystems] = useState<Facility[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filterOptions = [
        { label: t('serviceContract.filter.options.all'), value: 'All' },
        { label: t('serviceContract.filter.options.active'), value: 'Active' },
        { label: t('serviceContract.filter.options.pending'), value: 'Pending' },
    ];

    useEffect(() => {
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

    const handleDelete = (item: Facility) => {
        return item;
    };

    const confirmDelete = async (item: Facility) => {
        try {
            const response = await RegisterController.deleteXRGIUnit(item.id);
            if (response?.success) {
                await fetchSystems();
            }
        } catch (error) {
            console.log('Error deleting service contract unit', error);
        }
    };

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
        confirmDelete,
        fetchSystems,
    };
};

export default useServiceContract;
