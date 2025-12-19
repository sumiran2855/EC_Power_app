import DownloadSuccessAlert from '@/components/Modals/Alert';
import EnergyCheckReportModal from '@/components/Modals/EnergyCheckReportModal';
import { RegisterController } from '@/controllers/RegisterController';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupedEnergyRecords, XRGIDetailsScreenProps } from '../types';
import styles from './DetailsScreen.styles';

const DetailScreen: React.FC<XRGIDetailsScreenProps> = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { item } = route.params;
    const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
    const [groupedRecords, setGroupedRecords] = useState<GroupedEnergyRecords[]>([]);
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
    const [showReportSuccess, setShowReportSuccess] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [previousMonth, setPreviousMonth] = useState('');
    const [generatingReport, setGeneratingReport] = useState(false);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const getPreviousMonth = () => {
        const now = new Date();
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return `${monthNames[previousMonth.getMonth()]} ${previousMonth.getFullYear()}`;
    };

    const handleCreateReportPress = () => {
        setPreviousMonth(getPreviousMonth());
        setShowReportModal(true);
    };

    const handleGenerateReport = async (selectedMonth: string) => {
        // Get the latest record's createdAt date for month adjustment
        if (groupedRecords.length > 0 && groupedRecords[0].latestRecord) {
            const createdAt = new Date(groupedRecords[0].latestRecord.createdAt);
            // Always display the month before the createdAt month
            // Example: if createdAt is 25-11-2025, then show October
            const adjustedDate = new Date(createdAt.getFullYear(), createdAt.getMonth() - 1, 1);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            const adjustedMonth = `${monthNames[adjustedDate.getMonth()]} ${adjustedDate.getFullYear()}`;

            console.log('Selected month:', selectedMonth);
            console.log('Latest record createdAt:', createdAt.toLocaleDateString());
            console.log('Display month (one month before createdAt):', adjustedMonth);

            try {
                setGeneratingReport(true);

                // Create the payload with month and XRGI ID
                const payload = {
                    month: monthNames[adjustedDate.getMonth()],
                    xrgiID: item.xrgiID
                };

                console.log('Creating EnergyCheckPlus report with payload:', payload);

                const response = await RegisterController.CreateEnergyCheckPlus(payload);

                if (response?.success) {
                    console.log('EnergyCheckPlus report created successfully');

                    // Refresh the data to fetch the latest reports
                    await getEnergyCheckPlusDetails();

                    // Show success message
                    setShowReportSuccess(true);
                } else {
                    console.log('Failed to create EnergyCheckPlus report:', response);
                }
            } catch (error) {
                console.log('Error creating EnergyCheckPlus report:', error);
            } finally {
                setGeneratingReport(false);
            }
        } else {
            console.log('No records available for report generation');
        }
    };

    const toggleRecord = (id: string) => {
        const newExpanded = new Set(expandedRecords);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRecords(newExpanded);
    };

    const handleEditPress = () => {
        navigation.navigate('Register', {
            editMode: true,
            facilityData: item
        });
    };

    const getEnergyCheckPlusDetails = async () => {
        try {
            setLoading(true);
            const response = await RegisterController.GetEnergyCheckPlusDetails(item.xrgiID);
            if (response?.success && response?.data) {
                groupRecordsByMonth(response.data);
            } else {
                setGroupedRecords([]);
            }
        } catch (error) {
            console.log("Error getting energy check plus details", error);
            setGroupedRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const groupRecordsByMonth = (data: any[]) => {
        const monthGroups: { [key: string]: any[] } = {};

        data.forEach(record => {
            const date = new Date(record.createdAt);
            // Always display 1 month previous from createdAt month
            const displayDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            const monthYear = `${displayDate.getFullYear()}-${displayDate.getMonth()}`;

            if (!monthGroups[monthYear]) {
                monthGroups[monthYear] = [];
            }
            monthGroups[monthYear].push(record);
        });

        const grouped: GroupedEnergyRecords[] = Object.keys(monthGroups).map(key => {
            const records = monthGroups[key];
            const latestRecord = records.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );

            // Use the adjusted display date (1 month before createdAt)
            const displayDate = new Date(latestRecord.createdAt);
            displayDate.setMonth(displayDate.getMonth() - 1);

            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

            return {
                month: monthNames[displayDate.getMonth()],
                year: displayDate.getFullYear().toString(),
                latestRecord
            };
        }).sort((a, b) => {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            const dateA = new Date(parseInt(a.year), monthNames.indexOf(a.month), 1);
            const dateB = new Date(parseInt(b.year), monthNames.indexOf(b.month), 1);
            return dateB.getTime() - dateA.getTime();
        });

        setGroupedRecords(grouped);
    };

    const handleDownload = async (url: string, fileName: string) => {
        try {
            setDownloading(true);

            const downloadDest = Platform.select({
                ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
                android: `${RNFS.DownloadDirectoryPath}/${fileName}`
            }) || '';

            const downloadOptions = {
                fromUrl: url.split('?')[0],
                toFile: downloadDest,
                background: true,
                discretionary: true,
                progress: (res: any) => {
                    const progress = (res.bytesWritten / res.contentLength) * 100;
                }
            };

            const result = await RNFS.downloadFile(downloadOptions).promise;

            if (result.statusCode === 200) {
                setShowDownloadSuccess(true);
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.log('Download error:', error);
            setShowDownloadSuccess(true);
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        getEnergyCheckPlusDetails();
    }, []);

    if (loading || generatingReport || downloading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a5490" />
                <Text style={styles.loadingText}>
                    {generatingReport ? t('detailScreen.loading.generatingReport') : downloading ? t('detailScreen.loading.downloading') : t('detailScreen.loading.loading')}
                </Text>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#1a365d" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('detailScreen.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* System Info Card */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>{t('detailScreen.systemInfo.name')}</Text>
                        <Text style={styles.value}>{item.name || 'N/A'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>{t('detailScreen.systemInfo.serialNumber')}</Text>
                        <Text style={styles.value}>{item.xrgiID || 'N/A'}</Text>
                    </View>
                </View>

                {/* Model Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{t('detailScreen.systemInfo.modelLabel')} - {item.modelNumber || 'N/A'}</Text>
                    <View style={styles.imageContainer}>
                        <View style={styles.imagePlaceholder}>
                            <Image
                                source={require('../../../../../assets/card-detail.png')}
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>

                {/* Basic Data Section */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('detailScreen.systemInfo.basicData')}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
                            <MaterialIcons name="edit" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dataGrid}>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>{t('detailScreen.data.expectedSavings')}</Text>
                            <Text style={styles.dataValue}>
                                {groupedRecords.length > 0 && groupedRecords[0].latestRecord
                                    ? `€ ${groupedRecords[0].latestRecord.annualSavings}`
                                    : '-'}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>{t('detailScreen.data.annualCo2Savings')}</Text>
                            <Text style={styles.dataValue}>{item.EnergyCheck_plus?.co2Savings || '-'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>{t('detailScreen.data.operatingHours')}</Text>
                            <Text style={styles.dataValue}>{item.EnergyCheck_plus?.operatingHours || '-'} hrs</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>{t('detailScreen.data.industry')}</Text>
                            <Text style={styles.dataValue}>{item.EnergyCheck_plus?.industry || '-'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>{t('detailScreen.data.contact')}</Text>
                            <View style={styles.emailContainer}>
                                {item.EnergyCheck_plus?.email ? (
                                    item.EnergyCheck_plus?.email.split(',').map((email: string, index: number) => (
                                        <Text key={index} style={[styles.dataValue, styles.email]}>
                                            {email.trim()}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={[styles.dataValue, styles.email]}>N/A</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Energy Check Plus Details */}
                <View style={styles.card}>
                    <View style={styles.energyHeader}>
                        <View style={styles.energyTitleContainer}>
                            <Ionicons name="information-circle-outline" size={24} color="#1a365d" />
                            <Text style={styles.sectionTitle}>{t('detailScreen.energyCheckPlus.title')}</Text>
                        </View>
                        <TouchableOpacity style={styles.createButton} onPress={handleCreateReportPress}>
                            <Text style={styles.createButtonText}>{t('detailScreen.energyCheckPlus.createReport')}</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#3b82f6" />
                            <Text style={styles.loadingText}>{t('detailScreen.loading.loadingReports')}</Text>
                        </View>
                    ) : groupedRecords.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
                            <Text style={styles.noDataTitle}>{t('detailScreen.energyCheckPlus.noReports.title')}</Text>
                            <Text style={styles.noDataMessage}>
                                {t('detailScreen.energyCheckPlus.noReports.message')}
                            </Text>
                        </View>
                    ) : (
                        groupedRecords.map((monthRecord) => (
                            <View key={`${monthRecord.month}-${monthRecord.year}`} style={styles.recordCard}>
                                <TouchableOpacity
                                    style={styles.recordHeader}
                                    onPress={() => toggleRecord(`${monthRecord.month}-${monthRecord.year}`)}
                                >
                                    <View style={styles.recordHeaderLeft}>
                                        <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                                        <Text style={styles.recordMonth}>
                                            {monthRecord.month} {monthRecord.year}
                                        </Text>
                                        <View style={styles.recordBadge}>
                                            <Text style={styles.recordBadgeText}>
                                                {t('detailScreen.energyCheckPlus.record.badge')}
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name={expandedRecords.has(`${monthRecord.month}-${monthRecord.year}`) ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#64748b"
                                    />
                                </TouchableOpacity>

                                {expandedRecords.has(`${monthRecord.month}-${monthRecord.year}`) && (
                                    <View style={styles.recordContent}>
                                        <View style={styles.recordIdRow}>
                                            <Text style={styles.recordIdLabel}>{t('detailScreen.energyCheckPlus.record.date')}</Text>
                                            <Text style={styles.recordIdValue}>
                                                {new Date(monthRecord.latestRecord.createdAt).toLocaleDateString('en-GB')}
                                            </Text>
                                        </View>

                                        <View style={styles.recordDetailsGrid}>
                                            <View style={styles.recordDetailRow}>
                                                <Text style={styles.recordDetailLabel}>{t('detailScreen.energyCheckPlus.record.expectedSavings')}</Text>
                                                <Text style={styles.recordDetailValue}>€ {monthRecord.latestRecord.annualSavings}</Text>
                                            </View>
                                            <View style={styles.recordDetailRow}>
                                                <Text style={styles.recordDetailLabel}>{t('detailScreen.energyCheckPlus.record.runtimeHours')}</Text>
                                                <Text style={styles.recordDetailValue}>{monthRecord.latestRecord.runtimeHours} hrs</Text>
                                            </View>
                                            <View style={styles.recordDetailRow}>
                                                <Text style={styles.recordDetailLabel}>{t('detailScreen.energyCheckPlus.record.monthlySavings')}</Text>
                                                <Text style={styles.recordDetailValue}>€ {monthRecord.latestRecord.energy_check_plus_saving}</Text>
                                            </View>
                                            <View style={styles.recordDetailRow}>
                                                <Text style={styles.recordDetailLabel}>{t('detailScreen.energyCheckPlus.record.serviceProvider')}</Text>
                                                <Text style={styles.recordDetailValue}>
                                                    {monthRecord.latestRecord.serviceProvider?.name || '-'}
                                                </Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.downloadButton}
                                            onPress={() => handleDownload(monthRecord.latestRecord.url, `${monthRecord.latestRecord.XRGI_ID}_${monthRecord.month}_${monthRecord.year}.pdf`)}
                                            disabled={downloading}
                                        >
                                            <MaterialIcons name="file-download" size={20} color="#3b82f6" />
                                            <Text style={styles.downloadButtonText}>
                                                {downloading ? t('detailScreen.energyCheckPlus.download.downloading') : t('detailScreen.energyCheckPlus.download.downloadPdf')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            <DownloadSuccessAlert
                isVisible={showDownloadSuccess}
                onClose={() => setShowDownloadSuccess(false)}
                type="success"
                title={t('detailScreen.alerts.downloadComplete.title')}
                message={t('detailScreen.alerts.downloadComplete.message', { folder: Platform.OS === 'ios' ? 'Documents' : 'Downloads' })}
                buttonText={t('detailScreen.alerts.downloadComplete.buttonText')}
            />

            <DownloadSuccessAlert
                isVisible={showReportSuccess}
                onClose={() => setShowReportSuccess(false)}
                type="success"
                title={t('detailScreen.alerts.reportGenerated.title')}
                message={t('detailScreen.alerts.reportGenerated.message')}
                buttonText={t('detailScreen.alerts.reportGenerated.buttonText')}
            />

            <EnergyCheckReportModal
                isVisible={showReportModal}
                onClose={() => setShowReportModal(false)}
                onGenerateReport={handleGenerateReport}
                previousMonth={previousMonth}
                isGenerating={generatingReport}
            />
        </SafeAreaView>
    );
};

export default DetailScreen;