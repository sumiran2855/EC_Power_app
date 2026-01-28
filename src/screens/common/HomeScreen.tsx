import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useHome, { MenuItem, Section } from '../../hooks/useHome';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './HomeScreen.styles';

const HomeScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const {
        // State
        searchVisible,
        searchQuery,
        showProfileMenu,
        dropdownAnimation,
        filteredSections,
        customerDetails,
        viewMode,

        // Handlers
        setSearchQuery,
        toggleProfileMenu,
        toggleViewMode,
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

                    {/* View Mode Toggle - Header */}
                    <View style={styles.headerToggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.viewModeToggleButton,
                                viewMode === 'easy' && styles.viewModeToggleButtonActive,
                                viewMode !== 'easy' && styles.viewModeToggleButtonInactive,
                            ]}
                            onPress={toggleViewMode}
                            activeOpacity={0.8}
                        >
                            <Icon name="lightbulb" size={14} color={viewMode === 'easy' ? '#FFFFFF' : '#90A4AE'} />
                            <Text style={[styles.viewModeToggleText, viewMode === 'easy' && styles.viewModeToggleTextActive]}>
                                {t('home.viewMode.easy')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.viewModeToggleButton,
                                viewMode === 'advanced' && styles.viewModeToggleButtonActive,
                                viewMode !== 'advanced' && styles.viewModeToggleButtonInactive,
                            ]}
                            onPress={toggleViewMode}
                            activeOpacity={0.8}
                        >
                            <Icon name="settings" size={14} color={viewMode === 'advanced' ? '#FFFFFF' : '#90A4AE'} />
                            <Text style={[styles.viewModeToggleText, viewMode === 'advanced' && styles.viewModeToggleTextActive]}>
                                {t('home.viewMode.advanced')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={handleSearchToggle}
                            activeOpacity={0.7}
                        >
                            <Icon name="search" size={22} color="#546E7A" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={toggleProfileMenu}
                            activeOpacity={0.8}
                        >
                            <View style={styles.profileAvatar}>
                                <Text style={styles.profileAvatarText}>{customerDetails?.contactPerson?.firstName.trim().charAt(0)}{customerDetails?.contactPerson?.lastName.trim().charAt(0)}</Text>
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
                                            <Text style={styles.dropdownAvatarText}>{customerDetails?.contactPerson?.firstName.trim().charAt(0)}{customerDetails?.contactPerson?.lastName.trim().charAt(0)}</Text>
                                        </View>
                                        <View style={styles.dropdownUserInfo}>
                                            <Text style={styles.dropdownUserName}>{customerDetails?.contactPerson?.firstName} {customerDetails?.contactPerson?.lastName}</Text>
                                            <Text style={styles.dropdownUserEmail}>{customerDetails?.contactPerson?.personalEmail}</Text>
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
                                    <Text style={styles.dropdownItemText}>{t('home.profile.myProfile')}</Text>
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
                                    <Text style={styles.dropdownItemText}>{t('home.profile.settings')}</Text>
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
                                    <Text style={[styles.dropdownItemText, styles.logoutText]}>{t('home.profile.logout')}</Text>
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
                            placeholder={t('home.search.placeholder')}
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
                        <Text style={styles.noResultsText}>{t('home.search.noResults')}</Text>
                        <Text style={styles.noResultsSubtext}>{t('home.search.tryDifferent')}</Text>
                    </View>
                )}

                {/* Help Card */}
                 {viewMode === 'easy' && (
                    <View style={styles.helpCard}>
                        <View style={styles.helpContent}>
                            <View style={styles.helpTextContainer}>
                                <Text style={styles.helpTitle}>{t('home.help.title')}</Text>
                                <Text style={styles.helpDescription}>
                                    {t('home.help.description')}
                                </Text>
                                <TouchableOpacity
                                    style={styles.helpButton}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('Contact')}
                                >
                                    <Text style={styles.helpButtonText}>{t('home.help.button')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.helpIconContainer}>
                                <Icon name="help-outline" size={32} color="#FFFFFF" />
                            </View>
                        </View>
                    </View>
                 )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;