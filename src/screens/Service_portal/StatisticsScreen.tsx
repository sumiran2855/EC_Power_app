import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from './StatisticsScreen.styles';
import React from "react";
import useStatistics from '../../hooks/Service-portal/useStatistics';

interface StatisticsScreenProps {
    navigation: any;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ navigation }) => {
    const {
        systems,
        getStatusColor,
        getStatusText,
        activeSystemsCount,
        totalSystemsCount
    } = useStatistics();

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleSystemPress = (system: any) => {
        navigation.navigate('Get_Statistics');
        console.log('Navigate to system:', system.id);
    };

    return (
        <View style={styles.container}>
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
                    <Text style={styles.title}>Statistics</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Select a system to view detailed statistics and performance metrics.
                </Text>

                {/* Systems Count */}
                <View style={styles.statsBar}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalSystemsCount}</Text>
                        <Text style={styles.statLabel}>Total Systems</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {activeSystemsCount}
                        </Text>
                        <Text style={styles.statLabel}>Active</Text>
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
                            <Text style={styles.systemNameText}>{system.systemName}</Text>

                            {/* System Details Grid */}
                            <View style={styles.detailsGrid}>
                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>XRGI® ID</Text>
                                    <Text style={styles.gridValue}>{system.xrgiId}</Text>
                                </View>
                                <View style={styles.gridDivider} />
                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>Recent Calls</Text>
                                    <Text style={styles.gridValue}>{system.recentCalls}</Text>
                                </View>
                            </View>

                            {/* Card Footer */}
                            <View style={styles.cardFooter}>
                                <View style={styles.countryInfo}>
                                    <Text style={styles.flagEmoji}>🇺🇸</Text>
                                    <Text style={styles.countryText}>United States</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export default StatisticsScreen;