import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './system-configurationDetailScreen.styles';
import { Ionicons } from '@expo/vector-icons';

interface SystemConfigurationDetailScreenProps {
    navigation: any;
    route: any;
}

interface ConfigDetail {
    label: string;
    value: string;
}

interface ConfigItem {
    id: string;
    timestamp: string;
    details?: ConfigDetail[];
}

const SystemConfigurationDetailScreen: React.FC<SystemConfigurationDetailScreenProps> = ({ navigation, route }) => {
    const { system } = route.params;
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const configurations: ConfigItem[] = [
        {
            id: '1',
            timestamp: '2024-08-22 09:46:40',
            details: [
                { label: 'Date', value: '2024-08-22 09:46:40' },
                { label: 'Display PCB Serial no.', value: '010.001.0020' },
                { label: 'Software version', value: '010.001.0020' },
                { label: 'HW version', value: '05' },
                { label: 'Supplier', value: 'IiserPeter' },
                { label: 'Size', value: '25.0kW' },
                { label: 'Propellant', value: 'Natural gas' },
                { label: 'PU number', value: '0719000025' },
                { label: 'Technology', value: 'leanBurn' },
                { label: 'Electricity sales', value: '-' },
                { label: 'Sale weekdays', value: '07:00-22:00' },
                { label: 'Sale Saturday', value: '00:00-23:508:30-21:309' },
                { label: 'Sale Sunday', value: '09:00-20:00' },
                { label: 'Storage Fill Period', value: '-' },
                { label: 'Storage Empty Period', value: '-' },
                { label: 'Smartstarter software version', value: '019.017.0001' },
                { label: 'Communication module sw version', value: '-' },
                { label: 'Time notation', value: '12h' },
                { label: 'Type of communication', value: 'Ethernet' },
                { label: 'Heat pump 2 efficiency', value: '0' },
                { label: 'Terminal serial no.', value: 'TRM-20258-XY' },
                { label: 'SIM card no.', value: '89445010000123456T' },
                { label: 'Operator', value: 'Vodafone' },
                { label: 'High load Weekdays', value: '05:00-23:00' },
                { label: 'High load Saturday', value: '06:00-22:00' },
                { label: 'High load Sunday', value: '07:00-21:00' },
                { label: 'Unit notation', value: 'Imperial' },
                { label: 'Heat back up', value: 'Yes' },
                { label: 'Time zone', value: 'CET' },
                { label: 'Time zone offset', value: '1:00' },
                { label: 'Smartstarter HW version', value: '07' },
                { label: 'Date notation', value: 'MMDDYY' }
            ]
        },
        {
            id: '2',
            timestamp: '2024-08-22 09:54:35',
            details: [
                { label: 'Date', value: '2024-08-22 09:54:35' },
                { label: 'Display PCB Serial no.', value: '010.001.0020' },
                { label: 'Software version', value: '010.001.0020' },
                { label: 'HW version', value: '05' },
                { label: 'Supplier', value: 'System Admin' },
                { label: 'Size', value: '25.0kW' },
                { label: 'Configuration Type', value: 'Security Patch' },
                { label: 'Status', value: 'Completed' },
                { label: 'Duration', value: '1m 45s' }
            ]
        },
        {
            id: '3',
            timestamp: '2025-08-22 07:17:52',
            details: [
                { label: 'Date', value: '2025-08-22 07:17:52' },
                { label: 'Configuration Type', value: 'Performance Tuning' },
                { label: 'Status', value: 'In Progress' },
                { label: 'Duration', value: '5m 30s' },
                { label: 'Modified By', value: 'Tech Lead' },
                { label: 'Software version', value: '010.002.0025' }
            ]
        },
        {
            id: '4',
            timestamp: '2025-08-22 07:21:12',
            details: [
                { label: 'Date', value: '2025-08-22 07:21:12' },
                { label: 'Configuration Type', value: 'Database Optimization' },
                { label: 'Status', value: 'Pending' },
                { label: 'Modified By', value: 'Database Admin' },
                { label: 'Priority', value: 'High' }
            ]
        }
    ];

    const handleBackButton = () => {
        navigation.goBack();
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.titleSection}>
                <View style={styles.iconContainer}>
                    <Ionicons name="desktop-outline" size={24} color="#3B82F6" />
                </View>
                <View style={styles.titleContent}>
                    <Text style={styles.title}>System Configuration</Text>
                    <Text style={styles.configId}>{system.xrgiID}</Text>
                    <Text style={styles.description}>
                        The list below contains system configurations, showing the latest first.
                    </Text>
                    <Text style={styles.instruction}>
                        To open a configuration click the grey or white line
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {configurations.map((config) => (
                    <View key={config.id}>
                        <TouchableOpacity
                            style={[
                                styles.configItem,
                                expandedId === config.id && styles.configItemExpanded
                            ]}
                            onPress={() => toggleExpand(config.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.timestamp}>{config.timestamp}</Text>
                            <Ionicons
                                name={expandedId === config.id ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#64748B"
                            />
                        </TouchableOpacity>

                        {expandedId === config.id && config.details && (
                            <View style={styles.detailsContainer}>
                                <Text style={styles.detailsTitle}>Control Panel</Text>

                                {config.details.map((detail, index) => (
                                    <View key={index} style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>{detail.label}:</Text>
                                        <Text style={styles.detailValue}>{detail.value || '-'}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default SystemConfigurationDetailScreen;