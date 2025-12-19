import Alert from '@/components/Modals/Alert';
import { serviceReportController } from '@/controllers/serviceReportController';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tabCommonStyles from './tabsComman.styles';

interface UploadTabProps {
    systemData: any;
    navigation: any;
    loading?: boolean;
    customerID?: string;
}

export interface UploadedFile {
    name: string;
    size: number;
    type: string;
    uri: string;
}

const UploadTab: React.FC<UploadTabProps> = ({ systemData, loading, customerID }) => {
    const { t } = useTranslation();
    const [creationDate, setCreationDate] = useState<Date>(new Date());
    const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
    const [showCreationDatePicker, setShowCreationDatePicker] = useState(false);
    const [showCreationTimePicker, setShowCreationTimePicker] = useState(false);
    const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
    const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false);
    const [serviceType, setServiceType] = useState('');
    const [serviceReportNumber, setServiceReportNumber] = useState('');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [alert, setAlert] = useState({
        visible: false,
        type: 'success' as 'success' | 'error' | 'info' | 'warning',
        title: '',
        message: ''
    });

    const serviceTypes = [
        { id: 'RegularService', label: t('statistics.serviceReport.detailScreen.uploadTab.serviceTypes.regularService'), icon: 'people' },
        { id: 'repair', label: t('statistics.serviceReport.detailScreen.uploadTab.serviceTypes.repair'), icon: 'construct' },
        { id: 'maintenance', label: t('statistics.serviceReport.detailScreen.uploadTab.serviceTypes.maintenance'), icon: 'settings' },
        { id: 'Commissioning', label: t('statistics.serviceReport.detailScreen.uploadTab.serviceTypes.commissioning'), icon: 'hammer' }
    ];

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setUploadError('');
    };

    const handleFileSelect = async () => {
        setUploadError('');
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/jpeg', 'image/png'],
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];

                const allowedTypes = [
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                ];
                if (!allowedTypes.includes(asset.mimeType || '')) {
                    setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.invalidFileType'));
                    return;
                }

                if (asset.size && asset.size > 10 * 1024 * 1024) {
                    setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.fileSizeExceedsLimit'));
                    return;
                }

                const file: UploadedFile = {
                    name: asset.name || 'document',
                    size: asset.size || 0,
                    type: asset.mimeType || 'application/octet-stream',
                    uri: asset.uri
                };

                setUploadedFile(file);
                setUploadError('');
            }
        } catch (error) {
            console.log('Error picking file:', error);
            setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.failedToSelectFile'));
        }
    };

    const handleFileUpload = async () => {
        if (!uploadedFile) {
            setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.pleaseSelectFile'));
            return;
        }

        if (!uploadedFile.size || uploadedFile.size === 0) {
            setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.selectedFileEmpty'));
            return;
        }

        if (!systemData?.xrgiID || !customerID) {
            setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.systemDataMissing'));
            return;
        }

        if (!serviceType) {
            setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.pleaseSelectServiceType'));
            return;
        }

        if (!serviceReportNumber) {
            setUploadError(t('statistics.serviceReport.detailScreen.uploadTab.errors.pleaseEnterServiceReportNumber'));
            return;
        }

        setIsUploading(true);
        setUploadError('');

        try {
            // Prepare upload data
            const uploadData = {
                file: uploadedFile,
                creationDate: creationDate.toISOString(),
                deliveryDate: deliveryDate.toISOString(),
                serviceType: serviceType,
                serviceReportNumber: serviceReportNumber,
                customerID: customerID,
                xrgiID: systemData.xrgiID,
            };

            // Call the API
            const response = await serviceReportController.UploadServiceReport(
                systemData.xrgiID,
                uploadData
            );
            console.log("Upload response:", response);

            setAlert({
                visible: true,
                type: 'success',
                title: t('statistics.serviceReport.detailScreen.uploadTab.errors.uploadSuccessful'),
                message: t('statistics.serviceReport.detailScreen.uploadTab.errors.reportUploadedSuccessfully')
            });
            handleClearAll();
        } catch (error) {
            console.log("Upload error:", error);
            const errorMessage = error instanceof Error ? error.message : t('statistics.serviceReport.detailScreen.uploadTab.errors.failedToUploadFile');
            setUploadError(errorMessage);
            setAlert({
                visible: true,
                type: 'error',
                title: t('statistics.serviceReport.detailScreen.uploadTab.errors.uploadFailed'),
                message: errorMessage
            });
        } finally {
            setIsUploading(false);
        }
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const formatTime = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    };

    const onCreationDateChange = (event: any, selectedDate?: Date) => {
        setShowCreationDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setCreationDate(selectedDate);
        }
    };

    const onCreationTimeChange = (event: any, selectedDate?: Date) => {
        setShowCreationTimePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setCreationDate(selectedDate);
        }
    };

    const onDeliveryDateChange = (event: any, selectedDate?: Date) => {
        setShowDeliveryDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDeliveryDate(selectedDate);
        }
    };

    const onDeliveryTimeChange = (event: any, selectedDate?: Date) => {
        setShowDeliveryTimePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDeliveryDate(selectedDate);
        }
    };

    const handleClearAll = () => {
        setCreationDate(new Date());
        setDeliveryDate(new Date());
        setServiceType('');
        setServiceReportNumber('');
        setUploadedFile(null);
    };

    const selectServiceType = (type: string) => {
        setServiceType(type);
        setShowServiceTypeDropdown(false);
    };

    const getSelectedServiceTypeLabel = () => {
        const selected = serviceTypes.find(st => st.id === serviceType);
        return selected ? selected.label : t('statistics.serviceReport.detailScreen.uploadTab.selectServiceTypePlaceholder');
    };

    if (isUploading) {
        return (
            <View style={tabCommonStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={tabCommonStyles.loadingText}>{t('statistics.serviceReport.detailScreen.uploadTab.loading')}</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView
                style={tabCommonStyles.tabContainer}
                contentContainerStyle={tabCommonStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Upload Form Card */}
                <View style={[tabCommonStyles.card, styles.uploadCard]}>
                    <View style={styles.formHeader}>
                        <View style={tabCommonStyles.iconContainer}>
                            <Ionicons name="cloud-upload" size={20} color="#3b82f6" />
                        </View>
                        <Text style={styles.formTitle}>{t('statistics.serviceReport.detailScreen.uploadTab.title')}</Text>
                    </View>

                    <Text style={styles.formDescription}>
                        {t('statistics.serviceReport.detailScreen.uploadTab.formDescription')}
                    </Text>

                    {/* Form Fields */}
                    <View style={styles.formSection}>
                        {/* Creation Date */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('statistics.serviceReport.detailScreen.uploadTab.creationDate')}</Text>
                            <View style={styles.dateTimeContainer}>
                                <TouchableOpacity
                                    style={[styles.input, styles.dateTimeButton]}
                                    onPress={() => setShowCreationDatePicker(true)}
                                >
                                    <Ionicons name="calendar" size={18} color="#64748b" style={styles.dateTimeIcon} />
                                    <Text style={styles.dateTimeText}>{formatDate(creationDate)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.input, styles.timeButton]}
                                    onPress={() => setShowCreationTimePicker(true)}
                                >
                                    <Ionicons name="time" size={18} color="#64748b" style={styles.dateTimeIcon} />
                                    <Text style={styles.dateTimeText}>{formatTime(creationDate)}</Text>
                                </TouchableOpacity>
                            </View>
                            {showCreationDatePicker && (
                                <DateTimePicker
                                    value={creationDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onCreationDateChange}
                                />
                            )}
                            {showCreationTimePicker && (
                                <DateTimePicker
                                    value={creationDate}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onCreationTimeChange}
                                />
                            )}
                        </View>

                        {/* Date of Delivery */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('statistics.serviceReport.detailScreen.uploadTab.dateOfDelivery')}</Text>
                            <View style={styles.dateTimeContainer}>
                                <TouchableOpacity
                                    style={[styles.input, styles.dateTimeButton]}
                                    onPress={() => setShowDeliveryDatePicker(true)}
                                >
                                    <Ionicons name="calendar" size={18} color="#64748b" style={styles.dateTimeIcon} />
                                    <Text style={styles.dateTimeText}>{formatDate(deliveryDate)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.input, styles.timeButton]}
                                    onPress={() => setShowDeliveryTimePicker(true)}
                                >
                                    <Ionicons name="time" size={18} color="#64748b" style={styles.dateTimeIcon} />
                                    <Text style={styles.dateTimeText}>{formatTime(deliveryDate)}</Text>
                                </TouchableOpacity>
                            </View>
                            {showDeliveryDatePicker && (
                                <DateTimePicker
                                    value={deliveryDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onDeliveryDateChange}
                                />
                            )}
                            {showDeliveryTimePicker && (
                                <DateTimePicker
                                    value={deliveryDate}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onDeliveryTimeChange}
                                />
                            )}
                        </View>

                        {/* Service Type Dropdown */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('statistics.serviceReport.detailScreen.uploadTab.serviceType')}</Text>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setShowServiceTypeDropdown(!showServiceTypeDropdown)}
                                activeOpacity={0.7}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Ionicons
                                        name={serviceType ?
                                            serviceTypes.find(st => st.id === serviceType)?.icon as any :
                                            'list'
                                        }
                                        size={18}
                                        color={serviceType ? "#3b82f6" : "#64748b"}
                                    />
                                    <Text style={[
                                        styles.dropdownText,
                                        !serviceType && styles.dropdownPlaceholder
                                    ]}>
                                        {getSelectedServiceTypeLabel()}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={showServiceTypeDropdown ? "chevron-up" : "chevron-down"}
                                    size={18}
                                    color="#64748b"
                                />
                            </TouchableOpacity>

                            {/* Dropdown Options */}
                            {showServiceTypeDropdown && (
                                <View style={styles.dropdownMenu}>
                                    {serviceTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[
                                                styles.dropdownOption,
                                                serviceType === type.id && styles.dropdownOptionActive
                                            ]}
                                            onPress={() => selectServiceType(type.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={type.icon as any}
                                                size={18}
                                                color={serviceType === type.id ? "#3b82f6" : "#64748b"}
                                            />
                                            <Text style={[
                                                styles.dropdownOptionText,
                                                serviceType === type.id && styles.dropdownOptionTextActive
                                            ]}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Service Report Number */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('statistics.serviceReport.detailScreen.uploadTab.serviceReportNumber')}</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="document-text" size={18} color="#64748b" />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('statistics.serviceReport.detailScreen.uploadTab.enterServiceReportNumberPlaceholder')}
                                    value={serviceReportNumber}
                                    onChangeText={setServiceReportNumber}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                        </View>

                        {/* File Upload */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('statistics.serviceReport.detailScreen.uploadTab.uploadFile')}</Text>

                            {!uploadedFile ? (
                                <TouchableOpacity
                                    style={styles.uploadArea}
                                    onPress={handleFileSelect}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.uploadIconContainer}>
                                        <Ionicons name="cloud-upload-outline" size={40} color="#3b82f6" />
                                    </View>
                                    <Text style={styles.uploadTitle}>{t('statistics.serviceReport.detailScreen.uploadTab.chooseFile')}</Text>
                                    <Text style={styles.uploadSubtitle}>
                                        {t('statistics.serviceReport.detailScreen.uploadTab.dragDropHint')}
                                    </Text>
                                    <Text style={styles.uploadHint}>
                                        {t('statistics.serviceReport.detailScreen.uploadTab.fileFormatsHint')}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={tabCommonStyles.fileContainer}>
                                    <View style={tabCommonStyles.fileIconContainer}>
                                        <Ionicons name="document" size={20} color="#3b82f6" />
                                    </View>
                                    <View style={tabCommonStyles.fileInfo}>
                                        <Text style={tabCommonStyles.fileName}>{uploadedFile.name}</Text>
                                        <Text style={tabCommonStyles.fileSize}>{uploadedFile.size}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={tabCommonStyles.removeFileButton}
                                        onPress={handleRemoveFile}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[tabCommonStyles.actionButton, tabCommonStyles.secondaryButton, { flex: 1 }]}
                            onPress={handleClearAll}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="refresh" size={18} color="#3b82f6" />
                            <Text style={[tabCommonStyles.actionButtonText, tabCommonStyles.secondaryButtonText]}>
                                {t('statistics.serviceReport.detailScreen.uploadTab.clearAll')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[tabCommonStyles.actionButton, { flex: 1 }]}
                            onPress={handleFileUpload}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="cloud-upload" size={18} color="#ffffff" />
                            <Text style={tabCommonStyles.actionButtonText}>{t('statistics.serviceReport.detailScreen.uploadTab.upload')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Card */}
                <View style={[tabCommonStyles.card, styles.infoCard]}>
                    <View style={styles.infoHeader}>
                        <Ionicons name="information-circle" size={20} color="#3b82f6" />
                        <Text style={styles.infoTitle}>{t('statistics.serviceReport.detailScreen.uploadTab.uploadGuidelines')}</Text>
                    </View>
                    <View style={styles.infoList}>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>{t('statistics.serviceReport.detailScreen.uploadTab.acceptedFormats')}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>{t('statistics.serviceReport.detailScreen.uploadTab.maxFileSize')}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>{t('statistics.serviceReport.detailScreen.uploadTab.ensureDatesCorrect')}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>{t('statistics.serviceReport.detailScreen.uploadTab.selectAppropriateServiceType')}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Alert Modal */}
            <Alert
                isVisible={alert.visible}
                onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                buttonText="OK"
            />
        </>
    );
};

const styles = StyleSheet.create({
    uploadCard: {
        padding: 20,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateTimeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 8,
    },
    timeButton: {
        flex: 0.8,
        marginRight: 0,
    },
    dateTimeIcon: {
        marginRight: 8,
    },
    dateTimeText: {
        color: '#1e293b',
        fontSize: 14,
        fontWeight: '500',
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginLeft: 12,
    },
    formDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 24,
        lineHeight: 20,
    },
    formSection: {
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#0f172a',
        marginLeft: 10,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dropdownText: {
        fontSize: 14,
        color: '#0f172a',
        marginLeft: 10,
        fontWeight: '500',
    },
    dropdownPlaceholder: {
        color: '#94a3b8',
    },
    dropdownMenu: {
        marginTop: 8,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
    },
    dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    dropdownOptionActive: {
        backgroundColor: '#eff6ff',
    },
    dropdownOptionText: {
        fontSize: 14,
        color: '#0f172a',
        marginLeft: 10,
        fontWeight: '500',
    },
    dropdownOptionTextActive: {
        color: '#3b82f6',
        fontWeight: '600',
    },
    uploadArea: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    uploadIconContainer: {
        marginBottom: 12,
    },
    uploadTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 6,
    },
    uploadSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 8,
        textAlign: 'center',
    },
    uploadHint: {
        fontSize: 12,
        color: '#94a3b8',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    infoCard: {
        marginTop: 16,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
        marginLeft: 8,
    },
    infoList: {
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 13,
        color: '#64748b',
        marginLeft: 10,
        flex: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 8,
    },
    errorText: {
        fontSize: 13,
        color: '#dc2626',
        marginLeft: 8,
        flex: 1,
    },
});

export default UploadTab;