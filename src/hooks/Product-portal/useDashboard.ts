import { RegisterController } from '@/controllers/RegisterController';
import { Facility, UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useDashboard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { label: t('xrgiSystem.filter.options.all'), value: 'All' },
    { label: t('xrgiSystem.filter.options.active'), value: 'Active' },
    { label: t('xrgiSystem.filter.options.inactive'), value: 'Inactive' },
    { label: t('xrgiSystem.filter.options.dataMissing'), value: 'Data Missing' },
  ];

  // Function to filter cards based on search query
  const filterCardsBySearch = (cards: Facility[]) => {
    if (!searchQuery.trim()) {
      return cards;
    }

    const query = searchQuery.toLowerCase().trim();
    return cards.filter(card =>
      card.name.toLowerCase().includes(query) ||
      card.xrgiID.toLowerCase().includes(query)
    );
  };

  const getFilteredCards = () => {
    // Categorize facilities by status
    const activeCards = facilities.filter(f => f.status === 'Active');
    const inactiveCards = facilities.filter(f => f.status === 'Inactive');
    const dataMissingCards = facilities.filter(f => f.status === 'Data Missing');

    let filteredByStatus = {
      active: activeCards,
      inactive: inactiveCards,
      dataMissing: dataMissingCards,
    };

    // Filter by selected status
    if (selectedFilter === 'Active') {
      filteredByStatus = {
        active: activeCards,
        inactive: [],
        dataMissing: [],
      };
    } else if (selectedFilter === 'Inactive') {
      filteredByStatus = {
        active: [],
        inactive: inactiveCards,
        dataMissing: [],
      };
    } else if (selectedFilter === 'Data Missing') {
      filteredByStatus = {
        active: [],
        inactive: [],
        dataMissing: dataMissingCards,
      };
    }

    // Apply search filter to each category
    return {
      active: filterCardsBySearch(filteredByStatus.active),
      inactive: filterCardsBySearch(filteredByStatus.inactive),
      dataMissing: filterCardsBySearch(filteredByStatus.dataMissing),
    };
  };

  const handleFilterSelect = (filterValue: string) => {
    setSelectedFilter(filterValue);
    setDropdownVisible(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleSidebarMenuPress = (menuItem: string) => {
    console.log(`Navigating to: ${menuItem}`);
  };

  const handleRegisterXRGI = (): void => {
    (navigation as any).navigate('Register');
  };

  const HandleGetFacilityList = async () => {
    const userData = await StorageService.user.getData<UserData>();

    if (!userData?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await RegisterController.GetFacilityList(userData.id);
      const rawData = response?.success ? response.data : response;
      const transformedData = transformFacilities(rawData);

      setFacilities(transformedData);
    } catch (error) {
      console.log("Error getting facility list", error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function extracted to follow DRY principle
  const transformFacilities = (data: any): Facility[] => {
    if (!Array.isArray(data)) return [];

    return data.map((facility: any) => ({
      id: facility.id,
      name: facility.name,
      xrgiID: facility.xrgiID,
      status: facility.status || 'Data Missing',
      modelNumber: facility.modelNumber,
      location: facility.location,
      hasEnergyCheckPlus: facility.hasEnergyCheckPlus,
      isInstalled: facility.isInstalled,
      hasServiceContract: facility.hasServiceContract,
      needServiceContract: facility.needServiceContract,
      salesPartner: facility.salesPartner,
      serviceProvider: facility.serviceProvider,
      DaSigned: facility.DaSigned,
      EnergyCheck_plus: facility.EnergyCheck_plus,
      smartPriceControl: facility.smartPriceControl,
      installedSmartPriceController: facility.installedSmartPriceController,
      smartPriceControlAdded: facility.smartPriceControlAdded,
    }));
  };


  useEffect(() => {
    HandleGetFacilityList();
  }, []);

  return {
    // State
    selectedFilter,
    dropdownVisible,
    searchQuery,
    loading,

    // Data
    filterOptions,
    filteredCards: getFilteredCards(),

    // Actions
    setDropdownVisible,
    handleFilterSelect,
    handleSearchChange,
    handleSidebarMenuPress,
    handleRegisterXRGI,
    HandleGetFacilityList,
  };
};

export default useDashboard;