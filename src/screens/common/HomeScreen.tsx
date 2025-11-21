import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    TextInput,
    Image,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { styles } from './HomeScreen.styles';
import useHome, { MenuItem, Section } from '../../hooks/useHome';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const {
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
        setShowProfileMenu,
    } = useHome();

    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemContent}>
                <View style={[styles.iconWrapper, { backgroundColor: item.color + '15' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                        <Icon name={item.icon} size={22} color="#FFFFFF" />
                    </View>
                </View>
                <View style={styles.menuTextContainer}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
            </View>
            <Icon name="chevron-right" size={24} color="#90A4AE" />
        </TouchableOpacity>
    );

    const renderSection = (section: Section) => (
        <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.card}>
                {section.items.map((item, index) => (
                    <View key={item.id}>
                        {renderMenuItem(item)}
                        {index < section.items.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../assets/images/logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={handleSearchToggle}
                            activeOpacity={0.7}
                        >
                            <Icon name="search" size={22} color="#546E7A" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                            <Icon name="notifications-none" size={22} color="#546E7A" />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={toggleProfileMenu}
                            activeOpacity={0.8}
                        >
                            <View style={styles.profileAvatar}>
                                <Text style={styles.profileAvatarText}>JD</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <Animated.View
                                style={[
                                    styles.dropdownMenu,
                                    {
                                        opacity: dropdownAnimation,
                                        transform: [
                                            {
                                                translateY: dropdownAnimation.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-10, 0]
                                                })
                                            },
                                            {
                                                scale: dropdownAnimation.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.95, 1]
                                                })
                                            }
                                        ]
                                    }
                                ]}
                            >
                                <View style={styles.dropdownHeader}>
                                    <View style={styles.dropdownProfileSection}>
                                        <View style={styles.dropdownAvatar}>
                                            <Text style={styles.dropdownAvatarText}>JD</Text>
                                        </View>
                                        <View style={styles.dropdownUserInfo}>
                                            <Text style={styles.dropdownUserName}>John Doe</Text>
                                            <Text style={styles.dropdownUserEmail}>Joe Interpreter</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.dropdownDivider} />

                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={handleProfile}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.dropdownIconWrapper}>
                                        <Icon name="person-outline" size={20} color="#546E7A" />
                                    </View>
                                    <Text style={styles.dropdownItemText}>My Profile</Text>
                                    <Icon name="chevron-right" size={18} color="#B0BEC5" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setShowProfileMenu(false);
                                        navigation.navigate('Setting');
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.dropdownIconWrapper}>
                                        <Icon name="settings" size={20} color="#546E7A" />
                                    </View>
                                    <Text style={styles.dropdownItemText}>Settings</Text>
                                    <Icon name="chevron-right" size={18} color="#B0BEC5" />
                                </TouchableOpacity>

                                <View style={styles.dropdownDivider} />

                                <TouchableOpacity
                                    style={[styles.dropdownItem, styles.logoutItem]}
                                    onPress={handleLogout}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.dropdownIconWrapper, styles.logoutIconWrapper]}>
                                        <Icon name="logout" size={20} color="#E53935" />
                                    </View>
                                    <Text style={[styles.dropdownItemText, styles.logoutText]}>Logout</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                </View>

                {/* Search Bar */}
                {searchVisible && (
                    <View style={styles.searchContainer}>
                        <Icon name="search" size={20} color="#90A4AE" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search portals and services..."
                            placeholderTextColor="#90A4AE"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            returnKeyType="search"
                            onSubmitEditing={handleSearchClose}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={handleSearchClose}
                                style={styles.clearButton}
                            >
                                <Icon name="close" size={20} color="#90A4AE" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >

                {/* Sections */}
                {filteredSections.length > 0 ? (
                    filteredSections.map(renderSection)
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Icon name="search-off" size={48} color="#90A4AE" />
                        <Text style={styles.noResultsText}>No results found</Text>
                        <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                    </View>
                )}

                {/* Help Card */}
                <View style={styles.helpCard}>
                    <View style={styles.helpContent}>
                        <View style={styles.helpTextContainer}>
                            <Text style={styles.helpTitle}>Need Assistance?</Text>
                            <Text style={styles.helpDescription}>
                                Our support team is here to help you 24/7
                            </Text>
                            <TouchableOpacity
                                style={styles.helpButton}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('Contact')}
                            >
                                <Text style={styles.helpButtonText}>Contact Support</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.helpIconContainer}>
                            <Icon name="help-outline" size={32} color="#FFFFFF" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;