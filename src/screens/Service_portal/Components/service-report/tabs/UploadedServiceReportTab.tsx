import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tabCommonStyles from './tabsComman.styles';

interface UploadedReport {
    id: string;
    reportNumber: string;
    dateOfDelivery: string;
    creationDate: string;
    serviceType: string;
    fileName: string;
    fileSize: string;
}

interface UploadedServiceReportTabProps {
    systemData: any;
    navigation: any;
}

const UploadedServiceReportTab: React.FC<UploadedServiceReportTabProps> = ({ systemData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedReport, setExpandedReport] = useState<string | null>(null);

    const uploadedReports: UploadedReport[] = [
        {
            id: '1',
            reportNumber: 'SR-29865972',
            dateOfDelivery: '2025-09-23 12:13',
            creationDate: '2025-09-23 12:13',
            serviceType: 'repair',
            fileName: 'service_report_29865972.pdf',
            fileSize: '2.4 MB'
        },
        {
            id: '2',
            reportNumber: 'SR-83190940',
            dateOfDelivery: '2025-09-23 12:13',
            creationDate: '2025-08-23 12:13',
            serviceType: 'maintenance',
            fileName: 'maintenance_report_83190940.pdf',
            fileSize: '1.8 MB'
        },
        {
            id: '3',
            reportNumber: 'SR-79125299',
            dateOfDelivery: '2025-09-23 12:13',
            creationDate: '2025-08-05 10:31',
            serviceType: 'maintenance',
            fileName: 'report_79125299.pdf',
            fileSize: '3.2 MB'
        }
    ];

    const filteredReports = uploadedReports.filter(report =>
        report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getServiceTypeBadgeStyle = (type: string) => {
        switch (type) {
            case 'repair':
                return [tabCommonStyles.badge, tabCommonStyles.repairBadge];
            case 'maintenance':
                return [tabCommonStyles.badge, tabCommonStyles.maintenanceBadge];
            default:
                return [tabCommonStyles.badge, tabCommonStyles.activeBadge];
        }
    };

    const getServiceTypeBadgeTextStyle = (type: string) => {
        switch (type) {
            case 'repair':
                return [tabCommonStyles.badgeText, tabCommonStyles.repairBadgeText];
            case 'maintenance':
                return [tabCommonStyles.badgeText, tabCommonStyles.maintenanceBadgeText];
            default:
                return [tabCommonStyles.badgeText, tabCommonStyles.activeBadgeText];
        }
    };

    const toggleExpand = (reportId: string) => {
        setExpandedReport(expandedReport === reportId ? null : reportId);
    };

    const handleDownload = (report: UploadedReport) => {
        console.log('Download file:', report.fileName);
    };

    const handleView = (report: UploadedReport) => {
        console.log('View file:', report.fileName);
    };

    return (
        <SafeAreaView style={tabCommonStyles.tabContainer}>
            <ScrollView 
                style={tabCommonStyles.tabContainer}
                contentContainerStyle={tabCommonStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar */}
                <View style={tabCommonStyles.searchContainer}>
                    <Ionicons name="search" size={20} color="#64748b" style={tabCommonStyles.searchIcon} />
                    <TextInput
                        style={tabCommonStyles.searchInput}
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {/* Uploaded Reports List */}
                {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                        <TouchableOpacity
                            key={report.id}
                            style={tabCommonStyles.card}
                            onPress={() => toggleExpand(report.id)}
                            activeOpacity={0.7}
                        >
                            {/* Card Header */}
                            <View style={tabCommonStyles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={tabCommonStyles.cardTitle}>
                                        {report.reportNumber}
                                    </Text>
                                    <Text style={tabCommonStyles.cardSubtitle}>
                                        {systemData.xrgiId}
                                    </Text>
                                </View>
                                <View style={getServiceTypeBadgeStyle(report.serviceType)}>
                                    <Text style={getServiceTypeBadgeTextStyle(report.serviceType)}>
                                        {report.serviceType}
                                    </Text>
                                </View>
                            </View>

                            {/* File Info */}
                            <View style={tabCommonStyles.fileContainer}>
                                <View style={tabCommonStyles.fileIconContainer}>
                                    <Ionicons name="document" size={20} color="#3b82f6" />
                                </View>
                                <View style={tabCommonStyles.fileInfo}>
                                    <Text style={tabCommonStyles.fileName}>{report.fileName}</Text>
                                    <Text style={tabCommonStyles.fileSize}>{report.fileSize}</Text>
                                </View>
                            </View>

                            {/* Info Rows */}
                            <View style={{ marginTop: 12 }}>
                                <View style={tabCommonStyles.infoRow}>
                                    <Text style={tabCommonStyles.infoLabel}>Date of delivery</Text>
                                    <Text style={tabCommonStyles.infoValue}>{report.dateOfDelivery}</Text>
                                </View>
                                <View style={[tabCommonStyles.infoRow, tabCommonStyles.infoRowLast]}>
                                    <Text style={tabCommonStyles.infoLabel}>Creation date</Text>
                                    <Text style={tabCommonStyles.infoValue}>{report.creationDate}</Text>
                                </View>
                            </View>

                            {/* Expanded Content */}
                            {expandedReport === report.id && (
                                <View style={tabCommonStyles.accordionContent}>
                                    <View style={tabCommonStyles.divider} />
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <TouchableOpacity 
                                            style={[tabCommonStyles.actionButton, { flex: 1 }]}
                                            onPress={() => handleView(report)}
                                        >
                                            <Ionicons name="eye" size={18} color="#ffffff" />
                                            <Text style={tabCommonStyles.actionButtonText}>View</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[
                                                tabCommonStyles.actionButton, 
                                                tabCommonStyles.secondaryButton,
                                                { flex: 1 }
                                            ]}
                                            onPress={() => handleDownload(report)}
                                        >
                                            <Ionicons name="download" size={18} color="#3b82f6" />
                                            <Text style={[
                                                tabCommonStyles.actionButtonText,
                                                tabCommonStyles.secondaryButtonText
                                            ]}>
                                                Download
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={tabCommonStyles.emptyContainer}>
                        <View style={tabCommonStyles.emptyIcon}>
                            <Ionicons name="cloud-upload-outline" size={40} color="#94a3b8" />
                        </View>
                        <Text style={tabCommonStyles.emptyTitle}>No Uploaded Reports</Text>
                        <Text style={tabCommonStyles.emptyDescription}>
                            There are no uploaded service reports for this system yet.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadedServiceReportTab;