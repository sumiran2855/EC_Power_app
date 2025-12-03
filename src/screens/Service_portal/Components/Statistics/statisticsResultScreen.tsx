import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useStatisticsResult, { MappedCallData } from "../../../../hooks/Service-portal/useStatisticsResult";
import styles from "./statisticsResultScreen.styles";

interface StatisticsResultScreenProps {
    navigation: any;
    route: any;
}

const StatisticsResultScreen: React.FC<StatisticsResultScreenProps> = ({ route }) => {
    const { fromDate, toDate, system } = route.params;

    const {
        callsData,
        isLoading,
        handleBackButton,
        getStatusColor
    } = useStatisticsResult(fromDate, toDate, system);

    const showInitialLoading = isLoading && callsData.length === 0;

    if (showInitialLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading system data...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Show loading indicator when refreshing data */}
                {isLoading && callsData.length > 0 && (
                    <View style={styles.refreshLoadingContainer}>
                        <ActivityIndicator size="small" color="#3b82f6" />
                        <Text style={styles.refreshLoadingText}>Refreshing data...</Text>
                    </View>
                )}
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <View style={styles.titleRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="stats-chart" size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.title}>Statistics Results</Text>
                    </View>
                    <Text style={styles.subtitle}>{system?.xrgiID} - {system?.modelNumber}</Text>
                    <Text style={styles.description}>
                        Results from {fromDate} to {toDate}
                    </Text>
                </View>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryTitle}>
                            {callsData.length > 0 ? `Total ${callsData.length} calls` : 'No calls found'}
                        </Text>
                    </View>
                </View>

                {/* No Data Message */}
                {callsData.length === 0 && (
                    <View style={styles.noDataContainer}>
                        <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
                        <Text style={styles.noDataText}>No calls found for the selected date range</Text>
                        <Text style={styles.noDataSubText}>Try selecting a different date range</Text>
                    </View>
                )}

                {/* Call Cards */}
                {callsData.map((call: MappedCallData, index: number) => (
                    <View key={call.id} style={styles.callCard}>
                        {/* Card Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <Ionicons name="time-outline" size={18} color="#1E40AF" />
                                <Text style={styles.timeText}>{call.timeOfCall}</Text>
                            </View>
                            <Text style={styles.callNumber}>#{index + 1}</Text>
                        </View>

                        {/* Card Content */}
                        <View style={styles.cardContent}>
                            {/* Cause */}
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Cause</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={[styles.statusText, { color: getStatusColor(call.cause.type) }]}>
                                        {call.cause.text}
                                    </Text>
                                </View>
                            </View>

                            {/* Current Status */}
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Current Status</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={[styles.statusText, { color: getStatusColor(call.currentStatus.type) }]}>
                                        {call.currentStatus.text}
                                    </Text>
                                </View>
                            </View>

                            {/* Latest Incident */}
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Latest Incident</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={[styles.statusText, { color: getStatusColor(call.latestIncident.type) }]}>
                                        {call.latestIncident.text}
                                    </Text>
                                </View>
                            </View>

                            {/* Status of Incident */}
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Incident Status</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={[styles.statusText, { color: getStatusColor(call.statusOfIncident.type) }]}>
                                        {call.statusOfIncident.text}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.newSearchButton]}
                        onPress={handleBackButton}
                    >
                        <Ionicons name="search-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.newSearchButtonText}>New Search</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default StatisticsResultScreen;