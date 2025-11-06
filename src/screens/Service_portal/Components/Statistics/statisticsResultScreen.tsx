import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import styles from "./statisticsResultScreen.styles";
import useStatisticsResult from "../../../../hooks/Service-portal/useStatisticsResult";

interface StatisticsResultScreenProps {
    navigation: any;
    route: any;
}

const StatisticsResultScreen: React.FC<StatisticsResultScreenProps> = () => {
    const {
        callsData,
        fromDate,
        toDate,
        handleBackButton,
        getStatusColor,
        getStatusBackground
    } = useStatisticsResult();

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
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <View style={styles.titleRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="stats-chart" size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.title}>Statistics Results</Text>
                    </View>
                    <Text style={styles.subtitle}>1470167385 - XRGI® 25</Text>
                    <Text style={styles.description}>
                        Click on the system for which you want to generate an operational analysis
                    </Text>
                </View>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryTitle}>Total {callsData.length} calls</Text>
                    </View>
                </View>

                {/* Call Cards */}
                {callsData.map((call, index) => (
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
                                <Text style={styles.cardValue}>{call.cause}</Text>
                            </View>

                            {/* Current Status */}
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Current Status</Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusBackground(call.currentStatus) }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            { color: getStatusColor(call.currentStatus) }
                                        ]}
                                    >
                                        {call.currentStatus}
                                    </Text>
                                </View>
                            </View>

                            {/* Latest Incident */}
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Latest Incident</Text>
                                <Text style={styles.cardValue}>{call.latestIncident}</Text>
                            </View>

                            {/* Status of Incident */}
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Incident Status</Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusBackground(call.statusOfIncident) }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            { color: getStatusColor(call.statusOfIncident) }
                                        ]}
                                    >
                                        {call.statusOfIncident}
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