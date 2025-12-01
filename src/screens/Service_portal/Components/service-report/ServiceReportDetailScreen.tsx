import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from './ServiceReportDetailScreen.styles';
import ServiceReportsTab from './tabs/serviceReportTab';
import ItemUsageTab from './tabs/ItemUsageTab';
import UploadedServiceReportTab from './tabs/UploadedServiceReportTab';
import UploadTab from './tabs/uploadTab';
import { serviceReportController } from '@/controllers/serviceReportController';

interface ServiceReportDetailScreenProps {
    navigation: any;
    route: any;
}

type TabType = 'service_reports' | 'item_usage' | 'uploaded_reports' | 'upload';

const ServiceReportDetailScreen: React.FC<ServiceReportDetailScreenProps> = ({ navigation, route }) => {
    const systemData = route?.params?.system;
    const [activeTab, setActiveTab] = useState<TabType>('service_reports');
    const [serviceReport, setServiceReport] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleBackButton = () => {
        navigation.goBack();
    };

    const getServiceReport = async () => {
        setIsLoading(true);
        try {
            const response = await serviceReportController.GetServiceReport(systemData.xrgiID);
            setServiceReport(response);
        } catch (error) {
            console.log("Error getting service report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getServiceReport();
    }, []);

    const tabs = [
        { id: 'service_reports', label: 'Service Reports', icon: 'document-text' },
        { id: 'item_usage', label: 'Item Usage', icon: 'list' },
        { id: 'uploaded_reports', label: 'Uploaded Reports', icon: 'cloud-done' },
        { id: 'upload', label: 'Upload', icon: 'cloud-upload-outline' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'service_reports':
                return <ServiceReportsTab systemData={serviceReport} navigation={navigation} loading={isLoading}/>;
            case 'item_usage':
                return <ItemUsageTab systemData={serviceReport} navigation={navigation} loading={isLoading} />;
            case 'uploaded_reports':
                return <UploadedServiceReportTab systemData={systemData} navigation={navigation} loading={isLoading} />;
            case 'upload':
                return <UploadTab systemData={systemData} navigation={navigation} loading={isLoading} customerID={serviceReport[0].customerID}/>;
            default:
                return <ServiceReportsTab systemData={systemData} navigation={navigation} loading={isLoading} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Modern Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{systemData.name}</Text>
                    <View style={styles.headerBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.headerSubtitle}>ID: {systemData.xrgiID}</Text>
                    </View>
                </View>
            </View>

            {/* Enhanced Tab Navigation */}
            <View style={styles.tabContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabScrollContent}
                >
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.tab,
                                activeTab === tab.id && styles.activeTab
                            ]}
                            onPress={() => setActiveTab(tab.id as TabType)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.tabIconContainer,
                                activeTab === tab.id && styles.activeTabIconContainer
                            ]}>
                                <Ionicons
                                    name={tab.icon as any}
                                    size={20}
                                    color={activeTab === tab.id ? '#ffffff' : '#64748b'}
                                />
                            </View>
                            <Text style={[
                                styles.tabText,
                                activeTab === tab.id && styles.activeTabText
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Tab Content */}
            <View style={styles.contentContainer}>
                {renderTabContent()}
            </View>
        </SafeAreaView>
    );
};

export default ServiceReportDetailScreen;