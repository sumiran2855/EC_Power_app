import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviceReportController } from '@/controllers/serviceReportController';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
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

    const serviceTypes = [
        { id: 'repair', label: 'Repair', icon: 'construct' },
        { id: 'maintenance', label: 'Maintenance', icon: 'settings' },
        { id: 'inspection', label: 'Inspection', icon: 'search' },
        { id: 'installation', label: 'Installation', icon: 'hammer' }
    ];

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setUploadError('');
    };

    const handleFileSelect = async () => {
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
                    setUploadError('Invalid file type. Only PDF, JPEG, and PNG files are allowed.');
                    return;
                }

                if (asset.size && asset.size > 10 * 1024 * 1024) {
                    setUploadError('File size exceeds 10MB limit.');
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
            console.error('Error picking file:', error);
            setUploadError('Failed to select file. Please try again.');
        }
    };

    const handleFileUpload = async () => {
        if (!uploadedFile) {
            setUploadError('Please select a file to upload');
            return;
        }

        if (!uploadedFile.size || uploadedFile.size === 0) {
            setUploadError('Selected file is empty.');
            return;
        }

        if (!systemData?.xrgiID || !customerID) {
            setUploadError('System data is missing. Please try again.');
            return;
        }

        if (!serviceType) {
            setUploadError('Please select a service type.');
            return;
        }

        if (!serviceReportNumber) {
            setUploadError('Please enter a service report number.');
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

            handleClearAll();

        } catch (error) {
            console.error("Upload error:", error);
            setUploadError(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
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
        return selected ? selected.label : 'Select Service Type';
    };

    if (isUploading) {
        return (
            <View style={tabCommonStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={tabCommonStyles.loadingText}>Loading service reports...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={tabCommonStyles.tabContainer}>
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
                        <Text style={styles.formTitle}>Upload Service Report</Text>
                    </View>

                    <Text style={styles.formDescription}>
                        Fill in the details and upload your service report document.
                    </Text>

                    {/* Form Fields */}
                    <View style={styles.formSection}>
                        {/* Creation Date */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Creation date</Text>
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
                            <Text style={styles.inputLabel}>Date of delivery *</Text>
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
                            <Text style={styles.inputLabel}>Service Type *</Text>
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
                            <Text style={styles.inputLabel}>Service Report Number *</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="document-text" size={18} color="#64748b" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter service report number"
                                    value={serviceReportNumber}
                                    onChangeText={setServiceReportNumber}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                        </View>

                        {/* File Upload */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Upload file (PDF, JPEG, PNG only)</Text>

                            {!uploadedFile ? (
                                <TouchableOpacity
                                    style={styles.uploadArea}
                                    onPress={handleFileSelect}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.uploadIconContainer}>
                                        <Ionicons name="cloud-upload-outline" size={40} color="#3b82f6" />
                                    </View>
                                    <Text style={styles.uploadTitle}>Choose file</Text>
                                    <Text style={styles.uploadSubtitle}>
                                        Drag & Drop file here or click to browse
                                    </Text>
                                    <Text style={styles.uploadHint}>
                                        PDF, JPEG, PNG only
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

                    {/* Error Message */}
                    {uploadError ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color="#ef4444" />
                            <Text style={styles.errorText}>{uploadError}</Text>
                        </View>
                    ) : null}

                    {/* Action Buttons */}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[tabCommonStyles.actionButton, tabCommonStyles.secondaryButton, { flex: 1 }]}
                            onPress={handleClearAll}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="refresh" size={18} color="#3b82f6" />
                            <Text style={[tabCommonStyles.actionButtonText, tabCommonStyles.secondaryButtonText]}>
                                Clear all
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[tabCommonStyles.actionButton, { flex: 1 }]}
                            onPress={handleFileUpload}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="cloud-upload" size={18} color="#ffffff" />
                            <Text style={tabCommonStyles.actionButtonText}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Card */}
                <View style={[tabCommonStyles.card, styles.infoCard]}>
                    <View style={styles.infoHeader}>
                        <Ionicons name="information-circle" size={20} color="#3b82f6" />
                        <Text style={styles.infoTitle}>Upload Guidelines</Text>
                    </View>
                    <View style={styles.infoList}>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>Accepted formats: PDF, JPEG, PNG</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>Maximum file size: 10 MB</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>Ensure dates are in correct format</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.infoText}>Select appropriate service type</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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