import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

// Sample data for cards
const activeCards = [
  {
    id: 1,
    name: 'Martin S01',
    serialNumber: '2100770084',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Martin S02',
    serialNumber: '2100770085',
    status: 'Active',
  },
];

const inactiveCards = [
  {
    id: 3,
    name: 'Martin S03',
    serialNumber: '2100770086',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Martin S04',
    serialNumber: '2100770087',
    status: 'Inactive',
  },
];

const dataMissingCards = [
  {
    id: 5,
    name: 'Martin S05',
    serialNumber: '2100770088',
    status: 'Data Missing',
  },
];

const filterOptions = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Data Missing', value: 'Data Missing' },
];

const useDashboard = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const allCards = [...activeCards, ...inactiveCards, ...dataMissingCards];

  // Function to filter cards based on search query
  const filterCardsBySearch = (cards: any[]) => {
    if (!searchQuery.trim()) {
      return cards;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return cards.filter(card => 
      card.name.toLowerCase().includes(query) || 
      card.serialNumber.toLowerCase().includes(query)
    );
  };

  const getFilteredCards = () => {
    let filteredByStatus = {
      active: activeCards,
      inactive: inactiveCards,
      dataMissing: dataMissingCards,
    };

    // First filter by status
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

    // Then apply search filter to each category
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
        // Add your navigation logic here
    // For example: navigation.navigate(menuItem);
  };

  const handleRegisterXRGI = (): void => {
    (navigation as any).navigate('Register');
  }

  return {
    // State
    selectedFilter,
    dropdownVisible,
    searchQuery,
    sidebarVisible,
    
    // Data
    filterOptions,
    filteredCards: getFilteredCards(),
    
    // Actions
    setDropdownVisible,
    setSidebarVisible,
    handleFilterSelect,
    handleSearchChange,
    handleSidebarMenuPress,
    handleRegisterXRGI,
  };
};

export default useDashboard;