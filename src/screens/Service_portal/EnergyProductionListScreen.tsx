import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useStatistics from '../../hooks/Service-portal/useStatistics';
import styles from './StatisticsScreen.styles';

interface EnergyProductionListScreenProps {
    navigation: any;
}

const EnergyProductionListScreen: React.FC<EnergyProductionListScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const {
        systems,
        getStatusColor,
        getStatusText,
        activeSystemsCount,
        totalSystemsCount,
        isLoading
    } = useStatistics();
    console.log("Systems:", systems);

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleSystemPress = (system: any) => {
        navigation.navigate('EnergyProduction', { xrgiId: system.xrgiID });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <View style={styles.titleIconContainer}>
                        <Ionicons name="flash" size={24} color="#0f172a" />
                    </View>
                    <Text style={styles.title}>{t('energyProduction.title')}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {t('energyProduction.description')}
                </Text>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1a5490" />
                        <Text style={styles.loadingText}>{t('energyProduction.loadingFacilities')}</Text>
                    </View>
                ) : (
                    <>

                        {/* Systems Count */}
                        <View style={styles.statsBar}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{totalSystemsCount}</Text>
                                <Text style={styles.statLabel}>{t('energyProduction.totalSystems')}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {activeSystemsCount}
                                </Text>
                                <Text style={styles.statLabel}>{t('energyProduction.active')}</Text>
                            </View>
                        </View>

                        {/* Systems List */}
                        <View style={styles.systemsList}>
                            {systems.map((system) => (
                                <TouchableOpacity
                                    key={system.id}
                                    style={styles.systemCard}
                                    onPress={() => handleSystemPress(system)}
                                    activeOpacity={0.7}
                                >
                                    {/* Card Header */}
                                    <View style={styles.cardHeader}>
                                        <View style={styles.systemIconContainer}>
                                            <Ionicons name="hardware-chip" size={20} color="#3b82f6" />
                                        </View>
                                        <View style={styles.statusBadge}>
                                            <View style={[
                                                styles.statusDot,
                                                { backgroundColor: getStatusColor(system.status) }
                                            ]} />
                                            <Text style={styles.statusText}>
                                                {getStatusText(system.status)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* System Name */}
                                    <Text style={styles.systemNameText}>{system.name}</Text>

                                    {/* System Details Grid */}
                                    <View style={styles.detailsGrid}>
                                        <View style={styles.gridItem}>
                                            <Text style={styles.gridLabel}>{t('energyProduction.xrgiId')}</Text>
                                            <Text style={styles.gridValue}>{system.xrgiID}</Text>
                                        </View>
                                        <View style={styles.gridDivider} />
                                        <View style={styles.gridItem}>
                                            <Text style={styles.gridLabel}>{t('energyProduction.status')}</Text>
                                            <Text style={styles.gridValue}>{getStatusText(system.status)}</Text>
                                        </View>
                                    </View>

                                    {/* Card Footer */}
                                    <View style={styles.cardFooter}>
                                        <View style={styles.countryInfo}>
                                            <Text style={styles.countryText}>{system.location?.country}</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default EnergyProductionListScreen;
