import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Card from '../../components/Card/Card';
import useServiceContract from '../../hooks/Product-portal/useServiceContract';
import styles from './ServiceContractScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Facility } from '../authScreens/types';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import { useTranslation } from 'react-i18next';

const ServiceContractScreen: React.FC = () => {
    const { t } = useTranslation();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Facility | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const {
        searchQuery,
        selectedFilter,
        showFilterModal,
        filterOptions,
        pendingSystems,
        activeSystems,
        isLoading,
        setSearchQuery,
        setShowFilterModal,
        handleBackButton,
        handleCardPress,
        handleFilterSelect,
        confirmDelete: confirmDeleteFromHook,
    } = useServiceContract();

    const handleDelete = (item: Facility) => {
        setSelectedItem(item);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        
        setDeleteLoading(true);
        try {
            await confirmDeleteFromHook(selectedItem);
        } catch (error) {
            console.log('Error deleting service contract unit', error);
        } finally {
            setDeleteLoading(false);
            setDeleteModalVisible(false);
            setSelectedItem(null);
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setSelectedItem(null);
    };

    const renderSystemCard = (system: Facility) => (
        <Card
            key={system.id}
            item={system}
            onPress={handleCardPress}
            onDelete={() => handleDelete(system)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#1a365d" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{t('serviceContract.title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('serviceContract.subtitle')}
                    </Text>
                </View>

                {/* Search and Filter Section */}
                <View style={styles.controlsSection}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#64748b" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('serviceContract.search.placeholder')}
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* FIXED: Dropdown with proper container */}
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={() => setShowFilterModal(!showFilterModal)}
                        >
                            <MaterialIcons name="filter-list" size={20} color="#1a365d" />
                            <Text style={styles.sortButtonText}>{t('serviceContract.filter.sortBy')}</Text>
                            <Ionicons
                                name="chevron-down"
                                size={16}
                                color="#1a365d"
                                style={showFilterModal ? styles.dropdownIconRotated : undefined}
                            />
                        </TouchableOpacity>

                        {/* Dropdown Menu */}
                        {showFilterModal && (
                            <ScrollView
                                style={styles.dropdownMenu}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                            >
                                {filterOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.dropdownItem,
                                            selectedFilter === option.value && styles.dropdownItemSelected
                                        ]}
                                        onPress={() => handleFilterSelect(option.value)}
                                    >
                                        <Text style={[
                                            styles.dropdownItemText,
                                            selectedFilter === option.value && styles.dropdownItemTextSelected
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {selectedFilter === option.value && (
                                            <MaterialIcons name="check" size={16} color="#1a5490" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1a5490" />
                        <Text style={styles.loadingText}>{t('serviceContract.loading')}</Text>
                    </View>
                ) : (
                    <>
                        {pendingSystems.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    {t('serviceContract.sections.pending')}
                                </Text>
                                {pendingSystems.map(renderSystemCard)}
                            </View>
                        )}

                        {/* Active Systems Section */}
                        {activeSystems.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    {t('serviceContract.sections.active')}
                                </Text>
                                {activeSystems.map(renderSystemCard)}
                            </View>
                        )}

                        {/* Empty State */}
                        {pendingSystems.length === 0 && activeSystems.length === 0 && !isLoading && (
                            <View style={styles.emptyState}>
                                <MaterialIcons name="search-off" size={64} color="#cbd5e1" />
                                <Text style={styles.emptyStateTitle}>{t('serviceContract.emptyState.title')}</Text>
                                <Text style={styles.emptyStateText}>
                                    {t('serviceContract.emptyState.message')}
                                </Text>
                            </View>
                        )}
                    </>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
            
            <DeleteConfirmationModal
                isVisible={deleteModalVisible}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                itemName={selectedItem?.name || selectedItem?.xrgiID}
                loading={deleteLoading}
            />
        </SafeAreaView>
    );
};

export default ServiceContractScreen;
