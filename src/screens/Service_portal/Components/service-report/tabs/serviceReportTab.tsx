import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tabCommonStyles from './tabsComman.styles';
import { ServiceReport } from './types';

interface ServiceReportsTabProps {
    systemData: ServiceReport[];
    navigation: any;
    loading?: boolean;
}

const ServiceReportsTab: React.FC<ServiceReportsTabProps> = ({ systemData, loading }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedReport, setExpandedReport] = useState<string | null>(null);

    const filteredReports = systemData?.filter((report) =>
        report.Service_Report_Number.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (loading) {
        return (
            <View style={tabCommonStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={tabCommonStyles.loadingText}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.loading')}</Text>
            </View>
        );
    }

    if (!systemData || systemData.length === 0) {
        return (
            <View style={tabCommonStyles.emptyState}>
                <Ionicons name="document-text" size={48} color="#cbd5e1" />
                <Text style={tabCommonStyles.emptyStateText}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.noDataAvailable')}</Text>
                <Text style={tabCommonStyles.emptyStateSubtext}>
                    {t('statistics.serviceReport.detailScreen.serviceReportsTab.noDataSubtext')}
                </Text>
            </View>
        );
    }

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

    return (
            <ScrollView
                style={tabCommonStyles.tabContainer}
                contentContainerStyle={tabCommonStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar */}
                <View style={tabCommonStyles.searchContainer}>
                    <Ionicons name="search" size={20} color="#3b82f6" style={tabCommonStyles.searchIcon} />
                    <TextInput
                        style={tabCommonStyles.searchInput}
                        placeholder={t('statistics.serviceReport.detailScreen.serviceReportsTab.searchPlaceholder')}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94a3b8"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Service Reports List */}
                {filteredReports.map((report) => (
                        <View
                            key={report.id}
                            style={[
                                tabCommonStyles.card,
                                expandedReport === report.id && tabCommonStyles.cardExpanded
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => toggleExpand(report.id)}
                                activeOpacity={0.7}
                            >
                                {/* Card Header */}
                                <View style={tabCommonStyles.cardHeader}>
                                    <View style={tabCommonStyles.reportIconContainer}>
                                        <Ionicons name="document-text" size={22} color="#3b82f6" />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={tabCommonStyles.cardTitle}>
                                            {report.Service_Report_Number}
                                        </Text>
                                        <Text style={tabCommonStyles.cardSubtitle}>
                                            {report.xrgiID}
                                        </Text>
                                    </View>
                                    <View style={getServiceTypeBadgeStyle(report.creatingDate.serviceType || '')}>
                                        <Text style={getServiceTypeBadgeTextStyle(report.creatingDate.serviceType || '')}>
                                            {report.creatingDate.serviceType?.toUpperCase() || 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Description */}
                                <View style={tabCommonStyles.descriptionContainer}>
                                    <Text style={tabCommonStyles.descriptionLabel}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.descriptionLabel')}:</Text>
                                    <Text style={tabCommonStyles.descriptionText}>
                                    {report.creatingDate.serviceDescription || t('statistics.serviceReport.detailScreen.serviceReportsTab.noDescriptionAvailable')}
                                </Text>
                            </View>

                                {/* Info Grid */}
                                <View style={tabCommonStyles.infoGrid}>
                                    <View style={tabCommonStyles.infoGridItem}>
                                        <View style={tabCommonStyles.infoIconContainer}>
                                            <Ionicons name="calendar" size={16} color="#3b82f6" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={tabCommonStyles.infoGridLabel}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.deliveryDate')}</Text>
                                            <Text style={tabCommonStyles.infoGridValue}>
                                            {report.creatingDate.deliveryDate}
                                        </Text>
                                        </View>
                                    </View>
                                    <View style={tabCommonStyles.infoGridItem}>
                                        <View style={tabCommonStyles.infoIconContainer}>
                                            <Ionicons name="time" size={16} color="#3b82f6" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={tabCommonStyles.infoGridLabel}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.creationDate')}</Text>
                                            <Text style={tabCommonStyles.infoGridValue}>
                                            {report.creatingDate.creationDate}
                                        </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Expand Indicator */}
                                <View style={tabCommonStyles.expandIndicator}>
                                    <View style={tabCommonStyles.expandLine} />
                                    <View style={tabCommonStyles.expandButton}>
                                        <Ionicons
                                            name={expandedReport === report.id ? "chevron-up" : "chevron-down"}
                                            size={18}
                                            color="#3b82f6"
                                        />
                                        <Text style={tabCommonStyles.expandText}>
                                            {expandedReport === report.id ? t('statistics.serviceReport.detailScreen.serviceReportsTab.hideResources') : t('statistics.serviceReport.detailScreen.serviceReportsTab.viewResources')}
                                        </Text>
                                    </View>
                                    <View style={tabCommonStyles.expandLine} />
                                </View>
                            </TouchableOpacity>

                            {/* Expanded Content - Resources */}
                            {expandedReport === report.id && (
                                <View style={tabCommonStyles.expandedContent}>
                                    <View style={tabCommonStyles.resourcesHeader}>
                                        <Ionicons name="list" size={18} color="#0f172a" />
                                        <Text style={tabCommonStyles.resourcesTitle}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.resourcesDetails')}</Text>
                                    </View>

                                    {/* Resources Table */}
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={true}
                                        style={tabCommonStyles.tableScrollContainer}
                                        contentContainerStyle={tabCommonStyles.tableScrollContent}
                                    >
                                        <View style={tabCommonStyles.tableContainer}>
                                            {/* Table Header */}
                                            <View style={tabCommonStyles.tableHeader}>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 150 }]}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.workType')}</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 120 }]}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.date')}</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 130 }]}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.technician')}</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 100 }]}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.quantity')}</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 80 }]}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.unit')}</Text>
                                            </View>

                                            {/* Table Rows */}
                                            {report.resources.map((resource, index) => (
                                                <View
                                                    key={`${report.id}-resource-${index}`}
                                                    style={[
                                                        tabCommonStyles.tableRow,
                                                        index % 2 === 0 && tabCommonStyles.tableRowEven
                                                    ]}
                                                >
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 150 }]}>
                                                        {resource.workType}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 120 }]}>
                                                        {resource.deliveryCreationDate}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 130 }]}>
                                                        {resource.serviceTechnician}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 100 }]}>
                                                        {resource.resourceQuantity}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 80 }]}>
                                                        {resource.unit}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>
                                    
                                    {/* Scroll Hint */}
                                    <View style={tabCommonStyles.scrollHint}>
                                        <Ionicons name="swap-horizontal" size={14} color="#94a3b8" />
                                        <Text style={tabCommonStyles.scrollHintText}>{t('statistics.serviceReport.detailScreen.serviceReportsTab.scrollHint')}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                ))}
            </ScrollView>
    );
};

export default ServiceReportsTab;