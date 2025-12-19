import { MaterialIcons as Icon, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card/Card';
import useDashboard from '../../hooks/Product-portal/useDashboard';
import styles from './XRGI-System.styles';
import { Facility } from "../authScreens/types";
import { RegisterController } from "@/controllers/RegisterController";
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
  XRGI_System: undefined;
  XRGI_Details: { item: any };
};

type XRGISystemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'XRGI_System'>;

interface XRGI_SystemProps { }

const XRGI_System: React.FC<XRGI_SystemProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<XRGISystemScreenNavigationProp>();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Facility | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const {
    // State
    selectedFilter,
    dropdownVisible,
    searchQuery,
    loading,

    // Data
    filterOptions,
    filteredCards,

    // Functions
    setDropdownVisible,
    handleFilterSelect,
    handleSearchChange,
    handleRegisterXRGI,
    HandleGetFacilityList,
  } = useDashboard();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCardPress = (item: Facility) => {
    navigation.navigate('XRGI_Details', { item });
  };

  const handleDelete = (item: Facility) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    setDeleteLoading(true);
    try {
      const response = await RegisterController.deleteXRGIUnit(selectedItem.id);
      if (response?.success) {
        await HandleGetFacilityList();
      }
    } catch (error) {
      console.log("Error deleting xrgi unit", error);
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

  const renderCard = (item: Facility) => (
    <Card
      key={item.id}
      item={item}
      onPress={handleCardPress}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#1a5490" />
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>{t('xrgiSystem.title')}</Text>
        <Text style={styles.subtitle}>{t('xrgiSystem.subtitle')}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('xrgiSystem.search.placeholder')}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>

      {/* Controls Section */}
      <View style={styles.controlsSection}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <MaterialIcons name="filter-list" size={20} color="#1a365d" />
            <Text style={styles.sortText}>{t('xrgiSystem.filter.sortBy')}</Text>
            <Ionicons name="chevron-down" size={16} color="#1a365d" />
          </TouchableOpacity>

          {dropdownVisible && (
            <ScrollView style={styles.dropdownMenu} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
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
                    <Icon name="check" size={16} color="#1a5490" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterXRGI}>
          <Text style={styles.registerText}>{t('xrgiSystem.registerButton')}</Text>
        </TouchableOpacity>
      </View>

      {/* Overlay to close dropdown */}
      {dropdownVisible && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={() => setDropdownVisible(false)}
        />
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a5490" />
          <Text style={styles.loadingText}>{t('xrgiSystem.loading')}</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Active Section */}
          {filteredCards.active.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t('xrgiSystem.sections.active')}</Text>
              {filteredCards.active.map(renderCard)}
            </View>
          )}

          {/* Inactive Section */}
          {filteredCards.inactive.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitleInactive}>{t('xrgiSystem.sections.inactive')}</Text>
              {filteredCards.inactive.map(renderCard)}
            </View>
          )}

          {/* Data Missing Section */}
          {filteredCards.dataMissing.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitleDataMissing}>{t('xrgiSystem.sections.dataMissing')}</Text>
              {filteredCards.dataMissing.map(renderCard)}
            </View>
          )}

          {/* No Results Message */}
          {filteredCards.active.length === 0 &&
            filteredCards.inactive.length === 0 &&
            filteredCards.dataMissing.length === 0 &&
            !loading && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  {searchQuery.trim() !== ''
                    ? t('xrgiSystem.noResults.withQuery', { query: searchQuery })
                    : t('xrgiSystem.noResults.withoutQuery')}
                </Text>
              </View>
            )}
        </ScrollView>
      )}

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

export default XRGI_System;