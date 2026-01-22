import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserController } from '@/controllers/UserController';
import { UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthController } from '../controllers/AuthController';
import { RootStackParamList } from '../navigation/AppNavigator';
import useViewMode from './useViewMode';

export interface MenuItem {
    id: string;
    title: string;
    icon: keyof typeof Icon.glyphMap;
    color: string;
    subtitle: string;
    inEasyView?: boolean;
}

export interface Section {
    id: string;
    title: string;
    items: MenuItem[];
}

const useHome = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
    const { viewMode, isLoading, toggleViewMode } = useViewMode();
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const dropdownAnimation = useRef(new Animated.Value(0)).current;
    const [customerDetails, setCustomerDetails] = useState<any>(null);

    // Build all sections with all items - filtering happens later based on viewMode
    const buildAllSections = useCallback((): Section[] => {
        return [
            {
                id: '2',
                title: t('home.sections.servicePortal'),
                items: [
                    {
                        id: '2-1',
                        title: t('home.menuItems.systemStatus.title'),
                        icon: 'monitor',
                        color: '#8E24AA',
                        subtitle: t('home.menuItems.systemStatus.subtitle'),
                        inEasyView: true,
                    },
                    {
                        id: '2-2',
                        title: t('home.menuItems.statistics.title'),
                        icon: 'bar-chart',
                        color: '#8E24AA',
                        subtitle: t('home.menuItems.statistics.subtitle'),
                        inEasyView: false,
                    },
                    {
                        id: '2-3',
                        title: t('home.menuItems.systemConfiguration.title'),
                        icon: 'settings',
                        color: '#3949AB',
                        subtitle: t('home.menuItems.systemConfiguration.subtitle'),
                        inEasyView: false,
                    },
                    {
                        id: '2-4',
                        title: t('home.menuItems.serviceReports.title'),
                        icon: 'description',
                        color: '#F4511E',
                        subtitle: t('home.menuItems.serviceReports.subtitle'),
                        inEasyView: false,
                    },
                    {
                        id: '2-5',
                        title: t('home.menuItems.callDetails.title'),
                        icon: 'list',
                        color: '#F4511E',
                        subtitle: t('home.menuItems.callDetails.subtitle'),
                        inEasyView: false,
                    },
                    {
                        id: '2-6',
                        title: t('home.menuItems.energyProduction.title'),
                        icon: 'battery-charging-full',
                        color: '#1E88E5',
                        subtitle: t('home.menuItems.energyProduction.subtitle'),
                        inEasyView: true,
                    },
                    {
                        id: '2-7',
                        title: t('home.menuItems.generalStatus.title'),
                        icon: 'power-settings-new',
                        color: '#00897B',
                        subtitle: t('home.menuItems.generalStatus.subtitle'),
                        inEasyView: true,
                    },
                ],
            },
            {
                id: '1',
                title: t('home.sections.productPortal'),
                items: [
                    {
                        id: '1-1',
                        title: t('home.menuItems.xrgiSystems.title'),
                        icon: 'devices',
                        color: '#1E88E5',
                        subtitle: t('home.menuItems.xrgiSystems.subtitle'),
                        inEasyView: true,
                    },
                    {
                        id: '1-2',
                        title: t('home.menuItems.serviceContracts.title'),
                        icon: 'assignment',
                        color: '#43A047',
                        subtitle: t('home.menuItems.serviceContracts.subtitle'),
                        inEasyView: false,
                    },
                ],
            },
        ];
    }, [t]);

    const allSections = buildAllSections();

    // Filter sections based on view mode
    const filterSectionsByViewMode = useCallback((sections: Section[]): Section[] => {
        if (viewMode === 'advanced') {
            return sections
                .map(section => ({
                    ...section,
                    items: section.items.filter(item => item.inEasyView === false),
                }))
                .filter(section => section.items.length > 0);
        } else {
            return sections
                .map(section => ({
                    ...section,
                    items: section.items.filter(item => item.inEasyView === true),
                }))
                .filter(section => section.items.length > 0);
        }
    }, [viewMode]);

    // Filter sections based on search query
    const searchFilteredSections = useMemo(() => {
        return allSections.filter(section => {
            if (!searchQuery.trim()) return true;
            return section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                section.items.some(item =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
                );
        });
    }, [allSections, searchQuery]);

    // Apply view mode filter
    const filteredSections = useMemo(() => {
        return filterSectionsByViewMode(searchFilteredSections);
    }, [filterSectionsByViewMode, searchFilteredSections]);

    const toggleProfileMenu = useCallback(() => {
        const toValue = showProfileMenu ? 0 : 1;

        if (!showProfileMenu && searchVisible) {
            setSearchVisible(false);
        }

        setShowProfileMenu(!showProfileMenu);

        Animated.spring(dropdownAnimation, {
            toValue,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    }, [showProfileMenu, searchVisible, dropdownAnimation]);

    const handleLogout = useCallback(() => {
        AuthController.logout();
        navigation.navigate('Login', { portalType: 'PRODUCT' });
        setShowProfileMenu(false);
    }, [navigation]);

    const handleProfile = useCallback(() => {
        navigation.navigate('Profile');
        setShowProfileMenu(false);
    }, [navigation]);

    const handleMenuPress = useCallback((item: MenuItem) => {
        console.log("showProfileMenu", showProfileMenu)
        if (showProfileMenu) {
            setShowProfileMenu(false);
        }

        // Handle navigation with proper type safety
        switch (item.id) {
            case '1-1':
                navigation.navigate('ProductDashboard');
                break;
            case '1-2':
                navigation.navigate('ServiceContract');
                break;
            case '2-1':
                navigation.navigate('SystemStatus');
                break;
            case '2-2':
                navigation.navigate('Statistics');
                break;
            case '2-3':
                navigation.navigate('SystemConfiguration');
                break;
            case '2-4':
                navigation.navigate('ServiceReport');
                break;
            case '2-5':
                navigation.navigate('CallDetails');
                break;
            case '2-6':
                navigation.navigate('EnergyProductionList');
                break;
            case '2-7':
                navigation.navigate('UnitList');
                break;
            default:
                console.warn(`No navigation defined for item ID: ${item.id}`);
        }
    }, [navigation]);

    const handleSearchToggle = useCallback(() => {
        if (showProfileMenu) {
            toggleProfileMenu();
        }
        setSearchVisible(!searchVisible);
    }, [searchVisible, showProfileMenu, toggleProfileMenu]);

    const handleSearchClose = useCallback(() => {
        setSearchVisible(false);
        setSearchQuery('');
    }, []);

    const getCustomerDetails = useCallback(async () => {
        const userData = await StorageService.user.getData<UserData>();
        if (!userData?.id) {
            return;
        }
        try {
            const response = await UserController.getCustomerDetail(userData?.id);
            if (!response!.success) {
                return;
            }
            setCustomerDetails(response!.data);
        } catch (error) {
            console.log("Error getting customer details", error);
        }
    }, []);

    useEffect(() => {
        getCustomerDetails();
    }, []);

    return {
        // State
        searchVisible,
        searchQuery,
        showProfileMenu,
        dropdownAnimation,
        filteredSections,
        customerDetails,
        viewMode,
        isLoading,

        // Handlers
        setSearchQuery,
        toggleProfileMenu,
        toggleViewMode,
        handleLogout,
        handleProfile,
        handleMenuPress,
        handleSearchToggle,
        handleSearchClose,
        setShowProfileMenu
    };
};

export default useHome;
