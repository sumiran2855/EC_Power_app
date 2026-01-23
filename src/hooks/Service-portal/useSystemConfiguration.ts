import { RegisterController } from '@/controllers/RegisterController';
import { SystemController } from '@/controllers/SystemController';
import { Facility, UserData } from '@/screens/authScreens/types';
import { ConfigItem } from '@/screens/Service_portal/Components/types';
import StorageService from '@/utils/secureStorage';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SystemConfiguration {
    id: string;
    timestamp: string;
    isExpanded: boolean;
    details: {
        label: string;
        value: string;
    }[];
}

interface UseSystemConfigurationReturn {
    systems: Facility[];
    configurations: ConfigItem[];
    setIsLoading: (loading: boolean) => void;
    setHasData: (hasData: boolean) => void;
    isLoading: boolean;
    isError: boolean;
    hasData: boolean;
    isPartialLoading: boolean;
    expandedId: string | null;
    handleBackButton: () => void;
    handleSystemPress: (system: Facility) => void;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    toggleExpand: (id: string) => void;
    fetchSystemConfiguration: (id: string) => Promise<void>;
}

const useSystemConfiguration = (navigation: any): UseSystemConfigurationReturn => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [isPartialLoading, setIsPartialLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [systems, setSystems] = useState<Facility[]>([]);
    const [hasData, setHasData] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [configurations, setConfigurations] = useState<ConfigItem[]>([]);


    const formatTimeRange = (timeRange: any): string => {
        if (!timeRange) return "-";

        if (typeof timeRange === 'object' && timeRange !== null) {
            try {
                const start = timeRange.start || '';
                const end = timeRange.end || '';

                if (typeof start === 'string' && start.includes(':')) {
                    return `${start}-${end}`;
                }

                if (start && end) {
                    const formatTime = (dateString: string) => {
                        try {
                            const date = new Date(dateString);
                            return date.toISOString().substring(11, 16);
                        } catch (e) {
                            return '';
                        }
                    };
                    return `${formatTime(start)}-${formatTime(end)}`;
                }
                return "-";
            } catch (e) {
                console.log("Error formatting time range object:", e);
                return "-";
            }
        }

        if (typeof timeRange === 'string') {
            if (timeRange === "-") return "-";

            try {
                const parts = timeRange.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)-(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);
                if (!parts) return timeRange;

                const startFull = parts[1];
                const endFull = parts[2];
                const extractTime = (timestamp: string) => {
                    const timePart = timestamp.split('T')[1];
                    return timePart.substring(0, 5);
                };

                return `${extractTime(startFull)}-${extractTime(endFull)}`;
            } catch (error) {
                console.log("Error formatting time range string:", error);
                return "-";
            }
        }

        return "-";
    };

    const formatPowerValue = (power?: { power: number | string; unit: string }): string => {
        if (!power || power.power === undefined || power.unit === undefined) return '-';
        return `${power.power} ${power.unit}`;
    };

    const mapFuelSelector = (val?: string): string => {
        if (!val) return '-';
        const v = val.toLowerCase();
        switch (v) {
            case 'h': return 'Hydrogen';
            case 'lpg': return 'LPG';
            case 'll': return 'LNG';
            default: return val;
        }
    };

    const handleBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSystemPress = useCallback((system: Facility) => {
        navigation.navigate('SystemConfigurationDetail', { system });
    }, [navigation]);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'Active':
                return '#10b981';
            case 'Inactive':
                return '#ef4444';
            case 'Data Missing':
                return '#f59e0b';
            default:
                return '#64748b';
        }
    }, []);

    const getStatusText = useCallback((status: string) => {
                return status.charAt(0).toUpperCase() + status.slice(1);
    }, []);

    const getFacilityList = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        const userData = await StorageService.user.getData<UserData>();
        if (!userData) {
            return null;
        }
        try {
            const response = await RegisterController.GetFacilityList(userData?.id);
            const transformedData: Facility[] = response?.success ? response.data?.map((facility: any) => ({
                id: facility.id,
                name: facility.name,
                status: facility.status,
                xrgiID: facility.xrgiID,
                hasServiceContract: facility.hasServiceContract,
                modelNumber: facility.modelNumber,
                location: {
                    country: facility.location?.country,
                },
            })) : [];
            setSystems(transformedData);
            return null;
        } catch (error) {
            console.log('Error fetching facility statistics:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getFacilityList();
    }, []);

    const transformConfigurationData = (data: any): { configurations: ConfigItem[], hasData: boolean } => {
        if (!data) return { configurations: [], hasData: false };

        const latestPlantConfig = data?.raw?.plantConfigurationData?.[0]?.configuration;
        const latestConfigTimestamp = data?.raw?.plantConfigurationData?.[0]?.timestamp;
        const rawLogs = data?.raw?.plantServiceLogData;
        const logs: any[] = Array.isArray(rawLogs?.[0]) ? rawLogs[0] : (rawLogs || []);

        const items: ConfigItem[] = [];

        if (latestPlantConfig) {
            const latestDate = latestConfigTimestamp
                ? new Date(latestConfigTimestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
                : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            items.push(createConfigItem(latestPlantConfig, latestDate, '0'));
        }

        logs.forEach((entry, index) => {
            if (entry?.eventType === 'plantConfiguration') {
                const timestamp = entry['date#time'] || entry.date || new Date().toISOString();
                const displayDate = (timestamp + '').replace(/#/g, ' ');

                items.push({
                    id: entry.id || `log-${index}`,
                    timestamp: displayDate,
                    isExpanded: false,
                    details: createConfigDetails(latestPlantConfig, displayDate)
                });
            }
        });

        return {
            configurations: items,
            hasData: !!(latestPlantConfig && items.length > 0)
        };
    };

    const createConfigItem = (config: any, timestamp: string, idSuffix: string): SystemConfiguration => {
        return {
            id: `config-${idSuffix}`,
            timestamp,
            isExpanded: idSuffix === '0',
            details: createConfigDetails(config, timestamp)
        };
    };

    const createConfigDetails = (config: any, timestamp: string): any[] => {
        if (!config) return [];

        return [
            { label: t('statistics.systemConfiguration.detailScreen.labels.date'), value: timestamp },
            { label: t('statistics.systemConfiguration.detailScreen.labels.softwareVersion'), value: config.ecuSwVersion || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.hardwareVersion'), value: config.centralControlHwVersion || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.supplier'), value: config.motorType?.supplier || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.size'), value: config.size || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.technology'), value: config.motorType?.technology || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.allowSale'), value: config.allowSale || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.catalystType'), value: config.catalystType || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.emptyStoragePeriod'), value: formatTimeRange(config.emptyStoragePeriod) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.fillStoragePeriod'), value: formatTimeRange(config.fillStoragePeriod) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.saleWeekdays'), value: formatTimeRange(config.salePeriodWeekday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.saleSaturday'), value: formatTimeRange(config.salePeriodSaturday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.saleSunday'), value: formatTimeRange(config.salePeriodSunday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.storageFillPeriod'), value: formatTimeRange(config.storageFillPeriod) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.storageEmptyPeriod'), value: formatTimeRange(config.storageEmptyPeriod) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.hrtmEnabled'), value: config.hrtmEnabled || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.smartStarterSwVersion'), value: config.smartStarterSwVersion || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.timeNotation'), value: config.timeNotation || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.smartStarterSerialNumber'), value: config.smartStarterSerialNumber || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.unitNotation'), value: config.unitNotation || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.systemMode'), value: config.systemMode || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.apn'), value: config.apn || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.timeZone'), value: config.timeZoneString || '-' },
            {
                label: t('statistics.systemConfiguration.detailScreen.labels.timeZoneOffset'),
                value: typeof config.timeZoneOffset === 'object'
                    ? `${config.timeZoneOffset.hours}:${String(config.timeZoneOffset.minutes).padStart(2, '0')}`
                    : config.timeZoneOffset || '-'
            },
            { label: t('statistics.systemConfiguration.detailScreen.labels.smartStarterHwVersion'), value: config.smartStarterHwVersion || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.dateNotation'), value: config.dateNotation || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.highTariffSaturday'), value: formatTimeRange(config.highTariffSaturday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.highTariffSunday'), value: formatTimeRange(config.highTariffSunday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.highTariffWeekday'), value: formatTimeRange(config.highTariffWeekday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.highLoadMaxPower'), value: formatPowerValue(config.highLoadMaxPower) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.communicationType'), value: config.communicationType || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.heatPumpEfficiency'), value: config.numberOfHeatPumpControl?.toString() || '0' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.terminalSerialNo'), value: config.terminalSerialNumber || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.simCardNo'), value: config.simCardNumber || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.operator'), value: config.gsmOperator || '-' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.highLoadWeekdays'), value: formatTimeRange(config.highLoadWeekday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.highLoadSaturday'), value: formatTimeRange(config.highLoadSaturday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.highLoadSunday'), value: formatTimeRange(config.highLoadSunday) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.lowLoadMaxPower'), value: formatPowerValue(config.lowLoadMaxPower) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.powerUnitEfficiencyLimit'), value: formatPowerValue(config.powerUnitMaxPower) },
            { label: t('statistics.systemConfiguration.detailScreen.labels.heatBackup'), value: config.heatBackupAvailable === 'false' ? 'No' : 'Yes' },
            { label: t('statistics.systemConfiguration.detailScreen.labels.fuelSelector'), value: mapFuelSelector(config.fuelSelector) },

        ].filter(item => item.value !== undefined);
    };

    const fetchSystemConfiguration = useCallback(async (id: string) => {
        setIsLoading(true);
        setIsPartialLoading(false);
        setIsError(false);
        setHasData(false);
        setConfigurations([]);

        try {
            const userData = await StorageService.user.getData<UserData>();
            if (!userData) {
                throw new Error('User not authenticated');
            }

            const response = await SystemController.getSystemConfiguration(id);

            if (response) {
                const latestPlantConfig = response?.raw?.plantConfigurationData?.[0]?.configuration;
                const latestConfigTimestamp = response?.raw?.plantConfigurationData?.[0]?.timestamp;

                const initialItems: ConfigItem[] = [];

                if (latestPlantConfig) {
                    const latestDate = latestConfigTimestamp
                        ? new Date(latestConfigTimestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
                        : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

                    const latestConfigItem: SystemConfiguration = {
                        id: `config-0`,
                        timestamp: latestDate,
                        isExpanded: true,
                        details: createConfigDetails(latestPlantConfig, latestDate)
                    };

                    initialItems.push(latestConfigItem);
                    
                    // Display initial data immediately
                    setConfigurations(initialItems);
                    setHasData(true);
                    setExpandedId(latestConfigItem.id);
                    setIsLoading(false);
                    setIsPartialLoading(true);

                    // Now process and display logs progressively
                    const rawLogs = response?.raw?.plantServiceLogData;
                    const logs: any[] = Array.isArray(rawLogs?.[0]) ? rawLogs[0] : (rawLogs || []);

                    // Process logs in batches to display progressively
                    let processedItems = [...initialItems];
                    let logIndex = 0;

                    const processBatch = () => {
                        const batchSize = 5; 
                        const endIndex = Math.min(logIndex + batchSize, logs.length);

                        for (let i = logIndex; i < endIndex; i++) {
                            const entry = logs[i];
                            if (entry?.eventType === 'plantConfiguration') {
                                const timestamp = entry['date#time'] || entry.date || new Date().toISOString();
                                const displayDate = (timestamp + '').replace(/#/g, ' ');

                                const newConfigItem: SystemConfiguration = {
                                    id: entry.id || `log-${i}`,
                                    timestamp: displayDate,
                                    isExpanded: false,
                                    details: createConfigDetails(latestPlantConfig, displayDate)
                                };

                                processedItems.push(newConfigItem);
                            }
                        }

                        if (processedItems.length > initialItems.length) {
                            setConfigurations([...processedItems]);
                        }

                        logIndex = endIndex;

                        if (logIndex < logs.length) {
                            setTimeout(processBatch, 50);
                        } else {
                            setIsPartialLoading(false);
                        }
                    };

                    if (logs.length > 0) {
                        setTimeout(processBatch, 100);
                    } else {
                        setIsPartialLoading(false);
                    }
                } else {
                    const { configurations: transformedData, hasData: dataAvailable } = transformConfigurationData(response);
                    setConfigurations(transformedData);
                    setHasData(dataAvailable && transformedData.length > 0);

                    if (transformedData.length > 0) {
                        setExpandedId(transformedData[0].id);
                    }
                    setIsLoading(false);
                }
            } else {
                setConfigurations([]);
                setHasData(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Error fetching system configuration:', error);
            setIsError(true);
            setConfigurations([]);
            setHasData(false);
            setIsLoading(false);
            setIsPartialLoading(false);
        }
    }, []);

    const toggleExpand = useCallback((id: string) => {
        setExpandedId(expandedId === id ? null : id);
    }, [expandedId]);

    return {
        systems,
        configurations,
        setIsLoading,
        setHasData,
        isLoading,
        isError,
        hasData,
        isPartialLoading,
        expandedId,
        handleBackButton,
        handleSystemPress,
        getStatusColor,
        getStatusText,
        toggleExpand,
        fetchSystemConfiguration
    };
};

export default useSystemConfiguration;
