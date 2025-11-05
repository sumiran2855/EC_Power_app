import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type XRGISystem = {
    id: string;
    name: string;
    systemId: string;
    status: 'pending' | 'active' | 'inactive' | 'data-missing';
    image?: string;
};

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

    // Mock data - updated with matching statuses
    const systems: XRGISystem[] = [
        { id: '1', name: 'Sumiran S01', systemId: '2100770084', status: 'pending' },
        { id: '2', name: 'Sumiran S02', systemId: '2100770084', status: 'pending' },
        { id: '3', name: 'Sumiran S03', systemId: '2100770084', status: 'pending' },
        { id: '4', name: 'Sumiran S04', systemId: '2100770084', status: 'pending' },
        { id: '5', name: 'Martin S01', systemId: '2100770085', status: 'active' },
        { id: '6', name: 'Martin S02', systemId: '2100770086', status: 'active' },
        { id: '7', name: 'Wilson S01', systemId: '2100770087', status: 'active' },
    ];

    const filterOptions = [
        { label: 'All', value: 'All' },
        { label: 'Active', value: 'Active' },
        { label: 'Pending', value: 'Pending' },
    ];

    // Filter and search logic
    const filteredSystems = useMemo(() => {
        let filtered = systems;

        // Apply filter
        if (selectedFilter !== 'All') {
            const statusMap: Record<string, XRGISystem['status'] | null> = {
                'All': null,
                'Active': 'active',
                'Pending': 'pending',
            };
            const mappedStatus = statusMap[selectedFilter];
            if (mappedStatus) {
                filtered = filtered.filter(system => system.status === mappedStatus);
            }
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                system =>
                    system.name.toLowerCase().includes(query) ||
                    system.systemId.includes(query)
            );
        }

        return filtered;
    }, [searchQuery, selectedFilter]);

    // Separate systems by status
    const pendingSystems = useMemo(() => 
        filteredSystems.filter(s => s.status === 'pending'), 
        [filteredSystems]
    );
    
    const activeSystems = useMemo(() => 
        filteredSystems.filter(s => s.status === 'active'), 
        [filteredSystems]
    );

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleCardPress = (item: any) => {
        navigation.navigate('XRGI_Details', { item });
    };

    const handleDelete = (id: string) => {
        console.log('Delete system:', id);
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
