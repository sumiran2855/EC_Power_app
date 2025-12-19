import { useState, useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '@/controllers/UserController';
import StorageService from '@/utils/secureStorage';
import { UserData } from '@/screens/authScreens/types';
import { useTranslation } from 'react-i18next';

export interface MenuItem {
    id: string;
    title: string;
    icon: keyof typeof Icon.glyphMap;
    color: string;
    subtitle: string;
}

export interface Section {
    id: string;
    title: string;
    items: MenuItem[];
}

const useHome = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const dropdownAnimation = useRef(new Animated.Value(0)).current;
    const [customerDetails, setCustomerDetails] = useState<any>(null);

    const allSections: Section[] = [
        {
            id: '1',
            title: t('home.sections.productPortal'),
            items: [
                {
                    id: '1-1',
                    title: t('home.menuItems.xrgiSystems.title'),
                    icon: 'devices',
                    color: '#1E88E5',
                    subtitle: t('home.menuItems.xrgiSystems.subtitle')
                },
                {
                    id: '1-2',
                    title: t('home.menuItems.serviceContracts.title'),
                    icon: 'assignment',
                    color: '#43A047',
                    subtitle: t('home.menuItems.serviceContracts.subtitle')
                },
            ],
        },
        {
            id: '2',
            title: t('home.sections.servicePortal'),
            items: [
                {
                    id: '2-1',
                    title: t('home.menuItems.systemStatus.title'),
                    icon: 'monitor',
                    color: '#8E24AA',
                    subtitle: t('home.menuItems.systemStatus.subtitle')
                },
                {
                    id: '2-2',
                    title: t('home.menuItems.statistics.title'),
                    icon: 'bar-chart',
                    color: '#8E24AA',
                    subtitle: t('home.menuItems.statistics.subtitle')
                },
                {
                    id: '2-3',
                    title: t('home.menuItems.systemConfiguration.title'),
                    icon: 'settings',
                    color: '#3949AB',
                    subtitle: t('home.menuItems.systemConfiguration.subtitle')
                },
                {
                    id: '2-4',
                    title: t('home.menuItems.serviceReports.title'),
                    icon: 'description',
                    color: '#F4511E',
                    subtitle: t('home.menuItems.serviceReports.subtitle')
                },
                {
                    id: '2-5',
                    title: t('home.menuItems.callDetails.title'),
                    icon: 'list',
                    color: '#F4511E',
                    subtitle: t('home.menuItems.callDetails.subtitle')
                },
                {
                    id: '2-6',
                    title: t('home.menuItems.energyProduction.title'),
                    icon: 'battery-charging-full',
                    color: '#1E88E5',
                    subtitle: t('home.menuItems.energyProduction.subtitle')
                },
            ],
        },
        {
            id: '3',
            title: t('home.sections.functionalPortal'),
            items: [
                {
                    id: '3-1',
                    title: t('home.menuItems.unitList.title'),
                    icon: 'contacts',
                    color: '#00897B',
                    subtitle: t('home.menuItems.unitList.subtitle')
                },
            ],
        },
    ];

    // Filter sections based on search query
    const filteredSections = allSections.filter(section => {
        if (!searchQuery.trim()) return true;
        return section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.items.some(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
    });

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
            case '3-1':
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

        // Handlers
        setSearchQuery,
        toggleProfileMenu,
        handleLogout,
        handleProfile,
        handleMenuPress,
        handleSearchToggle,
        handleSearchClose,
        setShowProfileMenu
    };
};

export default useHome;
