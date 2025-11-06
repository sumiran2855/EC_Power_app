import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tabCommonStyles from './tabsComman.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ItemUsage {
    id: string;
    xrgiId: string;
    reportNumber: string;
    dateOfDelivery: string;
    creationDate: string;
    partNumber: string;
    itemText: string;
    number: string;
    unit: string;
}

interface ItemUsageTabProps {
    systemData: any;
    navigation: any;
}

const ItemUsageTab: React.FC<ItemUsageTabProps> = ({ systemData }) => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const itemUsages: ItemUsage[] = [
        {
            id: '1',
            xrgiId: '1000010918',
            reportNumber: 'SR-28865972',
            dateOfDelivery: '2025-09-23 12:13',
            creationDate: '2025-09-23 12:13',
            partNumber: '01ELP9A0',
            itemText: 'Impf_ekS_IonsA',
            number: '1',
            unit: 'pcs'
        },
        {
            id: '2',
            xrgiId: '1470167385',
            reportNumber: 'SR-28252422',
            dateOfDelivery: '2025-09-23 12:13',
            creationDate: '2025-09-23 12:13',
            partNumber: '01ELF9A0',
            itemText: 'Impf_ekS_IonsA',
            number: '1',
            unit: 'pcs'
        },
        {
            id: '3',
            xrgiId: '1470167385',
            reportNumber: 'SR-83190940',
            dateOfDelivery: '2025-09-08 12:37',
            creationDate: '2025-08-05 08:31',
            partNumber: '01ELF3008',
            itemText: 'Motherboard gen-5',
            number: '2',
            unit: 'pcs'
        }
    ];

    const toggleExpand = (itemId: string) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);
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

                {/* Item Usage List */}
                {itemUsages.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={tabCommonStyles.card}
                        onPress={() => toggleExpand(item.id)}
                        activeOpacity={0.7}
                    >
                        {/* Card Header */}
                        <View style={tabCommonStyles.cardHeader}>
                            <View style={tabCommonStyles.iconContainer}>
                                <Ionicons name="cube" size={18} color="#3b82f6" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={tabCommonStyles.cardTitle}>
                                    {item.reportNumber}
                                </Text>
                                <Text style={tabCommonStyles.cardSubtitle}>
                                    XRGI® ID: {item.xrgiId}
                                </Text>
                            </View>
                            <Ionicons 
                                name={expandedItem === item.id ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color="#94a3b8" 
                            />
                        </View>

                        {/* Basic Info Grid */}
                        <View style={tabCommonStyles.grid}>
                            <View style={tabCommonStyles.gridItem}>
                                <View style={tabCommonStyles.gridCard}>
                                    <Text style={tabCommonStyles.gridLabel}>Date of delivery</Text>
                                    <Text style={tabCommonStyles.gridValue}>{item.dateOfDelivery}</Text>
                                </View>
                            </View>
                            <View style={tabCommonStyles.gridItem}>
                                <View style={tabCommonStyles.gridCard}>
                                    <Text style={tabCommonStyles.gridLabel}>Creation date</Text>
                                    <Text style={tabCommonStyles.gridValue}>{item.creationDate}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Expanded Content */}
                        {expandedItem === item.id && (
                            <View style={tabCommonStyles.accordionContent}>
                                <View style={tabCommonStyles.divider} />
                                
                                <View style={tabCommonStyles.infoRow}>
                                    <Text style={tabCommonStyles.infoLabel}>Part Number</Text>
                                    <Text style={tabCommonStyles.infoValue}>{item.partNumber}</Text>
                                </View>
                                <View style={tabCommonStyles.infoRow}>
                                    <Text style={tabCommonStyles.infoLabel}>Item Text</Text>
                                    <Text style={tabCommonStyles.infoValue}>{item.itemText}</Text>
                                </View>
                                <View style={tabCommonStyles.infoRow}>
                                    <Text style={tabCommonStyles.infoLabel}>Quantity</Text>
                                    <Text style={tabCommonStyles.infoValue}>{item.number} {item.unit}</Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ItemUsageTab;