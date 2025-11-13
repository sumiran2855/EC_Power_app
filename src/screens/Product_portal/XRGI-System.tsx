import { MaterialIcons as Icon, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card/Card';
import useDashboard from '../../hooks/Product-portal/useDashboard';
import Sidebar from '../common/Sidebar';
import styles from './XRGI-System.styles';
import { Facility } from "../authScreens/types";

type RootStackParamList = {
  XRGI_System: undefined;
  XRGI_Details: { item: any };
};

type XRGISystemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'XRGI_System'>;

interface XRGI_SystemProps { }

const XRGI_System: React.FC<XRGI_SystemProps> = () => {
  const navigation = useNavigation<XRGISystemScreenNavigationProp>();
  const {
    // State
    selectedFilter,
    dropdownVisible,
    searchQuery,
    sidebarVisible,
    loading,

    // Data
    filterOptions,
    filteredCards,

    // Functions
    setDropdownVisible,
    setSidebarVisible,
    handleFilterSelect,
    handleSearchChange,
    handleSidebarMenuPress,
    handleRegisterXRGI,
  } = useDashboard();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCardPress = (item: Facility) => {
    navigation.navigate('XRGI_Details', { item });
  };

  const handleDelete = (id: string) => {
    console.log('Delete item with id:', id);
  };

  const renderCard = (item: Facility) => (
    <Card
      key={item.id}
      item={item}
      onPress={handleCardPress}
      onDelete={handleDelete}
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
        <Text style={styles.mainTitle}>Your XRGI® Systems</Text>
        <Text style={styles.subtitle}>This is an overview of your XRGI® Systems.</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or XRGI ID"
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
            <Text style={styles.sortText}>Sort by :</Text>
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
          <Text style={styles.registerText}>Register XRGI®</Text>
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
          <Text style={styles.loadingText}>Loading facilities...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Active Section */}
          {filteredCards.active.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Active</Text>
              {filteredCards.active.map(renderCard)}
            </View>
          )}

          {/* Inactive Section */}
          {filteredCards.inactive.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitleInactive}>Inactive</Text>
              {filteredCards.inactive.map(renderCard)}
            </View>
          )}

          {/* Data Missing Section */}
          {filteredCards.dataMissing.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitleDataMissing}>Data Missing</Text>
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
                    ? `No XRGI® systems found matching "${searchQuery}"`
                    : 'No XRGI® systems found'}
                </Text>
              </View>
            )}
        </ScrollView>
      )}

      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onMenuItemPress={handleSidebarMenuPress}
      />
    </SafeAreaView>
  );
};

export default XRGI_System;