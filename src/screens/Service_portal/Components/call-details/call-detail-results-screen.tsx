import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useCallDetailsResult from "../../../../hooks/Service-portal/call-details/useCallDetailsResult";
import styles from "./call-details-results-screen.styles";

interface CallDetailResultScreenProps {
    navigation: any;
    route: any;
}

interface DataRowProps {
    label: string;
    value: string | boolean;
    valueColor?: string;
}

const CallDetailResultScreen: React.FC<CallDetailResultScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { system, fromDate, toDate, fromDateObject, toDateObject } = route.params;
    const {
        callData,
        callDetailsData,
        isLoading,
        expandedIncidents,
        handleBackButton,
        toggleIncident,
        navigateToHeatDistribution: HandleHeatDistribution
    } = useCallDetailsResult(navigation, route);

    const DataRow: React.FC<DataRowProps> = ({ label, value, valueColor }) => {
        const displayValue = typeof value === 'boolean' ? (value ? 'true' : 'false') : value;
        const booleanColor = typeof value === 'boolean' ? (value ? '#10B981' : '#EF4444') : undefined;
        const finalColor = valueColor || booleanColor;
        
        return (
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>{label}</Text>
                <Text style={[styles.dataValue, finalColor ? { color: finalColor } : {}]}>{displayValue}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('callDetails.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title Card */}
                <View style={styles.titleCard}>
                    <View style={styles.titleHeader}>
                        <Ionicons name="list" size={20} color="#3B82F6" />
                        <Text style={styles.titleText}>{t('callDetails.title')}</Text>
                    </View>
                    <Text style={styles.serialNumber}>{system.xrgiID} - {system.modelNumber}</Text>

                    <TouchableOpacity style={styles.distributorCard} onPress={HandleHeatDistribution}>
                        <View style={styles.distributorIcon}>
                            <Ionicons name="thermometer-outline" size={24} color="#f6b53bff" />
                        </View>
                        <Text style={styles.distributorText}>{t('callDetails.heatDistributor')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Time of Call Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('callDetails.timeOfCall')}</Text>
                    <Text style={styles.sectionValue}>{callData.timeOfCall}</Text>
                </View>

                {/* Attempted Redials */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('callDetails.attemptedRedials')}</Text>
                    <Text style={styles.sectionValue}>{callData.attemptedRedials}</Text>
                </View>

                {/* Software Validated */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('callDetails.softwareValidated')}</Text>
                    <Text style={styles.sectionValue}>{callData.softwareValidated}</Text>
                </View>

                {/* Operation Status */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusSectionTitle}>{t('callDetails.operationStatus')}</Text>

                    <DataRow label={t('callDetails.actualStatus')} value={callData.actualStatus} valueColor={callData.statusColor} />
                    <DataRow label={t('callDetails.stopped')} value={callData.stopped} />
                    <DataRow label={t('callDetails.operationalHoursToNextService')} value={callData.operationalHoursToNextService} />
                    <DataRow label={t('callDetails.operatingHours')} value={callData.operatingHours} />
                    <DataRow label={t('callDetails.actualElecProduced')} value={callData.actualElecProduced} />
                    <DataRow label={t('callDetails.forcedStandby')} value={callData.forcedStandby} />
                    <DataRow label={t('callDetails.loadLevel')} value={callData.loadLevel} />
                    <DataRow label={t('callDetails.storageLevel')} value={callData.storageLevel} />
                    <DataRow label={t('callDetails.oilPressure')} value={callData.oilPressure} />
                    <DataRow label={t('callDetails.smartstarterBoardTemp')} value={callData.smartstarterBoardTemp} />
                    <DataRow label={t('callDetails.boilerReleased')} value={callData.boilerReleased} />
                </View>

                {/* System Status */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusSectionTitle}>{t('callDetails.systemStatus')}</Text>

                    <DataRow label={t('callDetails.controlPanelAntennaSignal')} value={callData.controlPanelAntennaSignal} />
                    <DataRow label={t('callDetails.controlPanelPCBTemp')} value={callData.controlPanelPCBTemp} />
                    <DataRow label={t('callDetails.controlPanelPSUVoltage')} value={callData.controlPanelPSUVoltage} />
                    <DataRow label={t('callDetails.powerUnitUPSAccumulator')} value={callData.powerUnitUPSAccumulator} />
                    <DataRow label={t('callDetails.powerUnitPCBTemp')} value={callData.powerUnitPCBTemp} />
                    <DataRow label={t('callDetails.heatDistributorPCBTemp')} value={callData.heatDistributorPCBTemp} />
                    <DataRow label={t('callDetails.flowmasterPSUVoltage')} value={callData.flowmasterPSUVoltage} />
                    <DataRow label={t('callDetails.flowmasterPCBTemp')} value={callData.flowmasterPCBTemp} />
                    <DataRow label={t('callDetails.surgeProtector')} value={callData.surgeProtector} />
                    <DataRow label={t('callDetails.smartstarterLastError')} value={callData.smartstarterLastError} />
                </View>

                {/* Incidents Section */}
                <View style={styles.incidentsSection}>
                    <Text style={styles.sectionTitle}>{t('callDetails.incidents')} ({callDetailsData?.length || 0})</Text>
                    
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>{t('callDetails.loadingIncidents')}</Text>
                        </View>
                    ) : !callDetailsData || callDetailsData.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Ionicons name="alert-circle-outline" size={48} color="#64748B" />
                            <Text style={styles.noDataTitle}>{t('callDetails.noIncidentsFound')}</Text>
                            <Text style={styles.noDataSubTitle}>
                                {t('callDetails.adjustDateRange')}
                            </Text>
                            <Text style={styles.noDataSubTitle}>
                                {t('callDetails.currentRange', { fromDate, toDate })}
                            </Text>
                        </View>
                    ) : (
                        callDetailsData.map((incident, index) => (
                            <View key={incident.id} style={styles.incidentCard}>
                                <TouchableOpacity
                                    style={styles.incidentHeader}
                                    onPress={() => toggleIncident(incident.id)}
                                >
                                    <View style={styles.incidentHeaderLeft}>
                                        <Text style={styles.incidentTitle}>{t('callDetails.incident')}</Text>
                                        <Text style={styles.incidentDate}>{incident.timeOfCall}</Text>
                                    </View>
                                    <View style={styles.incidentHeaderRight}>
                                        <View style={[styles.statusBadge, { backgroundColor: incident.incident.color }]}>
                                            <Text style={styles.statusText}>{incident.incident.type.toUpperCase()}</Text>
                                        </View>
                                        <Ionicons
                                            name={expandedIncidents[incident.id] ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#64748B"
                                        />
                                    </View>
                                </TouchableOpacity>

                                {expandedIncidents[incident.id] && (
                                    <View style={styles.incidentContent}>
                                        <DataRow label={t('callDetails.dateTime')} value={incident.timeOfCall} />
                                        <DataRow 
                                            label={t('callDetails.incident')} 
                                            value={incident.incident.text} 
                                            valueColor={incident.incident.color}
                                        />
                                        <DataRow 
                                            label={t('callDetails.statusOfIncident')} 
                                            value={incident.operation.text} 
                                            valueColor={incident.operation.color}
                                        />
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    style={styles.newSearchButton}
                    onPress={handleBackButton}
                >
                    <Ionicons name="search-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.newSearchButtonText}>{t('callDetails.newSearch')}</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CallDetailResultScreen;