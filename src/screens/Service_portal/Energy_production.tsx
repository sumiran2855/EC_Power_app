import useEnergyProduction from '@/hooks/Service-portal/useEnergyProduction';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Energy_production.styles';


const { width: SCREEN_WIDTH } = Dimensions.get('window');


interface EnergyProductionScreenProps {
    navigation: any;
    route: any;
}


const EnergyProductionScreen: React.FC<EnergyProductionScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { xrgiId } = route.params;
    const {
        selectedFilter,
        modalVisible,
        filterOptions,
        systemInfo,
        chartData,
        handleFilterSelect,
        setModalVisible,
        getFilterLabel,
        isLoading
    } = useEnergyProduction(xrgiId);


    const handleBackButton = () => {
        navigation.goBack();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>{t('energyProduction.loadingSystemData')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('energyProduction.title')}</Text>
                <View style={{ width: 22 }} />
            </View>


            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Dropdown Filter Button */}
                <View style={styles.filterDropdownContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.filterButtonText}>{getFilterLabel()}</Text>
                        <Ionicons name="chevron-down" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>


                {/* System Information Grid */}
                <View style={styles.infoGridCard}>
                    <View style={styles.infoGrid}>
                        {systemInfo.map((info, index) => (
                            <View key={index} style={styles.infoGridItem}>
                                <Text style={styles.infoGridLabel}>{info.label}</Text>
                                <Text style={styles.infoGridValue}>{info.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>


                {/* Chart Card */}
                <View style={styles.chartCard} >
                    <Text style={styles.chartTitle}>{t('energyProduction.energyOverview')}</Text>
                    <BarChart
                        data={{
                            labels: ['Elec.\nProd.', 'Elec.\nCons.', 'Heat \nProd.', 'Elec.\nSold'],
                            datasets: [{
                                data: [
                                    chartData.datasets[0].data[0] || 0,
                                    chartData.datasets[1].data[0] || 0,
                                    chartData.datasets[2].data[0] || 0,
                                    chartData.datasets[3].data[0] || 0,
                                ],
                                colors: [
                                    (opacity = 1) => '#ecbc41ff',
                                    (opacity = 1) => '#3cd4a2ff',
                                    (opacity = 1) => '#d135d180',
                                    (opacity = 1) => '#3b82f6',
                                ]
                            }]
                        }}
                        yLabelsOffset={-1}
                        width={SCREEN_WIDTH - 70}
                        height={280}
                        yAxisLabel=""
                        yAxisSuffix=" kWh"
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#f8fafc',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
                            barPercentage: 0.8,
                            propsForBackgroundLines: {
                                strokeWidth: 1,
                                stroke: '#e2e8f0',
                                strokeDasharray: '0',
                            },
                            propsForLabels: {
                                fontSize: 11,
                                fontWeight: '500',
                            },
                            paddingRight: 25,
                        }}
                        style={styles.chart}
                        withInnerLines={true}
                        showBarTops={true}
                        showValuesOnTopOfBars={true}
                        fromZero={true}
                        segments={4}
                        withCustomBarColorFromData={true}
                        flatColor={true}
                    />

                    {/* Stats Summary */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIndicator, { backgroundColor: '#ecbc41ff' }]} />
                            <View style={styles.statContent}>
                                <Text style={styles.statLabel}>{t('energyProduction.production')}</Text>
                                <Text style={styles.statValue}>
                                    {chartData.datasets[0].data[0]} kWh
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIndicator, { backgroundColor: '#3cd4a2ff' }]} />
                            <View style={styles.statContent}>
                                <Text style={styles.statLabel}>{t('energyProduction.consumption')}</Text>
                                <Text style={styles.statValue}>
                                    {chartData.datasets[1].data[0]} kWh
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIndicator, { backgroundColor: '#d135d180' }]} />
                            <View style={styles.statContent}>
                                <Text style={styles.statLabel}>{t('energyProduction.heatProduction')}</Text>
                                <Text style={styles.statValue}>
                                    {chartData.datasets[2].data[0]} kWh
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIndicator, { backgroundColor: '#3b82f6' }]} />
                            <View style={styles.statContent}>
                                <Text style={styles.statLabel}>{t('energyProduction.sold')}</Text>
                                <Text style={styles.statValue}>
                                    {chartData.datasets[3].data[0]} kWh
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>


            </ScrollView>


            {/* Filter Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalCard}>
                            {filterOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.modalOption,
                                        index === 0 && styles.modalOptionFirst,
                                        index === filterOptions.length - 1 && styles.modalOptionLast,
                                        selectedFilter === option.id && styles.modalOptionSelected
                                    ]}
                                    onPress={() => handleFilterSelect(option.id)}
                                >
                                    <Text style={[
                                        styles.modalOptionText,
                                        selectedFilter === option.id && styles.modalOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {selectedFilter === option.id && (
                                        <Ionicons name="checkmark" size={20} color="#3b82f6" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}


export default EnergyProductionScreen;
