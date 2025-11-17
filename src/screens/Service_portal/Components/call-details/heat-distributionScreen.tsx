import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './heat-distributionScreen.styles';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../navigation/AppNavigator';

type HeatDistributionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HeatDistribution'>;

interface HeatDistributionScreenProps {
    navigation: HeatDistributionScreenNavigationProp;
    route: any;
}

interface TimeButton {
    label: string;
    value: string;
}

const HeatDistributionScreen: React.FC<HeatDistributionScreenProps> = ({ navigation, route }) => {
    const system = route.params.system;
    const [selectedTime, setSelectedTime] = useState<string>('T-10s');

    const timeButtons: TimeButton[] = [
        { label: 'T-0s', value: '14.06.29' },
        { label: 'T-10s', value: '14.06.29' },
        { label: 'T-20s', value: '14.06.19' },
        { label: 'T-30s', value: '14.06.09' },
        { label: 'T-40s', value: '14.05.19' },
        { label: 'T-50s', value: '14.05.09' },
    ];

    const handleBackButton = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('CallDetailsResult');
        }
    };

    const renderStatusCard = (
        title: string,
        value: string,
        icon: string,
        color: string,
        isActive?: boolean
    ) => (
        <View style={[styles.statusCard, { borderLeftColor: color }]}>
            <View style={styles.statusCardHeader}>
                <Text style={styles.statusCardTitle}>{title}</Text>
                <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <Text style={[styles.statusCardValue, isActive && styles.activeValue]}>
                {value}
            </Text>
        </View>
    );

    const renderSensorRow = (label: string, value: string = '-') => (
        <View style={styles.sensorRow}>
            <Text style={styles.sensorLabel}>{label}</Text>
            <Text style={styles.sensorValue}>{value}</Text>
        </View>
    );

    const renderSensorSection = (
        title: string,
        icon: string,
        color: string,
        children: React.ReactNode
    ) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name={icon as any} size={20} color={color} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const renderGreenStatusCard = (label: string, value: string, status: string) => (
        <View style={styles.greenStatusCard}>
            <View style={styles.greenStatusHeader}>
                <Text style={styles.greenStatusLabel}>{label}</Text>
                <Text style={styles.greenStatusBadge}>{status}</Text>
            </View>
            <Text style={styles.greenStatusValue}>{value}</Text>
        </View>
    );

    const renderControlParameter = (label: string, value: string, subtitle?: string) => (
        <View style={styles.parameterRow}>
            <View style={styles.parameterInfo}>
                <Text style={styles.parameterLabel}>{label}</Text>
                {subtitle && <Text style={styles.parameterSubtitle}>{subtitle}</Text>}
            </View>
            <Text style={styles.parameterValue}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Heat Distribution</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* System Info */}
                <View style={styles.systemInfoCard}>
                    <Text style={styles.systemTitle}>Heat Distribution Control System</Text>
                    <Text style={styles.systemId}>Heat Distribution Control System: {system.system.xrgiID}</Text>
                    <Text style={styles.systemSubtitle}>Heat Control Data Monitor</Text>

                    {/* Time Buttons - Horizontal Scrollable */}
                    <View style={styles.timeButtonsContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.timeButtonsScrollView}
                            keyboardShouldPersistTaps="always"
                        >
                            {timeButtons.map((btn) => (
                                <TouchableOpacity
                                    key={btn.label}
                                    style={[
                                        styles.timeButton,
                                        selectedTime === btn.label && styles.timeButtonActive
                                    ]}
                                    onPress={() => setSelectedTime(btn.label)}
                                >
                                    <Ionicons
                                        name="time-outline"
                                        size={16}
                                        color={selectedTime === btn.label ? '#3B82F6' : '#64748B'}
                                    />
                                    <Text style={[
                                        styles.timeButtonText,
                                        selectedTime === btn.label && styles.timeButtonTextActive
                                    ]}>
                                        {btn.label}
                                    </Text>
                                    <Text style={styles.timeButtonValue}>{btn.value}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <Text style={styles.recordsInfo}>
                        Showing latest 6 records | Current 29.6.2025, 15.06.29
                    </Text>
                </View>

                {/* Status Cards Grid */}
                <View style={styles.statusGrid}>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Manual Status', 'Auto', 'settings-outline', '#3B82F6')}
                    </View>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Engine Valve', '-', 'water-outline', '#10B981')}
                    </View>
                </View>

                <View style={styles.statusGrid}>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Flow Valve', 'Off', 'pulse-outline', '#8B5CF6')}
                    </View>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Storage %', '-', 'layers-outline', '#F59E0B')}
                    </View>
                </View>

                <View style={styles.statusCardFull}>
                    {renderStatusCard('Heat Output', '-', 'flash-outline', '#EF4444')}
                </View>

                {/* Engine System */}
                {renderSensorSection('Engine System', 'cog-outline', '#3B82F6', (
                    <>
                        {renderSensorRow('Engine Flow', '-')}
                        {renderSensorRow('Pump Force', '-')}
                        {renderSensorRow('TMK Setpoint', '1.08')}
                        {renderSensorRow('TMV Max', '-')}
                        {renderSensorRow('Engine Pump Feedback', '-')}
                    </>
                ))}

                {/* Temperature Sensors */}
                {renderSensorSection('Heat Control Temperature Sensors', 'thermometer-outline', '#EF4444', (
                    <>
                        {renderSensorRow('TLK Sensor', '-')}
                        {renderSensorRow('TLV Sensor', '-')}
                        {renderSensorRow('TMK Sensor', '-')}
                        {renderSensorRow('TMV Max', '-')}
                        {renderSensorRow('Return Temperature', '-')}
                    </>
                ))}

                {/* Flow Control Sensors */}
                {renderSensorSection('Flow Control Sensors', 'water-outline', '#10B981', (
                    <>
                        {renderGreenStatusCard('Power Unit Setpoint', '0°C', 'Ok')}
                        {renderGreenStatusCard('Operational', '0°C', 'Ok')}
                        {renderGreenStatusCard('Return', '0°C', 'Ok')}
                        {renderGreenStatusCard('Supply', '0°C', 'Ok')}
                        {renderGreenStatusCard('Master Bypass', '0°C', 'Ok')}
                        {renderGreenStatusCard('Master Source', '0°C', 'Ok')}
                    </>
                ))}

                {/* Auxiliary Temperature Trackers */}
                {renderSensorSection('Auxiliary Temperature Trackers', 'thermometer-outline', '#EF4444', (
                    <>
                        {renderSensorRow('Aux Sensor 1', '-')}
                        {renderSensorRow('Aux Sensor 2', '-')}
                        {renderSensorRow('Aux Sensor 3', '-')}
                        {renderSensorRow('Aux Sensor 4', '-')}
                    </>
                ))}

                {/* Storage System */}
                {renderSensorSection('Storage System', 'layers-outline', '#F59E0B', (
                    <>
                        {renderSensorRow('Storage Flow', '0.28 L/min')}
                        {renderSensorRow('Pump Force', '-')}
                        {renderSensorRow('Sensor Status', '-')}
                        {renderSensorRow('Sequence Status', '-')}
                        {renderSensorRow('Storage Top Sensor', '-')}
                        {renderSensorRow('Storage Bottom Sensor', '-')}
                        {renderSensorRow('Storage Pump Feedback', '-')}
                    </>
                ))}

                {/* Flow Master System */}
                {renderSensorSection('Flow Master System', 'git-network-outline', '#10B981', (
                    <>
                        {renderSensorRow('Valve Position', '-')}
                        <View style={styles.sensorRow}>
                            <Text style={styles.sensorLabel}>Flow Pump</Text>
                            <Text style={[styles.sensorValue, styles.percentageValue]}>60%</Text>
                        </View>
                        <View style={styles.sensorRow}>
                            <Text style={styles.sensorLabel}>Virtual Source Active</Text>
                            <Text style={styles.sensorValue}>Inactive</Text>
                        </View>
                        {renderSensorRow('Flow Master Pump Feedback', '-')}
                    </>
                ))}

                {/* Control Parameters */}
                {renderSensorSection('Control Parameters', 'options-outline', '#8B5CF6', (
                    <>
                        {renderControlParameter('Engine Regulation Deadband', '0', 'Basis: 0.44')}
                        {renderControlParameter('Flow Control Deadband', '2.54', 'Basis: 1.02')}
                        {renderControlParameter('T1 Position', '-')}
                        {renderControlParameter('T2 Position', '-')}
                        {renderControlParameter('Engine Regulation Valve Runtime', '120s')}
                        {renderControlParameter('Flow Control Valve Runtime', '68s')}
                        {renderControlParameter('Engine Regulation Integral', '0s')}
                        {renderControlParameter('Flow Control Integral', '-')}
                        {renderControlParameter('Flow Control RF', '6')}
                    </>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HeatDistributionScreen;