import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './unit-detailScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import useUnitDetail from '../../hooks/Unit-list/useUnitDetail';

interface UnitDetailScreenProps {
    navigation: any;
    route: any;
}

const UnitDetailScreen: React.FC<UnitDetailScreenProps> = ({ navigation, route }) => {
    const system = route.params?.system;
    const {
        // State
        isStarting,
        isStopping,
        systemStatus,
        expandedSection,

        // Data
        menuItems,
        generalData,
        lastCallData,
        customerLoginData,
        status2025Data,
        existingConfigData,

        // Methods
        toggleSection,
        handleStartSystem,
        handleStopSystem,
    } = useUnitDetail();

    const handleBackButton = () => {
        navigation.goBack();
    };

    const onSystemActionSuccess = (action: 'start' | 'stop') => {
        Alert.alert(
            'Success',
            `XRGI system ${action === 'start' ? 'started' : 'stopped'} successfully`
        );
    };

    // Move render functions after state and handlers
    const renderInfoRow = (label: string, value: string) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    const renderSubSection = (title: string, data: any, showTitle: boolean = true) => (
        <View style={styles.subSection}>
            {showTitle && title && <Text style={styles.subSectionTitle}>{title}</Text>}
            <View style={styles.infoGrid}>
                {renderInfoRow('Name', data.name)}
                {renderInfoRow('Address', data.address)}
                {renderInfoRow('City', data.city)}
                {renderInfoRow('Postal Code', data.postalCode)}
                {renderInfoRow('Country', data.country)}
                {renderInfoRow('Cell Phone no', data.cellPhone)}
            </View>
        </View>
    );

    const renderLastCallContent = () => (
        <View style={styles.expandedContent}>
            <View style={styles.lastCallContainer}>
                <View style={styles.lastCallSection}>
                    <View style={styles.lastCallRow}>
                        <Text style={styles.lastCallLabel}>Calls:</Text>
                        <Text style={styles.lastCallValue}>{lastCallData.calls}</Text>
                    </View>
                    <View style={styles.lastCallRow}>
                        <Text style={styles.lastCallLabel}>Time of call:</Text>
                        <Text style={styles.lastCallValue}>{lastCallData.timeOfCall}</Text>
                    </View>
                </View>

                <View style={styles.operationStatusCard}>
                    <Text style={styles.operationStatusTitle}>Operation Status</Text>
                    <View style={styles.operationStatusGrid}>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>Status</Text>
                            <View style={styles.stoppedBadge}>
                                <Text style={styles.stoppedBadgeText}>{lastCallData.operationStatus.status}</Text>
                            </View>
                        </View>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>Noise</Text>
                            <Text style={styles.operationStatusValue}>{lastCallData.operationStatus.noise}</Text>
                        </View>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>Oil Pressure</Text>
                            <Text style={styles.operationStatusValue}>{lastCallData.operationStatus.oilPressure}</Text>
                        </View>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>Gas Alarm</Text>
                            <Text style={styles.operationStatusValue}>{lastCallData.operationStatus.gasAlarm}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.gaugeContainer}>
                    <View style={styles.gaugeCard}>
                        <Text style={styles.gaugeTitle}>Control Panel Temperature</Text>
                        <View style={styles.gaugeWrapper}>
                            <CircularProgress
                                value={50}
                                radius={70}
                                duration={2000}
                                progressValueColor={'#0F172A'}
                                progressValueFontSize={24}
                                maxValue={100}
                                title={''}
                                titleColor={'#64748B'}
                                titleStyle={{ fontWeight: '600', fontSize: 11 }}
                                activeStrokeColor={'#EF4444'}
                                activeStrokeSecondaryColor={'#F59E0B'}
                                inActiveStrokeColor={'#E2E8F0'}
                                inActiveStrokeOpacity={0.5}
                                inActiveStrokeWidth={12}
                                activeStrokeWidth={12}
                                clockwise={true}
                                rotation={180}
                                strokeLinecap={'round'}
                            />
                            <Text style={styles.gaugeLabelBelow}>Cold • Normal • Warm</Text>
                        </View>
                    </View>

                    <View style={styles.gaugeCard}>
                        <Text style={styles.gaugeTitle}>Control Panel Antenna Signal</Text>
                        <View style={styles.gaugeWrapper}>
                            <CircularProgress
                                value={90}
                                radius={70}
                                duration={2000}
                                progressValueColor={'#0F172A'}
                                progressValueFontSize={24}
                                maxValue={100}
                                title={''}
                                titleColor={'#64748B'}
                                titleStyle={{ fontWeight: '600', fontSize: 11 }}
                                activeStrokeColor={'#10B981'}
                                activeStrokeSecondaryColor={'#3B82F6'}
                                inActiveStrokeColor={'#E2E8F0'}
                                inActiveStrokeOpacity={0.5}
                                inActiveStrokeWidth={12}
                                activeStrokeWidth={12}
                                clockwise={true}
                                rotation={180}
                                strokeLinecap={'round'}
                            />
                            <Text style={styles.gaugeLabelBelow}>Low • Medium • High</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderCustomerLoginContent = () => (
        <View style={styles.expandedContent}>
            <View style={styles.customerLoginContainer}>
                <View style={styles.customerLoginCard}>
                    <View style={styles.customerLoginRow}>
                        <Text style={styles.customerLoginLabel}>Last Login</Text>
                        <Text style={styles.customerLoginValue}>{customerLoginData.lastLogin}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderStatus2025Content = () => (
        <View style={styles.expandedContent}>
            <View style={styles.status2025Container}>
                <View style={styles.status2025Card}>
                    <View style={styles.status2025Section}>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Latest update:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.latestUpdate}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Operating hours:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.operatingHours}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Last service:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.lastService}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Operational hours to next service:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.operationalHoursToNextService}</Text>
                        </View>
                    </View>

                    <View style={styles.status2025Divider} />

                    <View style={styles.status2025Section}>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Elec. production:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.elecProduction}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Heat production:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.heatProduction}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Fuel consumption:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.fuelConsumption}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>First Call:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.firstCall}</Text>
                        </View>
                    </View>

                    <View style={styles.status2025Divider} />

                    <View style={styles.status2025Section}>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Site elec. consumption:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.siteElecConsumption}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Covered by XRGI® system:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.coveredByXRGISystem}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Covered by power purchase:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.coveredByPowerPurchase}</Text>
                        </View>
                        <View style={styles.status2025Row}>
                            <Text style={styles.status2025Label}>Sold electricity:</Text>
                            <Text style={styles.status2025Value}>{status2025Data.soldElectricity}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderExistingConfigContent = () => (
        <View style={styles.expandedContent}>
            <View style={styles.existingConfigContainer}>
                <View style={styles.existingConfigCard}>
                    {Object.entries(existingConfigData).map(([key, value], index) => (
                        <View key={key}>
                            <View style={styles.existingConfigRow}>
                                <Text style={styles.existingConfigLabel}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                </Text>
                                <Text style={styles.existingConfigValue}>{value}</Text>
                            </View>
                            {index < Object.entries(existingConfigData).length - 1 && (
                                <View style={styles.existingConfigDivider} />
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderExpandedContent = (itemId: string) => {
        switch (itemId) {
            case 'general':
                return (
                    <View style={styles.expandedContent}>
                        <View style={styles.systemNameHeader}>
                            <Text style={styles.systemNameTitle}>XRGI® System Name</Text>
                        </View>
                        {renderSubSection('', generalData.systemName, false)}
                        {renderSubSection('DEALER', generalData.dealer, true)}
                        {renderSubSection('Technician', generalData.technician, true)}
                    </View>
                );
            case 'lastCall':
                return renderLastCallContent();
            case 'customerLogin':
                return renderCustomerLoginContent();
            case 'status2025':
                return renderStatus2025Content();
            case 'existingConfig':
                return renderExistingConfigContent();
            default:
                return (
                    <View style={styles.expandedContent}>
                        <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>XRGI Unit</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Unit ID Card */}
                <View style={styles.unitIdCard}>
                    <View style={styles.unitIdIcon}>
                        <Ionicons name="cube-outline" size={28} color="#3B82F6" />
                    </View>
                    <View style={styles.unitIdContent}>
                        <Text style={styles.unitIdLabel}>XRGI ID</Text>
                        <Text style={styles.unitIdNumber}>{system?.xrgiID} / {system?.modelNumber}</Text>
                    </View>
                    {systemStatus === 'running' && (
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Running</Text>
                        </View>
                    )}
                </View>

                {/* Expandable Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <View key={item.id}>
                            <TouchableOpacity
                                style={[
                                    styles.menuItem,
                                    expandedSection === item.id && styles.menuItemExpanded
                                ]}
                                onPress={() => toggleSection(item.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.menuItemIconContainer}>
                                        <Ionicons name={item.icon as any} size={22} color="#3B82F6" />
                                    </View>
                                    <Text style={styles.menuItemText}>{item.title}</Text>
                                </View>
                                <Ionicons
                                    name={expandedSection === item.id ? "chevron-down" : "chevron-forward"}
                                    size={20}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>

                            {expandedSection === item.id && renderExpandedContent(item.id)}

                            {index < menuItems.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>

                {/* System Control Card */}
                <View style={styles.controlCard}>
                    <View style={styles.controlHeader}>
                        <Ionicons name="power" size={24} color="#0F172A" />
                        <Text style={styles.controlTitle}>System Control</Text>
                    </View>

                    <Text style={styles.controlDescription}>
                        Use these controls to manually start or stop the XRGI system.
                        Please ensure proper authorization before making changes.
                    </Text>

                    <View style={styles.controlButtons}>
                        <TouchableOpacity
                            style={[
                                styles.startButton,
                                (isStarting || systemStatus === 'running') && styles.buttonDisabled
                            ]}
                            onPress={() => handleStartSystem(() => onSystemActionSuccess('start'))}
                            disabled={isStarting || systemStatus === 'running'}
                            activeOpacity={0.8}
                        >
                            <View style={styles.buttonIconCircle}>
                                <Ionicons
                                    name="play"
                                    size={16}
                                    color="#FFFFFF"
                                />
                            </View>
                            <Text style={styles.startButtonText}>
                                {isStarting ? 'Starting...' : 'Start'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.stopButton,
                                (isStopping || systemStatus === 'stopped') && styles.stopButtonDisabled
                            ]}
                            onPress={() => handleStopSystem(() => onSystemActionSuccess('stop'))}
                            disabled={isStopping || systemStatus === 'stopped'}
                            activeOpacity={0.8}
                        >
                            <View style={styles.stopButtonIconCircle}>
                                <Ionicons
                                    name="stop"
                                    size={16}
                                    color="#64748B"
                                />
                            </View>
                            <Text style={styles.stopButtonText}>
                                {isStopping ? 'Stopping...' : 'Stop'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default UnitDetailScreen;