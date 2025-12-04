import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './heat-distributionScreen.styles';

import { SystemController } from '@/controllers/SystemController';
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
    timestamp?: string;
    data?: HeatControlValue;
}

export interface SensorData {
    Temp: number;
    Status: string;
}

export interface PumpFeedback {
    Actual: number;
    Status: string;
}

export interface PowerOutput {
    Value: number;
    Unit: string;
}

export interface HeatProductionData {
    HeatProduction: any;
}

export interface HeatControlValue {
    AuxTempTrackerSensor1?: SensorData;
    AuxTempTrackerSensor2?: SensorData;
    AuxTempTrackerSensor3?: SensorData;
    AuxTempTrackerSensor4?: SensorData;
    EngineFlow?: number;
    EnginePumpFeedback?: PumpFeedback;
    EnginePumpForce?: number;
    EngineRegulationDeadband?: number;
    EngineRegulationDeadbandBasis?: number;
    EngineRegulationHeatProduction?: HeatProductionData;
    EngineRegulationIntegral?: number;
    EngineRegulationTmkSetpoint?: number;
    EngineRegulationTmvMax?: number;
    EngineRegulationValveRuntime?: number;
    EngineValveStatus?: string;
    FlowControlDeadband?: number;
    FlowControlDeadbandBasis?: number;
    FlowControlIntegral?: number;
    FlowControlOperationalSensor?: SensorData;
    FlowControlReturnSensor?: SensorData;
    FlowControlRf?: number;
    FlowControlSupplySensor?: SensorData;
    FlowControlValveRuntime?: number;
    FlowMasterBypassSensor?: SensorData;
    FlowMasterPumpFeedback?: PumpFeedback;
    FlowMasterSourceSensor?: SensorData;
    FlowMasterValvePosition?: number;
    FlowPump?: number;
    FlowValveStatus?: string;
    HCfMManualStatus?: string;
    HeatControlReturnTemperature?: SensorData;
    HeatControlTlk?: SensorData;
    HeatControlTlv?: SensorData;
    HeatControlTmk?: SensorData;
    HeatControlTmv?: SensorData;
    HeatStoragePercent?: number;
    PowerUnitHeatOutput?: PowerOutput;
    PowerUnitSetpointSensor?: SensorData;
    StorageBottomSensor?: SensorData;
    StorageFlow?: number;
    StoragePumpFeedback?: PumpFeedback;
    StoragePumpForce?: number;
    StorageSensorStatus?: string;
    StorageSequenceStatus?: string;
    StorageTopSensor?: SensorData;
    T1Position?: number;
    T2Position?: number;
    VirtualFlowMasterSourceActive?: boolean;
}

const HeatDistributionScreen: React.FC<HeatDistributionScreenProps> = ({ navigation, route }) => {
    const system = route.params.system;
    const [selectedTime, setSelectedTime] = useState<string>('T-0s');
    const [HeatDistributionData, setHeatDistributionData] = useState<HeatControlValue | null>(null);
    const [timeButtons, setTimeButtons] = useState<TimeButton[]>([]);
    const [heatControlDataHistory, setHeatControlDataHistory] = useState<HeatControlValue[]>([]);

    const handleBackButton = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('CallDetailsResult');
        }
    };

    const getSystemConfiguration = async () => {
        try {
            const response = await SystemController.getSystemConfiguration(system.xrgiID);
            if (response?.raw) {
                const operationDataArray = response.raw?.plantOperationData || [];

                const operationDataWithTimestamp = operationDataArray.filter(
                    (item: any) => item["plant#metric"] === `${system.xrgiID}#HeatControlData`
                );

                const sortedData = operationDataWithTimestamp.sort(
                    (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                const latest6Data = sortedData.slice(0, 6);

                const heatControlData: HeatControlValue[] = latest6Data.map(
                    (item: any) => item.value || {}
                );

                setHeatControlDataHistory(heatControlData);

                // Create time buttons with proper timestamps
                const buttons: TimeButton[] = latest6Data.map((item: any, index: number) => {
                    const formattedTime = formatTimestamp(item.timestamp);
                    return {
                        label: `T-${index * 10}s`,
                        value: formattedTime,
                        timestamp: item.timestamp,
                        data: heatControlData[index]
                    };
                });

                setTimeButtons(buttons);

                // Set the latest data as default (T-0s) using heatControlDataHistory
                if (heatControlDataHistory.length > 0) {
                    setHeatDistributionData(heatControlDataHistory[0]);
                }
            } else {
                console.log("Error getting system configuration", response.error);
                setHeatDistributionData(null);
            }
        } catch (error) {
            console.log("Error getting system configuration", error);
            setHeatDistributionData(null);
        }
    };

    // Handle time button selection
    const handleTimeSelection = (button: TimeButton) => {
        setSelectedTime(button.label);

        // Get the index from the button label (T-0s -> 0, T-10s -> 1, etc.)
        const index = parseInt(button.label.replace('T-', '').replace('s', '')) / 10;

        // Use heatControlDataHistory to get the correct data
        if (heatControlDataHistory[index]) {
            setHeatDistributionData(heatControlDataHistory[index]);
        }
    };

    const formatTimestamp = (timestamp: any): string => {
        try {
            let date: Date;

            if (typeof timestamp === 'number') {
                if (timestamp < 1000000000000) {
                    date = new Date(timestamp * 1000);
                } else {
                    date = new Date(timestamp);
                }
            } else if (typeof timestamp === 'string') {
                if (timestamp.includes('T') || timestamp.includes('-')) {
                    date = new Date(timestamp);
                } else {
                    const cleanTimestamp = timestamp.replace(/\./g, '-').replace(',', '');
                    date = new Date(cleanTimestamp);
                }
            } else {
                date = new Date();
            }

            // Format to DD-MM-YYYY HH:MM
            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.log('Error formatting timestamp:', error);
            return 'Invalid Date';
        }
    };

    useEffect(() => {
        getSystemConfiguration();
    }, []);

    // Update displayed data when heatControlDataHistory changes or selectedTime changes
    useEffect(() => {
        if (heatControlDataHistory.length > 0) {
            const index = parseInt(selectedTime.replace('T-', '').replace('s', '')) / 10;
            if (heatControlDataHistory[index]) {
                setHeatDistributionData(heatControlDataHistory[index]);
            }
        }
    }, [heatControlDataHistory, selectedTime]);

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
                    <Text style={styles.systemId}>Heat Distribution Control System: {system.xrgiID}</Text>
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
                                    onPress={() => handleTimeSelection(btn)}
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
                        Showing latest 6 records | {timeButtons.find(btn => btn.label === selectedTime)?.timestamp ? formatTimestamp(timeButtons.find(btn => btn.label === selectedTime)?.timestamp) : 'Loading...'}
                    </Text>
                </View>

                {/* Status Cards Grid */}
                <View style={styles.statusGrid}>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Manual Status', HeatDistributionData?.HCfMManualStatus || 'Auto', 'settings-outline', '#3B82F6')}
                    </View>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Engine Valve', HeatDistributionData?.EngineValveStatus || '-', 'water-outline', '#10B981')}
                    </View>
                </View>

                <View style={styles.statusGrid}>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Flow Valve', HeatDistributionData?.FlowValveStatus || 'Off', 'pulse-outline', '#8B5CF6')}
                    </View>
                    <View style={styles.statusCardWrapper}>
                        {renderStatusCard('Storage %', HeatDistributionData?.HeatStoragePercent ? `${HeatDistributionData.HeatStoragePercent}%` : '-', 'layers-outline', '#F59E0B')}
                    </View>
                </View>

                <View style={styles.statusCardFull}>
                    {renderStatusCard('Heat Output', HeatDistributionData?.PowerUnitHeatOutput ? `${HeatDistributionData.PowerUnitHeatOutput.Value} ${HeatDistributionData.PowerUnitHeatOutput.Unit}` : '-', 'flash-outline', '#EF4444')}
                </View>

                {/* Engine System */}
                {renderSensorSection('Engine System', 'cog-outline', '#3B82F6', (
                    <>
                        {renderSensorRow('Engine Flow', HeatDistributionData?.EngineFlow ? `${HeatDistributionData.EngineFlow} L/min` : '-')}
                        {renderSensorRow('Pump Force', HeatDistributionData?.EnginePumpForce ? `${HeatDistributionData.EnginePumpForce}` : '-')}
                        {renderSensorRow('TMK Setpoint', HeatDistributionData?.EngineRegulationTmkSetpoint ? `${HeatDistributionData.EngineRegulationTmkSetpoint}°C` : '1.08')}
                        {renderSensorRow('TMV Max', HeatDistributionData?.EngineRegulationTmvMax ? `${HeatDistributionData.EngineRegulationTmvMax}°C` : '-')}
                        {renderSensorRow('Engine Pump Feedback', HeatDistributionData?.EnginePumpFeedback ? `${HeatDistributionData.EnginePumpFeedback.Actual} L/min (${HeatDistributionData.EnginePumpFeedback.Status})` : '-')}
                    </>
                ))}

                {/* Temperature Sensors */}
                {renderSensorSection('Heat Control Temperature Sensors', 'thermometer-outline', '#EF4444', (
                    <>
                        {renderSensorRow('TLK Sensor', HeatDistributionData?.HeatControlTlk ? `${HeatDistributionData.HeatControlTlk.Temp}°C (${HeatDistributionData.HeatControlTlk.Status})` : '-')}
                        {renderSensorRow('TLV Sensor', HeatDistributionData?.HeatControlTlv ? `${HeatDistributionData.HeatControlTlv.Temp}°C (${HeatDistributionData.HeatControlTlv.Status})` : '-')}
                        {renderSensorRow('TMK Sensor', HeatDistributionData?.HeatControlTmk ? `${HeatDistributionData.HeatControlTmk.Temp}°C (${HeatDistributionData.HeatControlTmk.Status})` : '-')}
                        {renderSensorRow('TMV Max', HeatDistributionData?.EngineRegulationTmvMax ? `${HeatDistributionData.EngineRegulationTmvMax}°C` : '-')}
                        {renderSensorRow('Return Temperature', HeatDistributionData?.HeatControlReturnTemperature ? `${HeatDistributionData.HeatControlReturnTemperature.Temp}°C (${HeatDistributionData.HeatControlReturnTemperature.Status})` : '-')}
                    </>
                ))}

                {/* Flow Control Sensors */}
                {renderSensorSection('Flow Control Sensors', 'water-outline', '#10B981', (
                    <>
                        {renderGreenStatusCard('Power Unit Setpoint', HeatDistributionData?.PowerUnitSetpointSensor ? `${HeatDistributionData.PowerUnitSetpointSensor.Temp}°C` : '0°C', HeatDistributionData?.PowerUnitSetpointSensor?.Status || 'Ok')}
                        {renderGreenStatusCard('Operational', HeatDistributionData?.FlowControlOperationalSensor ? `${HeatDistributionData.FlowControlOperationalSensor.Temp}°C` : '0°C', HeatDistributionData?.FlowControlOperationalSensor?.Status || 'Ok')}
                        {renderGreenStatusCard('Return', HeatDistributionData?.FlowControlReturnSensor ? `${HeatDistributionData.FlowControlReturnSensor.Temp}°C` : '0°C', HeatDistributionData?.FlowControlReturnSensor?.Status || 'Ok')}
                        {renderGreenStatusCard('Supply', HeatDistributionData?.FlowControlSupplySensor ? `${HeatDistributionData.FlowControlSupplySensor.Temp}°C` : '0°C', HeatDistributionData?.FlowControlSupplySensor?.Status || 'Ok')}
                        {renderGreenStatusCard('Master Bypass', HeatDistributionData?.FlowMasterBypassSensor ? `${HeatDistributionData.FlowMasterBypassSensor.Temp}°C` : '0°C', HeatDistributionData?.FlowMasterBypassSensor?.Status || 'Ok')}
                        {renderGreenStatusCard('Master Source', HeatDistributionData?.FlowMasterSourceSensor ? `${HeatDistributionData.FlowMasterSourceSensor.Temp}°C` : '0°C', HeatDistributionData?.FlowMasterSourceSensor?.Status || 'Ok')}
                    </>
                ))}

                {/* Auxiliary Temperature Trackers */}
                {renderSensorSection('Auxiliary Temperature Trackers', 'thermometer-outline', '#EF4444', (
                    <>
                        {renderSensorRow('Aux Sensor 1', HeatDistributionData?.AuxTempTrackerSensor1 ? `${HeatDistributionData.AuxTempTrackerSensor1.Temp}°C (${HeatDistributionData.AuxTempTrackerSensor1.Status})` : '-')}
                        {renderSensorRow('Aux Sensor 2', HeatDistributionData?.AuxTempTrackerSensor2 ? `${HeatDistributionData.AuxTempTrackerSensor2.Temp}°C (${HeatDistributionData.AuxTempTrackerSensor2.Status})` : '-')}
                        {renderSensorRow('Aux Sensor 3', HeatDistributionData?.AuxTempTrackerSensor3 ? `${HeatDistributionData.AuxTempTrackerSensor3.Temp}°C (${HeatDistributionData.AuxTempTrackerSensor3.Status})` : '-')}
                        {renderSensorRow('Aux Sensor 4', HeatDistributionData?.AuxTempTrackerSensor4 ? `${HeatDistributionData.AuxTempTrackerSensor4.Temp}°C (${HeatDistributionData.AuxTempTrackerSensor4.Status})` : '-')}
                    </>
                ))}

                {/* Storage System */}
                {renderSensorSection('Storage System', 'layers-outline', '#F59E0B', (
                    <>
                        {renderSensorRow('Storage Flow', HeatDistributionData?.StorageFlow ? `${HeatDistributionData.StorageFlow} L/min` : '0.28 L/min')}
                        {renderSensorRow('Pump Force', HeatDistributionData?.StoragePumpForce ? `${HeatDistributionData.StoragePumpForce}` : '-')}
                        {renderSensorRow('Sensor Status', HeatDistributionData?.StorageSensorStatus || '-')}
                        {renderSensorRow('Sequence Status', HeatDistributionData?.StorageSequenceStatus || '-')}
                        {renderSensorRow('Storage Top Sensor', HeatDistributionData?.StorageTopSensor ? `${HeatDistributionData.StorageTopSensor.Temp}°C (${HeatDistributionData.StorageTopSensor.Status})` : '-')}
                        {renderSensorRow('Storage Bottom Sensor', HeatDistributionData?.StorageBottomSensor ? `${HeatDistributionData.StorageBottomSensor.Temp}°C (${HeatDistributionData.StorageBottomSensor.Status})` : '-')}
                        {renderSensorRow('Storage Pump Feedback', HeatDistributionData?.StoragePumpFeedback ? `${HeatDistributionData.StoragePumpFeedback.Actual} L/min (${HeatDistributionData.StoragePumpFeedback.Status})` : '-')}
                    </>
                ))}

                {/* Flow Master System */}
                {renderSensorSection('Flow Master System', 'git-network-outline', '#10B981', (
                    <>
                        {renderSensorRow('Valve Position', HeatDistributionData?.FlowMasterValvePosition ? `${HeatDistributionData.FlowMasterValvePosition}%` : '-')}
                        <View style={styles.sensorRow}>
                            <Text style={styles.sensorLabel}>Flow Pump</Text>
                            <Text style={[styles.sensorValue, styles.percentageValue]}>{HeatDistributionData?.FlowPump ? `${HeatDistributionData.FlowPump}%` : '60%'}</Text>
                        </View>
                        <View style={styles.sensorRow}>
                            <Text style={styles.sensorLabel}>Virtual Source Active</Text>
                            <Text style={styles.sensorValue}>{HeatDistributionData?.VirtualFlowMasterSourceActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                        {renderSensorRow('Flow Master Pump Feedback', HeatDistributionData?.FlowMasterPumpFeedback ? `${HeatDistributionData.FlowMasterPumpFeedback.Actual} L/min (${HeatDistributionData.FlowMasterPumpFeedback.Status})` : '-')}
                    </>
                ))}

                {/* Control Parameters */}
                {renderSensorSection('Control Parameters', 'options-outline', '#8B5CF6', (
                    <>
                        {renderControlParameter('Engine Regulation Deadband', HeatDistributionData?.EngineRegulationDeadband ? `${HeatDistributionData.EngineRegulationDeadband}` : '0', `Basis: ${HeatDistributionData?.EngineRegulationDeadbandBasis || '0.44'}`)}
                        {renderControlParameter('Flow Control Deadband', HeatDistributionData?.FlowControlDeadband ? `${HeatDistributionData.FlowControlDeadband}` : '2.54', `Basis: ${HeatDistributionData?.FlowControlDeadbandBasis || '1.02'}`)}
                        {renderControlParameter('T1 Position', HeatDistributionData?.T1Position ? `${HeatDistributionData.T1Position}` : '-')}
                        {renderControlParameter('T2 Position', HeatDistributionData?.T2Position ? `${HeatDistributionData.T2Position}` : '-')}
                        {renderControlParameter('Engine Regulation Valve Runtime', HeatDistributionData?.EngineRegulationValveRuntime ? `${HeatDistributionData.EngineRegulationValveRuntime}s` : '120s')}
                        {renderControlParameter('Flow Control Valve Runtime', HeatDistributionData?.FlowControlValveRuntime ? `${HeatDistributionData.FlowControlValveRuntime}s` : '68s')}
                        {renderControlParameter('Engine Regulation Integral', HeatDistributionData?.EngineRegulationIntegral ? `${HeatDistributionData.EngineRegulationIntegral}s` : '0s')}
                        {renderControlParameter('Flow Control Integral', HeatDistributionData?.FlowControlIntegral ? `${HeatDistributionData.FlowControlIntegral}s` : '-')}
                        {renderControlParameter('Flow Control RF', HeatDistributionData?.FlowControlRf ? `${HeatDistributionData.FlowControlRf}` : '6')}
                    </>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HeatDistributionScreen;