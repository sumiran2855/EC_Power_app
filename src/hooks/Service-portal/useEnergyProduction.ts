import { useCallback, useEffect, useState } from 'react';

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

const useEnergyProduction = (): UseEnergyProductionReturn => {
    const [selectedFilter, setSelectedFilter] = useState('last7days');
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusData, setStatusData] = useState<any>(null);

    const GetstatusData = async (filterId: string) => {
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

            const response = await fetch(`https://service.ecpower.dk/rest/service/v1/plant/statistics/api/1184936474/${startDateStr}/${endDateStr}`);
            if (response) {
                const data = await response.json();
                setStatusData(data);
            }
        } catch (error) {
            console.error("Error fetching status data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        GetstatusData(selectedFilter);
    }, [selectedFilter]);

    const filterOptions: FilterOption[] = [
        { id: 'last7days', label: 'the last 7 days' },
        { id: 'last183days', label: 'the last 183 days' },
        { id: 'last365days', label: 'the last 365 days' },
        { id: 'firstcall', label: 'since the first call' },
        { id: '2025', label: '2025' },
        { id: '2024', label: '2024' },
    ];

    const systemInfo: SystemInfo[] = statusData ? [
        { label: 'Latest update:', value: statusData.LatesCallDate ? statusData.LatesCallDate.replace(/:\d{2}\s+[AP]M$/, '') : '-' },
        { label: 'Operating hours:', value: statusData.OperationalMinutes && statusData.PossibleMinutes ? `${Math.round(statusData.OperationalMinutes / 60)} out of ${Math.round(statusData.PossibleMinutes / 60)} hours` : 'out of possible hours' },
        { label: 'Last service:', value: statusData.LatesServiceDate ? statusData.LatesServiceDate.replace(/:\d{2}\s+[AP]M$/, '') : '-' },
        { label: 'Operational hours to next service:', value: statusData.TimeNextService ? `${Math.round(statusData.TimeNextService / 60)} hours` : '-' },
        { label: 'Elec. production:', value: statusData.PowerProduction ? `${Math.round(statusData.PowerProduction / 1000)} kWh` : '0 kWh' },
        { label: 'Heat production:', value: statusData.HeatProduction ? `${Math.round(statusData.HeatProduction / 1000)} kWh` : '0 kWh' },
        { label: 'Fuel Consumption:', value: statusData.FuelConsumption ? `${Math.round(statusData.FuelConsumption / 1000)} kWh` : '0 kWh' },
        { label: 'First Call:', value: statusData.FirstCallDate ? statusData.FirstCallDate.replace(/:\d{2}\s+[AP]M$/, '') : '-' },
        { label: 'Site elec. consumption:', value: statusData.PowerConsumption ? `${Math.round(statusData.PowerConsumption / 1000)} kWh` : '0 kWh' },
        { label: 'Covered by XRG® system:', value: statusData.PowerCoveredByXRGI ? `${Math.round(statusData.PowerCoveredByXRGI / 1000)} kWh` : '0 kWh' },
        { label: 'Covered by power purchase:', value: statusData.PowerCoveredByPurchase ? `${Math.round(statusData.PowerCoveredByPurchase / 1000)} kWh` : '0 kWh' },
        { label: 'Sold electricity:', value: statusData.PowerSoldEl ? `${Math.round(statusData.PowerSoldEl / 1000)} kWh` : '0 kWh' },
    ] : [
        { label: 'Latest update:', value: 'Loading...' },
        { label: 'Operating hours:', value: 'out of possible hours' },
        { label: 'Last service:', value: '-' },
        { label: 'Operational hours to next service:', value: '-' },
        { label: 'Elec. production:', value: 'kWh' },
        { label: 'Heat production:', value: 'kWh' },
        { label: 'Fuel Consumption:', value: 'kWh' },
        { label: 'First Call:', value: '-' },
        { label: 'Site elec. consumption:', value: '-' },
        { label: 'Covered by XRG® system:', value: '-' },
        { label: 'Covered by power purchase:', value: '-' },
        { label: 'Sold electricity:', value: '-' },
    ];

    const chartData: ChartData = statusData ? {
        labels: ['Current Period'],
        datasets: [
            {
                data: [Math.round(statusData.PowerProduction / 1000) || 0],
                color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round(statusData.PowerConsumption / 1000) || 0],
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round(statusData.HeatProduction / 1000) || 0],
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                strokeWidth: 2.5,
            },
            {
                data: [Math.round(statusData.PowerSoldEl / 1000) || 0],
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
        GetstatusData(filterId);
    }, []);

    const getFilterLabel = useCallback(() => {
        return filterOptions.find(f => f.id === selectedFilter)?.label || '2025';
    }, [selectedFilter, filterOptions]);

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
