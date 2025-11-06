import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import styles from './DetailsScreen.styles';
import { XRGIDetailsScreenProps, energyRecords } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const DetailScreen: React.FC<XRGIDetailsScreenProps> = ({ route, navigation }) => {
    const { item } = route.params;
    const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());

    const handleBackPress = () => {
        navigation.goBack();
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#1a365d" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>XRGi® System Details</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* System Info Card */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{item.name || 'N/A'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Serial Number</Text>
                        <Text style={styles.value}>{item.serialNumber || 'N/A'}</Text>
                    </View>
                </View>

                {/* Model Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Model XRGi® {item.model || '15 LOWNOX'}</Text>
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
                        <Text style={styles.sectionTitle}>Basic Data</Text>
                        <TouchableOpacity style={styles.editButton}>
                            <MaterialIcons name="edit" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dataGrid}>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Annual Savings</Text>
                            <Text style={styles.dataValue}>20000</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Annual CO₂ savings</Text>
                            <Text style={styles.dataValue}>1230</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Operating hours per year</Text>
                            <Text style={styles.dataValue}>1200 hrs</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Industry</Text>
                            <Text style={styles.dataValue}>School</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Contact</Text>
                            <Text style={[styles.dataValue, styles.email]}>martin@yopmail.com</Text>
                        </View>
                    </View>
                </View>

                {/* Energy Check Plus Details */}
                <View style={styles.card}>
                    <View style={styles.energyHeader}>
                        <View style={styles.energyTitleContainer}>
                            <Ionicons name="information-circle-outline" size={24} color="#1a365d" />
                            <Text style={styles.sectionTitle}>Energy Check Plus Details</Text>
                        </View>
                        <TouchableOpacity style={styles.createButton}>
                            <Text style={styles.createButtonText}>Create Energy Report</Text>
                        </TouchableOpacity>
                    </View>

                    {energyRecords.map((monthRecord) => (
                        <View key={monthRecord.id} style={styles.recordCard}>
                            <TouchableOpacity
                                style={styles.recordHeader}
                                onPress={() => toggleRecord(monthRecord.id)}
                            >
                                <View style={styles.recordHeaderLeft}>
                                    <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                                    <Text style={styles.recordMonth}>
                                        {monthRecord.month} {monthRecord.year}
                                    </Text>
                                    <View style={styles.recordBadge}>
                                        <Text style={styles.recordBadgeText}>
                                            {monthRecord.records.length} {monthRecord.records.length === 1 ? 'Record' : 'Records'}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons
                                    name={expandedRecords.has(monthRecord.id) ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#64748b"
                                />
                            </TouchableOpacity>

                            {expandedRecords.has(monthRecord.id) && monthRecord.records.map((record, index) => (
                                <View key={record.id} style={[
                                    styles.recordContent,
                                    index !== monthRecord.records.length - 1 && { marginBottom: 16 }
                                ]}>
                                    <View style={styles.recordIdRow}>
                                        <Text style={styles.recordIdLabel}>Date:</Text>
                                        <Text style={styles.recordIdValue}>{record.date}</Text>
                                        <View style={styles.ecpBadge}>
                                            <Text style={styles.ecpText}>ECP: {record.ecp}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.recordDetailsGrid}>
                                        <View style={styles.recordDetailRow}>
                                            <Text style={styles.recordDetailLabel}>Annual Savings:</Text>
                                            <Text style={styles.recordDetailValue}>{record.annualSavings}</Text>
                                        </View>
                                        <View style={styles.recordDetailRow}>
                                            <Text style={styles.recordDetailLabel}>Runtime Hours:</Text>
                                            <Text style={styles.recordDetailValue}>{record.runtimeHours}</Text>
                                        </View>
                                        <View style={styles.recordDetailRow}>
                                            <Text style={styles.recordDetailLabel}>Service Provider:</Text>
                                            <Text style={styles.recordDetailValue}>{record.serviceProvider}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={styles.downloadButton}>
                                        <MaterialIcons name="file-download" size={20} color="#3b82f6" />
                                        <Text style={styles.downloadButtonText}>Download PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default DetailScreen;