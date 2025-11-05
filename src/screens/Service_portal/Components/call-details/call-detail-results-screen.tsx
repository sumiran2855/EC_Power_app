import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./call-details-results-screen.styles";
import useCallDetailsResult, { CallData } from "../../../../hooks/Service-portal/call-details/useCallDetailsResult";

interface CallDetailResultScreenProps {
    navigation: any;
    route: any;
}

interface DataRowProps {
    label: string;
    value: string;
    valueColor?: string;
}

const CallDetailResultScreen: React.FC<CallDetailResultScreenProps> = ({ navigation, route }) => {
    const {
        callData,
        expandedIncidents,
        handleBackButton,
        toggleIncident,
        navigateToHeatDistribution: HandleHeatDistribution
    } = useCallDetailsResult(navigation);

    const DataRow: React.FC<DataRowProps> = ({ label, value, valueColor }) => (
        <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{label}</Text>
            <Text style={[styles.dataValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
                    <Text style={styles.serialNumber}>{callData.serialNumber} - {callData.systemName}</Text>

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
                    {callData.incidents.map((incident, index) => (
                        <View key={index} style={styles.incidentCard}>
                            <TouchableOpacity
                                style={styles.incidentHeader}
                                onPress={() => toggleIncident(index)}
                            >
                                <Text style={styles.incidentTitle}>Date of incident</Text>
                                <View style={styles.incidentHeaderRight}>
                                    <Text style={styles.incidentDate}>{incident.dateOfIncident}</Text>
                                    <Ionicons
                                        name={expandedIncidents[index] ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#64748B"
                                    />
                                </View>
                            </TouchableOpacity>

                            {expandedIncidents[index] && (
                                <View style={styles.incidentContent}>
                                    <DataRow label="Date of incident" value={incident.dateOfIncident} />
                                    <DataRow label="Incident type" value={incident.incidentType} />
                                    <DataRow label="Incidents" value={incident.incidents} />
                                    <DataRow label="Status of incident" value={incident.statusOfIncident} />
                                </View>
                            )}
                        </View>
                    ))}
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
        </View>
    );
};

export default CallDetailResultScreen;