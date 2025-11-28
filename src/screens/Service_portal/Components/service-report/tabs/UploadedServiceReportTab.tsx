import Alert from '@/components/Modals/DownloadSuccessAlert';
import { serviceReportController } from '@/controllers/serviceReportController';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import tabCommonStyles from './tabsComman.styles';

interface UploadedReport {
    id: string;
    serviceReportNumber: string;
    deliveryDate: string;
    creationDate: string;
    serviceType: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
    fileType: string;
    xrgiID: string;
    uploadedAt: string;
    customerID: string;
    status: string;
    updatedAt: string;
}

interface UploadedServiceReportTabProps {
    systemData: any;
    navigation: any;
    loading?: boolean;
}

const UploadedServiceReportTab: React.FC<UploadedServiceReportTabProps> = ({ systemData, loading }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedReport, setExpandedReport] = useState<string | null>(null);
    const [uploadedReports, setUploadedReports] = useState<any[]>([]);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState<UploadedReport | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
    const [downloadPath, setDownloadPath] = useState('');
    const [errorAlert, setErrorAlert] = useState({ visible: false, message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const fetchUploadedReports = async () => {
        setIsLoading(true);
        try {
            const response = await serviceReportController.GetUploadedServiceReport(systemData.xrgiID);

            if (Array.isArray(response)) {
                setUploadedReports(response);
            } else if (response && Array.isArray(response.data)) {
                setUploadedReports(response.data);
            } else if (response && response.success && response.data) {
                setUploadedReports(Array.isArray(response.data) ? response.data : [response.data]);
            } else {
                setUploadedReports([]);
            }
        } catch (error) {
            console.error('Failed to fetch uploaded reports:', error);
            setUploadedReports([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUploadedReports();
    }, [systemData.xrgiID]);

    const filteredReports = uploadedReports.filter(report => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        return (
            (report.serviceReportNumber?.toLowerCase().includes(query)) ||
            (report.xrgiID?.toLowerCase().includes(query)) ||
            (report.creationDate?.toLowerCase().includes(query)) ||
            (report.deliveryDate?.toLowerCase().includes(query)) ||
            (report.fileName?.toLowerCase().includes(query))
        );
    });

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

    const handleDownload = async (report: UploadedReport) => {
        try {
            setDownloading(true);
            
            const downloadDest = Platform.select({
                ios: `${RNFS.DocumentDirectoryPath}/${report.fileName}`,
                android: `${RNFS.DownloadDirectoryPath}/${report.fileName}`
            }) || '';

            const downloadOptions = {
                fromUrl: report.fileUrl.split('?')[0],
                toFile: downloadDest,
                background: true,
                discretionary: true,
                progress: (res: any) => {
                    const progress = (res.bytesWritten / res.contentLength) * 100;
                }
            };

            const result = await RNFS.downloadFile(downloadOptions).promise;

            if (result.statusCode === 200) {
                setDownloadPath(downloadDest);
                setShowDownloadSuccess(true);
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Download error:', error);
            setErrorAlert({
                visible: true,
                message: 'Failed to download the file. Please try again later.'
            });
        } finally {
            setDownloading(false);
        }
    };

    const handleView = (report: UploadedReport) => {
        const processedReport = {
            ...report,
            fileUrl: report.fileUrl ? report.fileUrl.split('?')[0] : ''
        };
        setSelectedReport(processedReport);
        setViewModalVisible(true);
    };

    if(isLoading) {
        return (
            <View style={tabCommonStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={tabCommonStyles.loadingText}>Loading service reports...</Text>
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
                {filteredReports.length === 0 ? (
                    <View style={tabCommonStyles.emptyContainer}>
                        <View style={tabCommonStyles.emptyIcon}>
                            <Ionicons name="cloud-upload-outline" size={40} color="#94a3b8" />
                        </View>
                        <Text style={tabCommonStyles.emptyTitle}>
                            {searchQuery ? 'No matching reports found' : 'No Uploaded Reports'}
                        </Text>
                        <Text style={tabCommonStyles.emptyDescription}>
                            {searchQuery
                                ? 'Try a different search term'
                                : 'There are no uploaded service reports for this system yet.'
                            }
                        </Text>
                    </View>
                ) : (
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
                                        {report.serviceReportNumber}
                                    </Text>
                                    <Text style={tabCommonStyles.cardSubtitle}>
                                        {report.xrgiID}
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
                                    <Text style={tabCommonStyles.fileName} numberOfLines={1} ellipsizeMode="tail">
                                        {report.fileName}
                                    </Text>
                                    <Text style={tabCommonStyles.fileSize}>
                                        {(report.fileSize / 1024).toFixed(2)} KB
                                    </Text>
                                </View>
                            </View>

                            {/* Info Rows */}
                            <View style={{ marginTop: 12 }}>
                                <View style={tabCommonStyles.infoRow}>
                                    <Text style={tabCommonStyles.infoLabel}>Date of delivery</Text>
                                    <Text style={tabCommonStyles.infoValue}>
                                        {new Date(report.deliveryDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={[tabCommonStyles.infoRow, tabCommonStyles.infoRowLast]}>
                                    <Text style={tabCommonStyles.infoLabel}>Creation date</Text>
                                    <Text style={tabCommonStyles.infoValue}>
                                        {new Date(report.creationDate).toLocaleDateString()}
                                    </Text>
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
                                            activeOpacity={0.7}
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
                                            disabled={downloading}
                                            activeOpacity={0.7}
                                        >
                                            {downloading ? (
                                                <ActivityIndicator size="small" color="#3b82f6" />
                                            ) : (
                                                <>
                                                    <Ionicons name="download" size={18} color="#3b82f6" />
                                                    <Text style={[
                                                        tabCommonStyles.actionButtonText,
                                                        tabCommonStyles.secondaryButtonText
                                                    ]}>
                                                        Download
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Document Viewer Modal */}
            <Modal
                visible={viewModalVisible}
                animationType="slide"
                onRequestClose={() => setViewModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.modalTitle}>
                                {selectedReport?.fileName}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {selectedReport?.serviceReportNumber}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setViewModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#1e293b" />
                        </TouchableOpacity>
                    </View>

                    {/* Document Viewer */}
                    {selectedReport && selectedReport.fileUrl ? (
                        <>
                            {selectedReport.fileType === 'application/pdf' ? (
                                <Pdf
                                    source={{ uri: selectedReport.fileUrl.trim(), cache: true }}
                                    style={styles.pdf}
                                    onLoadComplete={(numberOfPages) => {
                                        console.log(`PDF loaded with ${numberOfPages} pages`);
                                    }}
                                    onError={(error) => {
                                        console.error('PDF error:', error);
                                    }}
                                    trustAllCerts={false}
                                    enablePaging={true}
                                />
                            ) : (
                                <WebView
                                    source={{ uri: selectedReport.fileUrl.trim() }}
                                    style={styles.webView}
                                    startInLoadingState={true}
                                    renderLoading={() => (
                                        <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="large" color="#3b82f6" />
                                            <Text style={styles.loadingText}>Loading document...</Text>
                                        </View>
                                    )}
                                    onError={(syntheticEvent) => {
                                        const { nativeEvent } = syntheticEvent;
                                        console.error('WebView error:', nativeEvent);
                                        setErrorAlert({
                                            visible: true,
                                            message: 'Failed to load the document. The file might be corrupted or in an unsupported format.'
                                        });
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.errorText}>No document available</Text>
                        </View>
                    )}
                </SafeAreaView>
            </Modal>

            <Alert
                isVisible={showDownloadSuccess}
                onClose={() => setShowDownloadSuccess(false)}
                type="success"
                title="Download Complete!"
                message={`File has been saved to ${Platform.OS === 'ios' ? 'Documents' : 'Downloads'} folder`}
                buttonText="OK"
            />
            
            <Alert
                isVisible={errorAlert.visible}
                onClose={() => setErrorAlert({ ...errorAlert, visible: false })}
                type="error"
                title="Error"
                message={errorAlert.message}
                buttonText="OK"
            />
            </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#64748b',
    },
    closeButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: '#f8fafc',
    },
    webView: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748b',
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
    },
});

export default UploadedServiceReportTab;