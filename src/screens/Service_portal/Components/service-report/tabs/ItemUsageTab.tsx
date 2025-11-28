import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tabCommonStyles from './tabsComman.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ItemUsageTabProps {
    systemData: any;
    navigation: any;
    loading?: boolean;
}

const ItemUsageTab: React.FC<ItemUsageTabProps> = ({ systemData, loading }) => {
    const [expandedReport, setExpandedReport] = useState<string | null>(null);

    const toggleExpand = (reportId: string) => {
        setExpandedReport(expandedReport === reportId ? null : reportId);
    };

    if (loading) {
        return (
            <View style={tabCommonStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={tabCommonStyles.loadingText}>Loading item usages...</Text>
            </View>
        );
    }

    if (!systemData || systemData.length === 0) {
        return (
            <View style={tabCommonStyles.emptyState}>
                <Ionicons name="cube-outline" size={48} color="#cbd5e1" />
                <Text style={tabCommonStyles.emptyStateText}>No item usages available</Text>
                <Text style={tabCommonStyles.emptyStateSubtext}>
                    There are no item usages to display at the moment.
                </Text>
            </View>
        );
    };

    const handleSendReport = () => {
        console.log('Send report via email');
    };

    return (
        <SafeAreaView style={tabCommonStyles.tabContainer}>
            <ScrollView
                style={tabCommonStyles.tabContainer}
                contentContainerStyle={tabCommonStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Action Button */}
                <TouchableOpacity
                    style={tabCommonStyles.actionButton}
                    onPress={handleSendReport}
                    activeOpacity={0.8}
                >
                    <Ionicons name="mail" size={18} color="#ffffff" />
                    <Text style={tabCommonStyles.actionButtonText}>Send report on email</Text>
                </TouchableOpacity>

                <Text style={tabCommonStyles.sectionHeader}>Item Usage Records</Text>

                {systemData.map((report: any) => (
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
                                    <Ionicons name="cube-outline" size={22} color="#3b82f6" />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={tabCommonStyles.cardTitle}>
                                        {report.Service_Report_Number}
                                    </Text>
                                    <Text style={tabCommonStyles.cardSubtitle}>
                                        {report.xrgiID}
                                    </Text>
                                </View>
                                <View style={tabCommonStyles.badge}>
                                </View>
                            </View>

                            {/* Info Grid */}
                            <View style={tabCommonStyles.infoGrid}>
                                <View style={tabCommonStyles.infoGridItem}>
                                    <View style={tabCommonStyles.infoIconContainer}>
                                        <Ionicons name="calendar" size={16} color="#3b82f6" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={tabCommonStyles.infoGridLabel}>Creation Date</Text>
                                        <Text style={tabCommonStyles.infoGridValue}>
                                            {report.creatingDate?.creationDate || 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={tabCommonStyles.infoGridItem}>
                                    <View style={tabCommonStyles.infoIconContainer}>
                                        <Ionicons name="cube" size={16} color="#3b82f6" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={tabCommonStyles.infoGridLabel}>Delivery Date</Text>
                                        <Text style={tabCommonStyles.infoGridValue}>
                                            {report.creatingDate?.deliveryDate || 'N/A'}
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
                                        {expandedReport === report.id ? 'Hide' : 'View'} Items
                                    </Text>
                                </View>
                                <View style={tabCommonStyles.expandLine} />
                            </View>
                        </TouchableOpacity>

                        {/* Expanded Content - Item Usages */}
                        {expandedReport === report.id && report.itemUsages?.length > 0 && (
                            <View style={tabCommonStyles.expandedContent}>
                                <View style={tabCommonStyles.resourcesHeader}>
                                    <Ionicons name="list" size={18} color="#0f172a" />
                                    <Text style={tabCommonStyles.resourcesTitle}>Item Usages</Text>
                                </View>

                                {/* Item Usages Table */}
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={true}
                                    style={tabCommonStyles.tableScrollContainer}
                                    contentContainerStyle={tabCommonStyles.tableScrollContent}
                                >
                                    <View style={tabCommonStyles.tableContainer}>
                                        {/* Table Header */}
                                        <View style={tabCommonStyles.tableHeader}>
                                            <Text style={[tabCommonStyles.tableHeaderText, { width: 200 }]}>Description</Text>
                                            <Text style={[tabCommonStyles.tableHeaderText, { width: 120 }]}>Part Number</Text>
                                            <Text style={[tabCommonStyles.tableHeaderText, { width: 100 }]}>Serial Number</Text>
                                            <Text style={[tabCommonStyles.tableHeaderText, { width: 80 }]}>Quantity</Text>
                                            <Text style={[tabCommonStyles.tableHeaderText, { width: 60 }]}>Unit</Text>
                                        </View>

                                        {/* Table Rows */}
                                        {report.itemUsages.map((item: any, index: any) => (
                                            <View
                                                key={`${report.id}-item-${index}`}
                                                style={[
                                                    tabCommonStyles.tableRow,
                                                    index % 2 === 0 && tabCommonStyles.tableRowEven
                                                ]}
                                            >
                                                <Text style={[tabCommonStyles.tableCellText, { width: 200 }]}>
                                                    {item.description}
                                                </Text>
                                                <Text style={[tabCommonStyles.tableCellText, { width: 120 }]}>
                                                    {item.partNumber}
                                                </Text>
                                                <Text style={[tabCommonStyles.tableCellText, { width: 100 }]}>
                                                    {item.serialNumber}
                                                </Text>
                                                <Text style={[tabCommonStyles.tableCellText, { width: 80 }]}>
                                                    {item.quantity}
                                                </Text>
                                                <Text style={[tabCommonStyles.tableCellText, { width: 60 }]}>
                                                    {item.unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>

                                {/* Scroll Hint */}
                                <View style={tabCommonStyles.scrollHint}>
                                    <Ionicons name="swap-horizontal" size={14} color="#94a3b8" />
                                    <Text style={tabCommonStyles.scrollHintText}>Scroll horizontally to view all columns</Text>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ItemUsageTab;