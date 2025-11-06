import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import tabCommonStyles from './tabsComman.styles';
import { StyleSheet } from 'react-native';

interface UploadTabProps {
    systemData: any;
    navigation: any;
}

interface UploadedFile {
    name: string;
    size: string;
    type: string;
}

const UploadTab: React.FC<UploadTabProps> = ({ systemData }) => {
    const [creationDate, setCreationDate] = useState<Date>(new Date(2025, 8, 19, 0, 0)); // Sept 19, 2025
    const [deliveryDate, setDeliveryDate] = useState<Date>(new Date(2025, 9, 6, 0, 0)); // Oct 6, 2025
    const [showCreationDatePicker, setShowCreationDatePicker] = useState(false);
    const [showCreationTimePicker, setShowCreationTimePicker] = useState(false);
    const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
    const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false);
    const [serviceType, setServiceType] = useState('');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);

    const serviceTypes = [
        { id: 'repair', label: 'Repair', icon: 'construct' },
        { id: 'maintenance', label: 'Maintenance', icon: 'settings' },
        { id: 'inspection', label: 'Inspection', icon: 'search' },
        { id: 'installation', label: 'Installation', icon: 'hammer' }
    ];

    const handleFileSelect = () => {
        // Simulate file picker
        const mockFile: UploadedFile = {
            name: 'service_document_name.pdf',
            size: '2.4 MB',
            type: 'application/pdf'
        };
        setUploadedFile(mockFile);
        console.log('File picker opened');
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    const handleUpload = () => {
        if (!serviceType || !uploadedFile) {
            console.log('Please fill all required fields');
            return;
        }
        console.log('Uploading:', {
            creationDate,
            deliveryDate,
            serviceType,
            file: uploadedFile
        });
    };

    const formatDateTime = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
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
        setCreationDate(new Date(2025, 8, 19, 0, 0));
        setDeliveryDate(new Date(2025, 9, 6, 0, 0));
        setServiceType('');
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
                            onPress={handleUpload}
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
        marginBottom: 8,
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
});

export default UploadTab;