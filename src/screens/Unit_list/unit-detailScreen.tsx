import Alert from '@/components/Modals/Alert';
import ConfirmationModal from '@/components/Modals/ConfirmationModal';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUnitDetail from '../../hooks/Unit-list/useUnitDetail';
import styles from './unit-detailScreen.styles';

interface UnitDetailScreenProps {
    navigation: any;
    route: any;
}

const UnitDetailScreen: React.FC<UnitDetailScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const system = route.params?.system;
    const [successAlert, setSuccessAlert] = useState({ visible: false, message: '' });
    
    const {
        // State
        isStarting,
        isStopping,
        systemStatus,
        expandedSection,
        isLoading,
        isRecentCallLoading,
        isSystemConfigurationLoading,
        isStatusData2025Loading,
        alert,

        // Data
        menuItems,
        generalData,
        lastCallData,
        customerLoginData,
        formattedStatusData,
        existingConfigData,

        // Methods
        toggleSection,
        handleStartSystem,
        handleStopSystem,
        handleAlertConfirm,
        handleAlertCancel,
    } = useUnitDetail({ XrgiId: system?.xrgiID });

    const handleBackButton = () => {
        navigation.goBack();
    };

    const onSystemActionSuccess = (action: 'start' | 'stop') => {
        setSuccessAlert({
            visible: true,
            message: action === 'start' ? t('unitDetail.alerts.systemStarted') : t('unitDetail.alerts.systemStopped')
        });
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
                {renderInfoRow(t('unitDetail.general.name'), data.name)}
                {renderInfoRow(t('unitDetail.general.address'), data.address)}
                {renderInfoRow(t('unitDetail.general.city'), data.city)}
                {renderInfoRow(t('unitDetail.general.postalCode'), data.postalCode)}
                {renderInfoRow(t('unitDetail.general.country'), data.country)}
                {renderInfoRow(t('unitDetail.general.email'), data.email)}
                {renderInfoRow(t('unitDetail.general.cellPhone'), data.cellPhone)}
            </View>
        </View>
    );

    const renderLastCallContent = () => (
        <View style={styles.expandedContent}>
            <View style={styles.lastCallContainer}>
                <View style={styles.lastCallSection}>
                    <View style={styles.lastCallRow}>
                        <Text style={styles.lastCallLabel}>{t('unitDetail.lastCall.calls')}</Text>
                        <Text style={styles.lastCallValue}>{lastCallData.calls}</Text>
                    </View>
                    <View style={styles.lastCallRow}>
                        <Text style={styles.lastCallLabel}>{t('unitDetail.lastCall.timeOfCall')}</Text>
                        <Text style={styles.lastCallValue}>{lastCallData.timeOfCall}</Text>
                    </View>
                </View>

                <View style={styles.operationStatusCard}>
                    <Text style={styles.operationStatusTitle}>{t('unitDetail.lastCall.operationStatus')}</Text>
                    <View style={styles.operationStatusGrid}>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>{t('unitDetail.lastCall.status')}</Text>
                            <View style={styles.stoppedBadge}>
                                <Text style={styles.stoppedBadgeText}>{lastCallData.operationStatus.status}</Text>
                            </View>
                        </View>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>{t('unitDetail.lastCall.noise')}</Text>
                            <Text style={styles.operationStatusValue}>{lastCallData.operationStatus.noise}</Text>
                        </View>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>{t('unitDetail.lastCall.oilPressure')}</Text>
                            <Text style={styles.operationStatusValue}>{lastCallData.operationStatus.oilPressure}</Text>
                        </View>
                        <View style={styles.operationStatusItem}>
                            <Text style={styles.operationStatusLabel}>{t('unitDetail.lastCall.gasAlarm')}</Text>
                            <Text style={styles.operationStatusValue}>{lastCallData.operationStatus.gasAlarm}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.gaugeContainer}>
                    <View style={styles.gaugeCard}>
                        <Text style={styles.gaugeTitle}>{t('unitDetail.lastCall.controlPanelTemp')}</Text>
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
                            <Text style={styles.gaugeLabelBelow}>{t('unitDetail.lastCall.tempRange')}</Text>
                        </View>
                    </View>

                    <View style={styles.gaugeCard}>
                        <Text style={styles.gaugeTitle}>{t('unitDetail.lastCall.controlPanelSignal')}</Text>
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
                            <Text style={styles.gaugeLabelBelow}>{t('unitDetail.lastCall.signalRange')}</Text>
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
                        <Text style={styles.customerLoginLabel}>{t('unitDetail.customerLogin.lastLogin')}</Text>
                        <Text style={styles.customerLoginValue}>{customerLoginData.lastLogin}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderstatusContent = () => (
        <View style={styles.expandedContent}>
            <View style={styles.statusContainer}>
                <View style={styles.statusCard}>
                    <View style={styles.statusSection}>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.latestUpdate')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.latestUpdate}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.operatingHours')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.operatingHours}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.lastService')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.lastService}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.operationalHoursToNextService')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.operationalHoursToNextService}</Text>
                        </View>
                    </View>

                    <View style={styles.statusDivider} />

                    <View style={styles.statusSection}>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.elecProduction')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.elecProduction}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.heatProduction')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.heatProduction}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.fuelConsumption')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.fuelConsumption}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.firstCall')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.firstCall}</Text>
                        </View>
                    </View>

                    <View style={styles.statusDivider} />

                    <View style={styles.statusSection}>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.siteElecConsumption')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.siteElecConsumption}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.coveredByXRGI')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.coveredByXRGISystem}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.coveredByPowerPurchase')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.coveredByPowerPurchase}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>{t('unitDetail.status.soldElectricity')}</Text>
                            <Text style={styles.statusValue}>{formattedStatusData.soldElectricity}</Text>
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
                            <Text style={styles.systemNameTitle}>{t('unitDetail.general.systemName')}</Text>
                        </View>
                        {renderSubSection('', generalData.systemName, false)}
                        {renderSubSection(t('unitDetail.general.dealer'), generalData.dealer, true)}
                        {renderSubSection(t('unitDetail.general.technician'), generalData.technician, true)}
                    </View>
                );
            case 'lastCall':
                return renderLastCallContent();
            case 'customerLogin':
                return renderCustomerLoginContent();
            case 'status':
                return renderstatusContent();
            case 'existingConfig':
                return renderExistingConfigContent();
            default:
                return (
                    <View style={styles.expandedContent}>
                        <Text style={styles.comingSoonText}>{t('unitDetail.comingSoon')}</Text>
                    </View>
                );
        }
    };

    // Loading state
    if (isLoading || isRecentCallLoading || isSystemConfigurationLoading || isStatusData2025Loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>{t('unitDetail.loading')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('unitDetail.header')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Unit ID Card */}
                <View style={styles.unitIdCard}>
                    <View style={styles.unitIdIcon}>
                        <Ionicons name="cube-outline" size={28} color="#3B82F6" />
                    </View>
                    <View style={styles.unitIdContent}>
                        <Text style={styles.unitIdLabel}>{t('unitDetail.xrgiId')}</Text>
                        <Text style={styles.unitIdNumber}>{system?.xrgiID} / {system?.modelNumber}</Text>
                    </View>
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
                        <Text style={styles.controlTitle}>{t('unitDetail.systemControl.title')}</Text>
                    </View>

                    <Text style={styles.controlDescription}>
                        {t('unitDetail.systemControl.description')}
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
                                {isStarting ? t('unitDetail.systemControl.starting') : t('unitDetail.systemControl.start')}
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
                                {isStopping ? t('unitDetail.systemControl.stopping') : t('unitDetail.systemControl.stop')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isVisible={alert.visible}
                onClose={handleAlertCancel}
                onConfirm={handleAlertConfirm}
                title={alert.title}
                message={alert.message}
                type={alert.type === 'error' ? 'error' : 'success'}
                confirmText={alert.type === 'error' ? t('unitDetail.systemControl.stop') : t('unitDetail.systemControl.start')}
                cancelText={t('unitDetail.alerts.cancel')}
            />

            {/* Success Alert */}
            <Alert
                isVisible={successAlert.visible}
                onClose={() => setSuccessAlert({ visible: false, message: '' })}
                type="success"
                title={t('unitDetail.alerts.success')}
                message={successAlert.message}
                buttonText={t('unitDetail.alerts.ok')}
            />
        </SafeAreaView>
    );
};

export default UnitDetailScreen;