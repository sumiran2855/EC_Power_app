import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "./call-details-results-screen.styles";
import useCallDetailsResult from "../../../../hooks/Service-portal/call-details/useCallDetailsResult";

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
                <Text style={styles.headerTitle}>Call Details</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title Card */}
                <View style={styles.titleCard}>
                    <View style={styles.titleHeader}>
                        <Ionicons name="list" size={20} color="#3B82F6" />
                        <Text style={styles.titleText}>Call details</Text>
                    </View>
                    <Text style={styles.serialNumber}>{system.xrgiID} - {system.modelNumber}</Text>

                    <TouchableOpacity style={styles.distributorCard} onPress={HandleHeatDistribution}>
                        <View style={styles.distributorIcon}>
                            <Ionicons name="thermometer-outline" size={24} color="#f6b53bff" />
                        </View>
                        <Text style={styles.distributorText}>Heat Distributor</Text>
                    </TouchableOpacity>
                </View>

                {/* Time of Call Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Time of call:</Text>
                    <Text style={styles.sectionValue}>{callData.timeOfCall}</Text>
                </View>

                {/* Attempted Redials */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Attempted redials:</Text>
                    <Text style={styles.sectionValue}>{callData.attemptedRedials}</Text>
                </View>

                {/* Software Validated */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Software validated:</Text>
                    <Text style={styles.sectionValue}>{callData.softwareValidated}</Text>
                </View>

                {/* Operation Status */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusSectionTitle}>Operation status</Text>

                    <DataRow label="Actual status:" value={callData.actualStatus} valueColor={callData.statusColor} />
                    <DataRow label="Stopped" value={callData.stopped} />
                    <DataRow label="Operational hours to next service:" value={callData.operationalHoursToNextService} />
                    <DataRow label="Operating hours:" value={callData.operatingHours} />
                    <DataRow label="Actual elec. produced:" value={callData.actualElecProduced} />
                    <DataRow label="Forced standby:" value={callData.forcedStandby} />
                    <DataRow label="Load level:" value={callData.loadLevel} />
                    <DataRow label="Storage level:" value={callData.storageLevel} />
                    <DataRow label="Oil pressure:" value={callData.oilPressure} />
                    <DataRow label="Smartstarter board temp.:" value={callData.smartstarterBoardTemp} />
                    <DataRow label="Boiler released:" value={callData.boilerReleased} />
                </View>

                {/* System Status */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusSectionTitle}>System status</Text>

                    <DataRow label="Control panel antenna signal:" value={callData.controlPanelAntennaSignal} />
                    <DataRow label="Control panel PCB temp.:" value={callData.controlPanelPCBTemp} />
                    <DataRow label="Control panel PSU Voltage:" value={callData.controlPanelPSUVoltage} />
                    <DataRow label="Power Unit UPS accumulator:" value={callData.powerUnitUPSAccumulator} />
                    <DataRow label="Power Unit, PCB temperature:" value={callData.powerUnitPCBTemp} />
                    <DataRow label="Heat Distributor, PCB temperature:" value={callData.heatDistributorPCBTemp} />
                    <DataRow label="Flowmaster PSU Voltage:" value={callData.flowmasterPSUVoltage} />
                    <DataRow label="Flowmaster, PCB temperature:" value={callData.flowmasterPCBTemp} />
                    <DataRow label="Surge protector:" value={callData.surgeProtector} />
                    <DataRow label="Smartstarter last error.:" value={callData.smartstarterLastError} />
                </View>

                {/* Incidents Section */}
                <View style={styles.incidentsSection}>
                    <Text style={styles.sectionTitle}>Incidents ({callDetailsData?.length || 0})</Text>
                    
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading incidents...</Text>
                        </View>
                    ) : !callDetailsData || callDetailsData.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Ionicons name="alert-circle-outline" size={48} color="#64748B" />
                            <Text style={styles.noDataTitle}>No incidents found</Text>
                            <Text style={styles.noDataSubTitle}>
                                Try adjusting the date range to include more historical data
                            </Text>
                            <Text style={styles.noDataSubTitle}>
                                Current range: {fromDate} to {toDate}
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
                                        <Text style={styles.incidentTitle}>Incident</Text>
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
                                        <DataRow label="Date & Time" value={incident.timeOfCall} />
                                        <DataRow 
                                            label="Incident" 
                                            value={incident.incident.text} 
                                            valueColor={incident.incident.color}
                                        />
                                        <DataRow 
                                            label="Status of Incident" 
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
                    <Text style={styles.newSearchButtonText}>New Search</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CallDetailResultScreen;