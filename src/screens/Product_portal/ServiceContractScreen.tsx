import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
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

const ServiceContractScreen: React.FC = () => {
    const {
        searchQuery,
        selectedFilter,
        showFilterModal,
        filterOptions,
        pendingSystems,
        activeSystems,
        setSearchQuery,
        setShowFilterModal,
        handleBackButton,
        handleCardPress,
        handleDelete,
        handleFilterSelect,
    } = useServiceContract();

    const renderSystemCard = (system: any) => (
        <Card
            key={system.id}
            item={{
                ...system,
                status: system.status as any,
                serialNumber: system.systemId,
            }}
            onPress={handleCardPress}
            onDelete={handleDelete}
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
                    <Text style={styles.title}>Service Contracts</Text>
                    <Text style={styles.subtitle}>
                        View and manage all XRGi® systems that have an associated service partner
                    </Text>
                </View>

                {/* Search and Filter Section */}
                <View style={styles.controlsSection}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#64748b" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or XRGI ID"
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
                            <Text style={styles.sortButtonText}>Sort by : </Text>
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

                {pendingSystems.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            XRGi® systems requesting a service contract
                        </Text>
                        {pendingSystems.map(renderSystemCard)}
                    </View>
                )}

                {/* Active Systems Section */}
                {activeSystems.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            XRGi® systems with active service contract
                        </Text>
                        {activeSystems.map(renderSystemCard)}
                    </View>
                )}

                {/* Empty State */}
                {pendingSystems.length === 0 && activeSystems.length === 0 && (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="search-off" size={64} color="#cbd5e1" />
                        <Text style={styles.emptyStateTitle}>No systems found</Text>
                        <Text style={styles.emptyStateText}>
                            Try adjusting your search or filter criteria
                        </Text>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ServiceContractScreen;
