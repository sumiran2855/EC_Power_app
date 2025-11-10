import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tabCommonStyles from './tabsComman.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Resource {
    id: string;
    serviceType: string;
    creationDate: string;
    workType: string;
    quantity: number;
    unit: string;
}

interface ServiceReport {
    id: string;
    reportNumber: string;
    dateOfDelivery: string;
    creationDate: string;
    serviceType: string;
    description: string;
    resources: Resource[];
}

interface ServiceReportsTabProps {
    systemData: any;
    navigation: any;
}

const ServiceReportsTab: React.FC<ServiceReportsTabProps> = ({ systemData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedReport, setExpandedReport] = useState<string | null>(null);

    const serviceReports: ServiceReport[] = [
        {
            id: '1',
            reportNumber: 'SR-29865972',
            dateOfDelivery: '23-09-2025',
            creationDate: '23-09-2025',
            serviceType: 'repair',
            description: 'Test LVB 23092025',
            resources: [
                {
                    id: '1',
                    serviceType: 'Luna Vendelbo',
                    creationDate: '23-09-2025',
                    workType: 'Working time',
                    quantity: 0.25,
                    unit: 'hrs'
                },
                {
                    id: '2',
                    serviceType: 'Luna Vendelbo',
                    creationDate: '23-09-2025',
                    workType: 'Transport time',
                    quantity: 3,
                    unit: 'hrs'
                },
                {
                    id: '3',
                    serviceType: 'Luna Vendelbo',
                    creationDate: '23-09-2025',
                    workType: 'Driven Distance',
                    quantity: 200,
                    unit: 'km'
                }
            ]
        },
        {
            id: '2',
            reportNumber: 'SR-28252422',
            dateOfDelivery: '11-09-2025',
            creationDate: '23-09-2025',
            serviceType: 'repair',
            description: 'Emergency repair service for system malfunction',
            resources: [
                {
                    id: '1',
                    serviceType: 'John Smith',
                    creationDate: '23-09-2025',
                    workType: 'Working time',
                    quantity: 2.5,
                    unit: 'hrs'
                },
                {
                    id: '2',
                    serviceType: 'John Smith',
                    creationDate: '23-09-2025',
                    workType: 'Transport time',
                    quantity: 1.5,
                    unit: 'hrs'
                }
            ]
        },
        {
            id: '3',
            reportNumber: 'SR-83190940',
            dateOfDelivery: '08-09-2025',
            creationDate: '23-08-2025',
            serviceType: 'maintenance',
            description: 'Scheduled quarterly maintenance check',
            resources: [
                {
                    id: '1',
                    serviceType: 'Mike Johnson',
                    creationDate: '08-09-2025',
                    workType: 'Working time',
                    quantity: 4,
                    unit: 'hrs'
                }
            ]
        },
        {
            id: '4',
            reportNumber: 'SR-79125299',
            dateOfDelivery: '05-08-2025',
            creationDate: '05-08-2025',
            serviceType: 'maintenance',
            description: 'Annual system inspection and maintenance',
            resources: [
                {
                    id: '1',
                    serviceType: 'Sarah Williams',
                    creationDate: '05-08-2025',
                    workType: 'Working time',
                    quantity: 3.5,
                    unit: 'hrs'
                },
                {
                    id: '2',
                    serviceType: 'Sarah Williams',
                    creationDate: '05-08-2025',
                    workType: 'Driven Distance',
                    quantity: 150,
                    unit: 'km'
                }
            ]
        }
    ];

    const filteredReports = serviceReports.filter(report =>
        report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
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

    return (
        <SafeAreaView style={tabCommonStyles.tabContainer}>
            <ScrollView 
                style={tabCommonStyles.tabContainer}
                contentContainerStyle={tabCommonStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Enhanced Search Bar */}
                <View style={tabCommonStyles.searchContainer}>
                    <Ionicons name="search" size={20} color="#3b82f6" style={tabCommonStyles.searchIcon} />
                    <TextInput
                        style={tabCommonStyles.searchInput}
                        placeholder="Search reports..."
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
                {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
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
                                            {report.reportNumber}
                                        </Text>
                                        <Text style={tabCommonStyles.cardSubtitle}>
                                            {systemData.xrgiId}
                                        </Text>
                                    </View>
                                    <View style={getServiceTypeBadgeStyle(report.serviceType)}>
                                        <Text style={getServiceTypeBadgeTextStyle(report.serviceType)}>
                                            {report.serviceType.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {/* Description */}
                                <View style={tabCommonStyles.descriptionContainer}>
                                    <Text style={tabCommonStyles.descriptionLabel}>Description:</Text>
                                    <Text style={tabCommonStyles.descriptionText}>{report.description}</Text>
                                </View>

                                {/* Info Grid */}
                                <View style={tabCommonStyles.infoGrid}>
                                    <View style={tabCommonStyles.infoGridItem}>
                                        <View style={tabCommonStyles.infoIconContainer}>
                                            <Ionicons name="calendar" size={16} color="#3b82f6" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={tabCommonStyles.infoGridLabel}>Date of delivery</Text>
                                            <Text style={tabCommonStyles.infoGridValue}>{report.dateOfDelivery}</Text>
                                        </View>
                                    </View>
                                    <View style={tabCommonStyles.infoGridItem}>
                                        <View style={tabCommonStyles.infoIconContainer}>
                                            <Ionicons name="time" size={16} color="#3b82f6" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={tabCommonStyles.infoGridLabel}>Creation date</Text>
                                            <Text style={tabCommonStyles.infoGridValue}>{report.creationDate}</Text>
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
                                            {expandedReport === report.id ? 'Hide' : 'View'} Resources
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
                                        <Text style={tabCommonStyles.resourcesTitle}>Resources Details</Text>
                                    </View>

                                    {/* Resources Table - Horizontally Scrollable */}
                                    <ScrollView 
                                        horizontal 
                                        showsHorizontalScrollIndicator={true}
                                        style={tabCommonStyles.tableScrollContainer}
                                        contentContainerStyle={tabCommonStyles.tableScrollContent}
                                    >
                                        <View style={tabCommonStyles.tableContainer}>
                                            {/* Table Header */}
                                            <View style={tabCommonStyles.tableHeader}>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 150 }]}>Service Type</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 120 }]}>Creation date</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 130 }]}>Work type</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 80 }]}>Quantity</Text>
                                                <Text style={[tabCommonStyles.tableHeaderText, { width: 60 }]}>Unit</Text>
                                            </View>

                                            {/* Table Rows */}
                                            {report.resources.map((resource, index) => (
                                                <View 
                                                    key={resource.id}
                                                    style={[
                                                        tabCommonStyles.tableRow,
                                                        index % 2 === 0 && tabCommonStyles.tableRowEven
                                                    ]}
                                                >
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 150 }]}>
                                                        {resource.serviceType}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 120 }]}>
                                                        {resource.creationDate}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 130 }]}>
                                                        {resource.workType}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 80, fontWeight: '600' }]}>
                                                        {resource.quantity}
                                                    </Text>
                                                    <Text style={[tabCommonStyles.tableCellText, { width: 60 }]}>
                                                        {resource.unit}
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
                    ))
                ) : (
                    <View style={tabCommonStyles.emptyContainer}>
                        <View style={tabCommonStyles.emptyIcon}>
                            <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
                        </View>
                        <Text style={tabCommonStyles.emptyTitle}>No Reports Found</Text>
                        <Text style={tabCommonStyles.emptyDescription}>
                            {searchQuery ? 'Try adjusting your search criteria' : 'There are no service reports available for this system'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ServiceReportsTab;