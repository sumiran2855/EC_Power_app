import { useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { StorageService } from '../services/StorageService';
import { AuthController } from '../controllers/AuthController';

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
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const dropdownAnimation = useRef(new Animated.Value(0)).current;

    const allSections: Section[] = [
        {
            id: '1',
            title: 'Product Portal',
            items: [
                {
                    id: '1-1',
                    title: 'XRGI® Systems',
                    icon: 'devices',
                    color: '#1E88E5',
                    subtitle: 'Manage your systems'
                },
                {
                    id: '1-2',
                    title: 'Service Contracts',
                    icon: 'assignment',
                    color: '#43A047',
                    subtitle: 'View all contracts'
                },
            ],
        },
        {
            id: '2',
            title: 'Service Portal',
            items: [
                {
                    id: '2-1',
                    title: 'System Status',
                    icon: 'monitor',
                    color: '#8E24AA',
                    subtitle: 'View system status'
                },
                {
                    id: '2-2',
                    title: 'Statistics',
                    icon: 'bar-chart',
                    color: '#8E24AA',
                    subtitle: 'View analytics'
                },
                {
                    id: '2-3',
                    title: 'System Configuration',
                    icon: 'settings',
                    color: '#3949AB',
                    subtitle: 'Configure settings'
                },
                {
                    id: '2-4',
                    title: 'Service Reports',
                    icon: 'description',
                    color: '#F4511E',
                    subtitle: 'Access reports'
                },
                {
                    id: '2-5',
                    title: 'Call Details',
                    icon: 'list',
                    color: '#F4511E',
                    subtitle: 'View call details'
                },
            ],
        },
        {
            id: '3',
            title: 'Functional Portal',
            items: [
                {
                    id: '3-1',
                    title: 'Unit List',
                    icon: 'contacts',
                    color: '#00897B',
                    subtitle: 'XRGI® units'
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

    return {
        // State
        searchVisible,
        searchQuery,
        showProfileMenu,
        dropdownAnimation,
        filteredSections,

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
