import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useServiceReport from '../../hooks/Service-portal/service-report/useServiceReport';
import styles from './StatisticsScreen.styles';

interface ServiceReportScreenProps {
    navigation: any;
}

const ServiceReportScreen: React.FC<ServiceReportScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const {
        systems,
        getStatusColor,
        getStatusText,
        isLoading,
        error,
        handleSystemPress,
        handleBackButton
    } = useServiceReport(navigation);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a5490" />
                <Text style={styles.loadingText}>{t('statistics.serviceReport.loading')}</Text>
            </View>
        );
    }

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
                        <Ionicons name="stats-chart" size={24} color="#0f172a" />
                    </View>
                    <Text style={styles.title}>{t('statistics.serviceReport.title')}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {t('statistics.serviceReport.description')}
                </Text>

                {/* Systems Count */}
                <View style={styles.statsBar}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{systems.length}</Text>
                        <Text style={styles.statLabel}>{t('statistics.serviceReport.totalSystems')}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {systems.filter(s => s.status === 'Active').length}
                        </Text>
                        <Text style={styles.statLabel}>{t('statistics.serviceReport.active')}</Text>
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
                                    <Text style={styles.gridLabel}>{t('statistics.serviceReport.xrgiId')}</Text>
                                    <Text style={styles.gridValue}>{system.xrgiID}</Text>
                                </View>
                                <View style={styles.gridDivider} />
                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>{t('statistics.serviceReport.recentCalls')}</Text>
                                    <Text style={styles.gridValue}>-</Text>
                                </View>
                            </View>

                            {/* Card Footer */}
                            <View style={styles.cardFooter}>
                                <View style={styles.countryInfo}>
                                    {/* <Text style={styles.flagEmoji}>🇺🇸</Text> */}
                                    <Text style={styles.countryText}>{system.location?.country}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ServiceReportScreen;