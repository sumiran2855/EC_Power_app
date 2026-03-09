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

const useEnergyProduction = (xrgiId: string): UseEnergyProductionReturn => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState('last7days');
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusData, setStatusData] = useState<any>(null);

    const GetstatusData = async (filterId: string, xrgiId: string) => {
        setIsLoading(true);
        try {
            const endDate = new Date();
            let startDate = new Date();

            // Set start date based on filter selection
            switch (filterId) {
                case 'last7days':
                    startDate.setDate(endDate.getDate() - 7);
                    break;
                case '2024':
                    startDate = new Date('2024-01-01T00:00:00');
                    endDate.setFullYear(2024);
                    endDate.setMonth(11);
                    endDate.setDate(31);
                    endDate.setHours(23, 59, 59);
                    break;
                case '2025':
                    startDate = new Date('2025-01-01T00:00:00');
                    break;
                case 'last183days':
                    startDate.setDate(endDate.getDate() - 183);
                    break;
                case 'last365days':
                    startDate.setDate(endDate.getDate() - 365);
                    break;
                case 'firstcall':
                    startDate = new Date('2022-01-27T11:03:02'); // First call date from status data
                    break;
                default:
                    startDate.setDate(endDate.getDate() - 7);
            }

            // Format dates to match the required format (YYYY-MM-DD+HH:MM:SS)
            const formatDate = (date: Date) => {
                return date.toISOString()
                    .replace(/T/, '+')
                    .replace(/\..+/, '')
                    .replace(/:00\+/, '+00:00');
            };

            const startDateStr = formatDate(startDate);
            const endDateStr = formatDate(endDate);

            const response = await fetch(`https://service.ecpower.dk/rest/service/v1/plant/statistics/api/statistic/${xrgiId}/${startDateStr}/${endDateStr}`);
            if (response) {
                const data = await response.json();
                setStatusData(data);
            }
        } catch (error) {
            console.log("Error fetching status data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        GetstatusData(selectedFilter, xrgiId);
    }, [selectedFilter, xrgiId]);

    const filterOptions: FilterOption[] = [
        { id: 'last7days', label: t('energyProduction.filterOptions.last7days') },
        { id: 'last183days', label: t('energyProduction.filterOptions.last183days') },
        { id: 'last365days', label: t('energyProduction.filterOptions.last365days') },
        { id: 'firstcall', label: t('energyProduction.filterOptions.firstcall') },
        { id: '2025', label: t('energyProduction.filterOptions.2025') },
        { id: '2024', label: t('energyProduction.filterOptions.2024') },
    ];

    const systemInfo: SystemInfo[] = statusData ? [
        { label: t('energyProduction.systemInfo.elecProduction'), value: statusData.elproduktion != null ? `${Math.round(statusData.elproduktion / 1000)} ${t('energyProduction.systemInfo.kwh')}` : '-' },
        { label: t('energyProduction.systemInfo.heatProduction'), value: statusData.lavtforbrug != null ? `${Math.round(statusData.lavtforbrug / 1000)} ${t('energyProduction.systemInfo.kwh')}` : '-' },
        { label: t('energyProduction.systemInfo.fuelConsumption'), value: statusData.braendelsforbrug != null ? `${Math.round(statusData.braendelsforbrug / 1000)} ${t('energyProduction.systemInfo.kwh')}` : '-' },
        { label: t('energyProduction.systemInfo.firstCall'), value: statusData.foerstemelding ? statusData.foerstemelding.replace(/:\d{2}\s+[AP]M$/, '') : '-' },
        { label: t('energyProduction.systemInfo.latestUpdate'), value: statusData.sidstemelding ? statusData.sidstemelding.replace(/:\d{2}\s+[AP]M$/, '') : '-' },
        { label: t('energyProduction.systemInfo.operatingHours'), value: statusData.driftstid != null ? `${Math.round(statusData.driftstid / 60)} ${t('energyProduction.systemInfo.hours')}` : '-' },
        { label: t('energyProduction.systemInfo.siteElecConsumption'), value: statusData.elforbrug != null ? `${Math.round(statusData.elforbrug / 1000)} ${t('energyProduction.systemInfo.kwh')}` : '-' },
        { label: t('energyProduction.systemInfo.soldElectricity'), value: statusData.elsalg != null ? `${Math.round(statusData.elsalg / 1000)} ${t('energyProduction.systemInfo.kwh')}` : '-' },
        { label: t('energyProduction.systemInfo.coveredByPowerPurchase'), value: statusData.underskud != null ? `${Math.round(statusData.underskud / 1000)} ${t('energyProduction.systemInfo.kwh')}` : '-' },
        { label: t('energyProduction.systemInfo.coveredByXRGI'), value: statusData.elproduktion != null ? `${Math.round(statusData.elproduktion / 1000)} ${t('energyProduction.systemInfo.kwh')}` : '-' },
    ] : [
        { label: t('energyProduction.systemInfo.elecProduction'), value: '-' },
        { label: t('energyProduction.systemInfo.heatProduction'), value: '-' },
        { label: t('energyProduction.systemInfo.fuelConsumption'), value: '-' },
        { label: t('energyProduction.systemInfo.firstCall'), value: '-' },
        { label: t('energyProduction.systemInfo.latestUpdate'), value: '-' },
        { label: t('energyProduction.systemInfo.operatingHours'), value: '-' },
        { label: t('energyProduction.systemInfo.siteElecConsumption'), value: '-' },
        { label: t('energyProduction.systemInfo.soldElectricity'), value: '-' },
        { label: t('energyProduction.systemInfo.coveredByPowerPurchase'), value: '-' },
        { label: t('energyProduction.systemInfo.coveredByXRGI'), value: '-' },
    ];

    const chartData: ChartData = statusData ? {
        labels: ['Current Period'],
        datasets: [
            {
                data: [Math.round((statusData.elproduktion || 0) / 1000)],
                color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round((statusData.elforbrug || 0) / 1000)],
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round((statusData.lavtforbrug || 0) / 1000)],
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round((statusData.elsalg || 0) / 1000)],
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                strokeWidth: 2.5,
            },
        ],
        legend: ['Elec. Prod.', 'Elec. Cons.', 'Heat Prod.', 'Elec. Sold'],
    } : {
        labels: ['01/12', '08/12', '15/12', '22/12', '29/12', '05/01', '12/01'],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                strokeWidth: 2.5,
            },
        ],
        legend: ['Elec. Prod.', 'Elec. Cons.', 'Heat Prod.', 'Elec. Sold'],
    };

    const handleFilterSelect = useCallback((filterId: string) => {
        setSelectedFilter(filterId);
        setModalVisible(false);
        // Fetch data with new filter
        GetstatusData(filterId, xrgiId);
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
