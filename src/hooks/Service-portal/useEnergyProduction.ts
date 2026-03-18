import { SystemController } from '@/controllers/SystemController';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface FilterOption {
    id: string;
    label: string;
}

export interface SystemInfo {
    label: string;
    value: string;
}

export interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        color: (opacity?: number) => string;
        strokeWidth: number;
    }[];
    legend: string[];
}

interface UseEnergyProductionReturn {
    // State
    selectedFilter: string;
    modalVisible: boolean;
    filterOptions: FilterOption[];
    systemInfo: SystemInfo[];
    chartData: ChartData;
    isLoading: boolean;

    // Handlers
    handleFilterSelect: (filterId: string) => void;
    setModalVisible: (visible: boolean) => void;
    getFilterLabel: () => string;
}

const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const useEnergyProduction = (xrgiId: string): UseEnergyProductionReturn => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState('last7days');
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rawPlantData, setRawPlantData] = useState<any>(null);

    // Fetch facility data with raw plant statistics
    const getFacilityData = async (xrgiId: string) => {
        setIsLoading(true);
        try {
            const response = await SystemController.getSystemConfiguration(xrgiId);
            if (response?.raw) {
                setRawPlantData(response.raw);
            }
        } catch (error) {
            console.log("Error fetching facility data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (xrgiId) {
            getFacilityData(xrgiId);
        }
    }, [xrgiId]);

    // Helper function to get the latest date from plantServiceLogData
    const getLatestDateFromServiceLog = (serviceLogData: any[]): string => {
        if (!serviceLogData || serviceLogData.length === 0) return '-';
        
        let latestDate: Date | null = null;
        let latestDateString = '-';
        
        for (const log of serviceLogData) {
            if (log['date#time']) {
                const [datePart, timePart] = log['date#time'].split('#');
                const dateObj = new Date(`${datePart}T${timePart}`);
                
                if (!latestDate || dateObj > latestDate) {
                    latestDate = dateObj;
                    latestDateString = `${datePart} ${timePart}`;
                }
            }
        }
        
        return latestDateString;
    };

    const getOldestDateFromServiceLog = (serviceLogData: any[]): string => {
        if (!serviceLogData || serviceLogData.length === 0) return '-';
        
        let oldestDate: Date | null = null;
        let oldestDateString = '-';
        
        for (const log of serviceLogData) {
            if (log['date#time']) {
                const [datePart, timePart] = log['date#time'].split('#');
                const dateObj = new Date(`${datePart}T${timePart}`);
                
                if (!oldestDate || dateObj < oldestDate) {
                    oldestDate = dateObj;
                    oldestDateString = `${datePart} ${timePart}`;
                }
            }
        }
        
        return oldestDateString;
    };

    // Get statistics from raw plant data (matching web implementation)
    const plantOperationData = rawPlantData?.plantOperationData || [];
    
    // Dynamic year calculation
    const currentYear = new Date().getFullYear() - 1;
    const previousYear = currentYear - 1;
    
    // Get timestamp range based on selected filter
    const getFilterTimestampRange = (filter: string): { start: number; end: number } => {
        const now = Math.floor(Date.now() / 1000);
        
        switch (filter) {
            case 'last7days':
                return { start: now - (7 * 24 * 60 * 60), end: now };
            case 'last183days':
                return { start: now - (183 * 24 * 60 * 60), end: now };
            case 'last365days':
                return { start: now - (365 * 24 * 60 * 60), end: now };
            case 'currentYear':
                return { 
                    start: new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000, 
                    end: new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000 
                };
            case 'previousYear':
                return { 
                    start: new Date(`${previousYear}-01-01T00:00:00Z`).getTime() / 1000, 
                    end: new Date(`${previousYear}-12-31T23:59:59Z`).getTime() / 1000 
                };
            case 'firstcall':
                return { start: 0, end: now };
            default:
                return { start: now - (7 * 24 * 60 * 60), end: now };
        }
    };
    
    const getFilteredStatisticsDiff = () => {
        const { start, end } = getFilterTimestampRange(selectedFilter);
        
        const statisticsData = plantOperationData.filter((item: any) => {
            const isStatisticData = item['plant#metric']?.includes('StatisticData');
            const isWithinRange = item.timestamp >= start && item.timestamp <= end;
            return isStatisticData && isWithinRange;
        });
        
        if (statisticsData.length === 0) return null;
        
        const sorted = [...statisticsData].sort((a: any, b: any) => a.timestamp - b.timestamp);
        
        const firstRecord = sorted[0]?.value;
        const lastRecord = sorted[sorted.length - 1]?.value;
        
        if (!firstRecord || !lastRecord) return null;
        
        // Calculate the difference (last - first)
        const diff = {
            TotalPowerProduced: (lastRecord.TotalPowerProduced || 0) - (firstRecord.TotalPowerProduced || 0),
            TotalPowerUsed: (lastRecord.TotalPowerUsed || 0) - (firstRecord.TotalPowerUsed || 0),
            HeatProduced: (lastRecord.HeatProduced || 0) - (firstRecord.HeatProduced || 0),
            FuelConsumed: (lastRecord.FuelConsumed || 0) - (firstRecord.FuelConsumed || 0),
            Loss: (lastRecord.Loss || 0) - (firstRecord.Loss || 0),
            TotalRuntime: (lastRecord.TotalRuntime || 0) - (firstRecord.TotalRuntime || 0),
            RuntimeSinceService: (lastRecord.RuntimeSinceService || 0) - (firstRecord.RuntimeSinceService || 0),
        };
        
        return diff;
    };
    
    const plantStatistics = getFilteredStatisticsDiff();
    const plantServiceLogData = rawPlantData?.plantServiceLogData || [];
    
    useEffect(() => {
        if (plantOperationData.length > 0) {
            getFilteredStatisticsDiff();
        }
    }, [rawPlantData, selectedFilter]);

    const filterOptions: FilterOption[] = [
        { id: 'last7days', label: t('energyProduction.filterOptions.last7days') },
        { id: 'last183days', label: t('energyProduction.filterOptions.last183days') },
        { id: 'last365days', label: t('energyProduction.filterOptions.last365days') },
        { id: 'firstcall', label: t('energyProduction.filterOptions.firstcall') },
        { id: 'currentYear', label: `${currentYear}` },
        { id: 'previousYear', label: `${previousYear}` },
    ];

    const systemInfo: SystemInfo[] = [
        { 
            label: t('energyProduction.systemInfo.elecProduction'), 
            value: plantStatistics?.TotalPowerProduced != null 
                ? `${formatNumber(plantStatistics.TotalPowerProduced / 1000)} ${t('energyProduction.systemInfo.kwh')}` 
                : '-' 
        },
        { 
            label: t('energyProduction.systemInfo.heatProduction'), 
            value: plantStatistics?.HeatProduced != null 
                ? `${formatNumber(plantStatistics.HeatProduced)} ${t('energyProduction.systemInfo.kwh')}` 
                : '-' 
        },
        { 
            label: t('energyProduction.systemInfo.fuelConsumption'), 
            value: plantStatistics?.FuelConsumed != null 
                ? `${formatNumber(plantStatistics.FuelConsumed)} ${t('energyProduction.systemInfo.kwh')}` 
                : '-' 
        },
        { 
            label: t('energyProduction.systemInfo.firstCall'), 
            value: getOldestDateFromServiceLog(plantServiceLogData) 
        },
        { 
            label: t('energyProduction.systemInfo.latestUpdate'), 
            value: getLatestDateFromServiceLog(plantServiceLogData) 
        },
        { 
            label: t('energyProduction.systemInfo.operatingHours'), 
            value: plantStatistics?.TotalRuntime != null 
                ? `${formatNumber(Math.round(plantStatistics.TotalRuntime / 60))} ${t('energyProduction.systemInfo.hours')}` 
                : '-' 
        },
        { 
            label: t('energyProduction.systemInfo.siteElecConsumption'), 
            value: plantStatistics?.TotalPowerUsed != null 
                ? `${formatNumber(plantStatistics.TotalPowerUsed / 1000)} ${t('energyProduction.systemInfo.kwh')}` 
                : '-' 
        },
        { 
            label: t('energyProduction.systemInfo.soldElectricity'), 
            value: plantStatistics?.Loss != null 
                ? `- ${formatNumber(plantStatistics.Loss)} ${t('energyProduction.systemInfo.kwh')}` 
                : '-' 
        },
        { 
            label: t('energyProduction.systemInfo.coveredByPowerPurchase'), 
            value: plantStatistics?.TotalPowerUsed != null && plantStatistics?.TotalPowerProduced != null 
                ? `${formatNumber(Math.max(0, (plantStatistics.TotalPowerUsed - plantStatistics.TotalPowerProduced)) / 1000)} ${t('energyProduction.systemInfo.kwh')}` 
                : '-' 
        },
        { 
            label: t('energyProduction.systemInfo.coveredByXRGI'), 
            value: plantStatistics?.TotalPowerProduced != null && plantStatistics?.TotalPowerUsed != null 
                ? `${formatNumber(Math.min(plantStatistics.TotalPowerProduced, plantStatistics.TotalPowerUsed) / 1000)} ${t('energyProduction.systemInfo.kwh')}` 
                : '-' 
        },
    ];

    const chartData: ChartData = {
        labels: ['Current Period'],
        datasets: [
            {
                data: [Math.round((plantStatistics?.TotalPowerProduced || 0) / 1000)],
                color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round((plantStatistics?.TotalPowerUsed || 0) / 1000)],
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round((plantStatistics?.HeatProduced || 0))],
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round((plantStatistics?.Loss || 0))],
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                strokeWidth: 2.5,
            },
        ],
        legend: ['Elec. Prod.', 'Elec. Cons.', 'Heat Prod.', 'Elec. Sold'],
    };

    const handleFilterSelect = useCallback((filterId: string) => {
        setSelectedFilter(filterId);
        setModalVisible(false);
        // Refresh data when filter changes
        if (xrgiId) {
            getFacilityData(xrgiId);
        }
    }, [xrgiId]);

    const getFilterLabel = useCallback(() => {
        return filterOptions.find(f => f.id === selectedFilter)?.label || t('energyProduction.filterOptions.2025');
    }, [selectedFilter, filterOptions, t]);

    return {
        // State
        selectedFilter,
        modalVisible,
        filterOptions,
        systemInfo,
        chartData,
        isLoading,

        // Handlers
        handleFilterSelect,
        setModalVisible,
        getFilterLabel,
    };
};

export default useEnergyProduction;