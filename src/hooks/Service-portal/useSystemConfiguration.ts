import { RegisterController } from '@/controllers/RegisterController';
import { SystemController } from '@/controllers/SystemController';
import { Facility, UserData } from '@/screens/authScreens/types';
import { ConfigItem } from '@/screens/Service_portal/Components/types';
import StorageService from '@/utils/secureStorage';
import { useCallback, useEffect, useState } from 'react';

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
    expandedId: string | null;
    handleBackButton: () => void;
    handleSystemPress: (system: Facility) => void;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    toggleExpand: (id: string) => void;
    fetchSystemConfiguration: (id: string) => Promise<void>;
}

const useSystemConfiguration = (navigation: any): UseSystemConfigurationReturn => {
    const [isLoading, setIsLoading] = useState(true);
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
            { label: 'Date', value: timestamp },
            { label: 'Software Version', value: config.ecuSwVersion || '-' },
            { label: 'Hardware Version', value: config.centralControlHwVersion || '-' },
            { label: 'Supplier', value: config.motorType?.supplier || '-' },
            { label: 'Size', value: config.size || '-' },
            { label: 'Technology', value: config.motorType?.technology || '-' },
            { label: 'Allow Sale', value: config.allowSale || '-' },
            { label: 'Catalyst Type', value: config.catalystType || '-' },
            { label: 'Empty Storage Period', value: formatTimeRange(config.emptyStoragePeriod) },
            { label: 'Fill Storage Period', value: formatTimeRange(config.fillStoragePeriod) },
            { label: 'Sale Weekdays', value: formatTimeRange(config.salePeriodWeekday) },
            { label: 'Sale Saturday', value: formatTimeRange(config.salePeriodSaturday) },
            { label: 'Sale Sunday', value: formatTimeRange(config.salePeriodSunday) },
            { label: 'Storage Fill Period', value: formatTimeRange(config.storageFillPeriod) },
            { label: 'Storage Empty Period', value: formatTimeRange(config.storageEmptyPeriod) },
            { label: 'HRTM Enabled', value: config.hrtmEnabled || '-' },
            { label: 'Smart Starter SW Version', value: config.smartStarterSwVersion || '-' },
            { label: 'Time Notation', value: config.timeNotation || '-' },
            { label: 'Smart Starter Serial Number', value: config.smartStarterSerialNumber || '-' },
            { label: 'Unit Notation', value: config.unitNotation || '-' },
            { label: 'System Mode', value: config.systemMode || '-' },
            { label: 'APN', value: config.apn || '-' },
            { label: 'Time Zone', value: config.timeZoneString || '-' },
            {
                label: 'Time Zone Offset',
                value: typeof config.timeZoneOffset === 'object'
                    ? `${config.timeZoneOffset.hours}:${String(config.timeZoneOffset.minutes).padStart(2, '0')}`
                    : config.timeZoneOffset || '-'
            },
            { label: 'Smart Starter HW Version', value: config.smartStarterHwVersion || '-' },
            { label: 'Date Notation', value: config.dateNotation || '-' },
            { label: 'High Tariff Saturday', value: formatTimeRange(config.highTariffSaturday) },
            { label: 'High Tariff Sunday', value: formatTimeRange(config.highTariffSunday) },
            { label: 'High Tariff Weekday', value: formatTimeRange(config.highTariffWeekday) },
            { label: 'High Load Max Power', value: formatPowerValue(config.highLoadMaxPower) },
            { label: 'Communication Type', value: config.communicationType || '-' },
            { label: 'Heat Pump 1 Efficiency', value: config.numberOfHeatPumpControl?.toString() || '0' },
            { label: 'Terminal Serial No.', value: config.terminalSerialNumber || '-' },
            { label: 'SIM Card No.', value: config.simCardNumber || '-' },
            { label: 'Operator', value: config.gsmOperator || '-' },
            { label: 'High Load Weekdays', value: formatTimeRange(config.highLoadWeekday) },
            { label: 'High Load Saturday', value: formatTimeRange(config.highLoadSaturday) },
            { label: 'High Load Sunday', value: formatTimeRange(config.highLoadSunday) },
            { label: 'Low Load Max Power', value: formatPowerValue(config.lowLoadMaxPower) },
            { label: 'Power Unit Efficiency Limit', value: formatPowerValue(config.powerUnitMaxPower) },
            { label: 'Heat Backup', value: config.heatBackupAvailable === 'false' ? 'No' : 'Yes' },
            { label: 'Fuel Selector', value: mapFuelSelector(config.fuelSelector) },

        ].filter(item => item.value !== undefined);
    };

    const fetchSystemConfiguration = useCallback(async (id: string) => {
        setIsLoading(true);
        setIsError(false);
        setHasData(false);

        try {
            const userData = await StorageService.user.getData<UserData>();
            if (!userData) {
                throw new Error('User not authenticated');
            }

            const response = await SystemController.getSystemConfiguration(id);

            if (response) {
                const { configurations: transformedData, hasData: dataAvailable } = transformConfigurationData(response);
                transformConfigurationData(response);
                setConfigurations(transformedData);
                setHasData(dataAvailable && transformedData.length > 0);

                if (transformedData.length > 0) {
                    setExpandedId(transformedData[0].id);
                }
            } else {
                setConfigurations([]);
                setHasData(false);
            }
        } catch (error) {
            console.log('Error fetching system configuration:', error);
            setIsError(true);
            setConfigurations([]);
            setHasData(false);
        } finally {
            setIsLoading(false);
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
