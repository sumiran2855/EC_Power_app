import useSystemConfiguration from '@/hooks/Service-portal/useSystemConfiguration';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './system-configurationDetailScreen.styles';

interface SystemConfigurationDetailScreenProps {
    navigation: any;
    route: any;
}

const SystemConfigurationDetailScreen: React.FC<SystemConfigurationDetailScreenProps> = ({ navigation, route }) => {
    const { system } = route.params;
    const {
        isLoading,
        hasData,
        expandedId,
        toggleExpand,
        fetchSystemConfiguration,
        handleBackButton,
        configurations
    } = useSystemConfiguration(navigation);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (system?.xrgiID) {
                try {
                    await fetchSystemConfiguration(system.xrgiID);
                } catch (error) {
                    console.log('Failed to load configuration:', error);
                }
            }
            if (isMounted) {
                setIsInitialLoad(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [system?.xrgiID]);



    const renderContent = () => {
        if (isInitialLoad) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Loading configuration data...</Text>
                </View>
            );
        }

        if (!isLoading && (!hasData || configurations.length === 0)) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="information-circle-outline" size={48} color="#64748B" />
                    <Text style={styles.emptyText}>No configuration data available</Text>
                </View>
            );
        }

        return (
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

                        {expandedId === config.id && (
                            <View style={styles.detailsContainer}>
                                <Text style={styles.detailsTitle}>
                                    {config.timestamp === 'Latest Configuration'
                                        ? 'Current System Configuration'
                                        : 'Configuration Details'}
                                </Text>
                                {config.details.map((detail, index) => (
                                    <View key={`${config.id}-${index}`} style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>{detail.label}:</Text>
                                        <Text
                                            style={styles.detailValue}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {detail.value}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        );
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

            {renderContent()}
        </SafeAreaView>
    );
}

export default SystemConfigurationDetailScreen;