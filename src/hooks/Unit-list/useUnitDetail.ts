import { RegisterController } from '@/controllers/RegisterController';
import { SystemController } from '@/controllers/SystemController';
import { UserController } from '@/controllers/UserController';
import { Facility } from '@/screens/authScreens/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertType, GeneralData, LastCallData, MenuItem, StatusData, SystemStatus } from '../types';

interface UseUnitDetailProps {
    XrgiId?: string;
}

const useUnitDetail = ({ XrgiId }: UseUnitDetailProps = {}) => {
    const { t } = useTranslation();
    const [isStarting, setIsStarting] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>('idle');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [alert, setAlert] = useState<{
        visible: boolean;
        type: AlertType;
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        visible: false,
        type: 'info',
        title: '',
        message: ''
    });

    const menuItems: MenuItem[] = [
        { id: 'general', title: t('unitDetail.menuItems.general'), icon: 'information-circle-outline', hasData: true },
        { id: 'lastCall', title: t('unitDetail.menuItems.lastCall'), icon: 'call-outline', hasData: false },
        { id: 'customerLogin', title: t('unitDetail.menuItems.customerLogin'), icon: 'person-outline', hasData: false },
        { id: 'status', title: t('unitDetail.menuItems.status'), icon: 'stats-chart-outline', hasData: false },
        { id: 'existingConfig', title: t('unitDetail.menuItems.existingConfig'), icon: 'settings-outline', hasData: false },
    ];

    // Fetch facility and user details
    const [facilityData, setFacilityData] = useState<Facility>();
    const [userData, setUserData] = useState<any>();
    const [dealerData, setDealerData] = useState<any>(null);
    const [recentCallData, setRecentCallData] = useState<any>(null);
    const [systemConfiguration, setSystemConfiguration] = useState<any>(null);
    const [rawPlantData, setRawPlantData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecentCallLoading, setIsRecentCallLoading] = useState(false);
    const [isSystemConfigurationLoading, setIsSystemConfigurationLoading] = useState(false);

    // Update the GetFacilityByXrgiId function to include dealer data fetching
    const GetFacilityByXrgiId = async () => {
        try {
            setIsLoading(true);
            const response = await RegisterController.GetFacilityByXrgiId(XrgiId!);

            if (response?.data) {
                setFacilityData(response.data);

                // If there's a user ID in the response, fetch user data
                if (response.data.userID) {
                    try {
                        const userResponse = await UserController.GetUserProfile(response.data.userID);
                        if (userResponse?.data) {
                            setUserData(userResponse.data);

                            // If there's a dealerId in the user response, fetch dealer data
                            console.log('userResponse.data.dealerId :', userResponse.data);
                            if (userResponse.data.dealerId) {
                                try {
                                    const dealersResponse = await RegisterController.GetAllDealers();
                                    if (dealersResponse?.data) {
                                        const matchedDealer = dealersResponse.data.find(
                                            (dealer: any) => dealer.id === userResponse.data.dealerId
                                        );
                                        if (matchedDealer) {
                                            setDealerData(matchedDealer);
                                        } else {
                                            console.log("No dealer found with the given dealerId");
                                            setDealerData(null);
                                        }
                                    }
                                } catch (dealerError) {
                                    console.log("Error fetching dealer data:", dealerError);
                                    setDealerData(null);
                                }
                            } else {
                                console.log("No dealerId found in user data");
                                setDealerData(null);
                            }
                        }
                    } catch (userError) {
                        console.log("Error fetching user data:", userError);
                        setUserData(null);
                        setDealerData(null);
                    }
                }
            }
        } catch (error) {
            console.log("Error getting facility by xrgi id", error);
            setFacilityData(undefined);
            setUserData(null);
            setDealerData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getRecentCallDetail = async () => {
        setIsRecentCallLoading(true);
        try {
            const response = await fetch(`https://service.ecpower.dk/rest/service/v1/plant/statistics/api/calls/${XrgiId}`);
            if (response) {
                const data = await response.json();
                setRecentCallData(data);
            }
        } catch (error) {
            console.log("Error recent call operational data:", error);
        } finally {
            setIsRecentCallLoading(false);
        }
    }

    const getSystemConfiguration = async () => {
        setIsSystemConfigurationLoading(true);
        try {
            const response = await SystemController.getSystemConfiguration(XrgiId!);
            if (response?.raw) {
                setRawPlantData(response.raw);
                
                if (response.raw?.plantConfigurationData?.[0]?.configuration) {
                    setSystemConfiguration(response.raw.plantConfigurationData[0].configuration);
                }
            }
        } catch (error) {
            console.log("Error fetching system configuration:", error);
        } finally {
            setIsSystemConfigurationLoading(false);
        }
    }

    useEffect(() => {
        GetFacilityByXrgiId();
        getRecentCallDetail();
        getSystemConfiguration();
    }, [XrgiId]);

    const secondsToHours = (seconds: number): number => {
        return Math.round(seconds / 3600);
    };

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(Math.round(num));
    };

    const formatMinutesRatio = (operational: number, possible: number): string => {
        if (operational <= possible) {
            return 'out of possible hours';
        }

        const remainingMinutes = possible - operational;

        // Format remaining time
        if (remainingMinutes < 60) {
            return `${Math.round(remainingMinutes)} min`;
        } else {
            const hours = Math.floor(remainingMinutes / 60);
            const mins = Math.round(remainingMinutes % 60);
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
    };

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

    // Helper function to get the oldest (first) date from plantServiceLogData
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

    // Helper function to calculate Last Service Date from RuntimeSinceService (in minutes)
    const calculateLastServiceDate = (runtimeSinceServiceMinutes: number): string => {
        if (!runtimeSinceServiceMinutes || runtimeSinceServiceMinutes <= 0) return '-';
        
        const now = new Date();
        const lastServiceDate = new Date(now.getTime() - (runtimeSinceServiceMinutes * 60 * 1000));
        
        // Format the date as YYYY-MM-DD HH:mm:ss
        const year = lastServiceDate.getFullYear();
        const month = String(lastServiceDate.getMonth() + 1).padStart(2, '0');
        const day = String(lastServiceDate.getDate()).padStart(2, '0');
        const hours = String(lastServiceDate.getHours()).padStart(2, '0');
        const minutes = String(lastServiceDate.getMinutes()).padStart(2, '0');
        const seconds = String(lastServiceDate.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const generalData: GeneralData = {
        systemName: {
            name: facilityData?.name || '-',
            address: facilityData?.location?.address || '-',
            city: facilityData?.location?.city || '-',
            postalCode: facilityData?.location?.postalCode || '-',
            country: facilityData?.location?.country || '-',
            email: userData?.email || '-',
            cellPhone: userData?.phone_number || '-'
        },
        dealer: {
            name: dealerData?.dealer_name || '-',
            address: dealerData?.Address || '-',
            city: dealerData?.city || '-',
            postalCode: dealerData?.postCode || '-',
            country: dealerData?.country || '-',
            email: dealerData?.email || '-',
            cellPhone: dealerData?.phone_number || '-'
        },
        technician: {
            name: '-',
            address: '-',
            city: '-',
            postalCode: '-',
            country: '-',
            email: '-',
            cellPhone: '-'
        }
    };

    // Get statistics from raw plant data (matching web implementation)
    const plantOperationData = rawPlantData?.plantOperationData || [];
    const plantServiceLogData = rawPlantData?.plantServiceLogData || [];

    // Filter and calculate statistics difference (all time - from first call)
    const getFilteredStatisticsDiff = () => {
        const statisticsData = plantOperationData.filter((item: any) => 
            item['plant#metric']?.includes('StatisticData')
        );
        
        if (statisticsData.length === 0) return null;
        
        // Sort by timestamp ascending (oldest first)
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
            RuntimeSinceService: lastRecord.RuntimeSinceService || 0, // Use latest value for service-related
            TimeToService: lastRecord.TimeToService || 0, // Use latest value for service-related
        };
        
        return diff;
    };

    const plantStatistics = getFilteredStatisticsDiff();

    const lastCallData: LastCallData = {
        calls: plantServiceLogData.length > 0 ? plantServiceLogData.length.toString() : '-',
        timeOfCall: getLatestDateFromServiceLog(plantServiceLogData),
        operationStatus: {
            status: recentCallData?.[0]?.[2] === 1 ? 'Running' : 'Stopped',
            noise: '0 minutes',
            oilPressure: 'NO',
            gasAlarm: 'NO'
        },
        controlPanelTemperature: '50%',
        controlPanelAntennaSignal: '90%'
    };

    const customerLoginData = {
        lastLogin: userData?.lastLogin
            ? new Date(userData.lastLogin).toISOString().replace('T', ' ').split('.')[0]
            : '-'
    };

    // Calculate operational hours to next service (TimeToService - RuntimeSinceService, convert to hours)
    const calculateHoursToNextService = (): string => {
        const timeToService = plantStatistics?.TimeToService;
        const runtimeSinceService = plantStatistics?.RuntimeSinceService;
        if (timeToService == null || runtimeSinceService == null) return '-';
        const remainingMinutes = timeToService - runtimeSinceService;
        return `${formatNumber(Math.round(remainingMinutes / 60))} hours`;
    };

    const formattedStatusData: StatusData = {
        // Latest Update: derived from plantServiceLogData (latest date#time)
        latestUpdate: getLatestDateFromServiceLog(plantServiceLogData),
        
        // Operating Hours: TotalRuntime in minutes, converted to hours
        operatingHours: plantStatistics?.TotalRuntime != null
            ? `${formatNumber(Math.round(plantStatistics.TotalRuntime / 60))} hours`
            : '-',
        
        // Last Service Date: calculated by subtracting RuntimeSinceService minutes from current date
        lastService: plantStatistics?.RuntimeSinceService
            ? calculateLastServiceDate(plantStatistics.RuntimeSinceService)
            : '-',
        
        // Operational Hours to Next Service: (TimeToService - RuntimeSinceService) / 60
        operationalHoursToNextService: calculateHoursToNextService(),
        
        // Electric Production: TotalPowerProduced / 1000 in kWh
        elecProduction: plantStatistics?.TotalPowerProduced != null
            ? `${formatNumber(plantStatistics.TotalPowerProduced / 1000)} kWh`
            : '-',
        
        // Heat Production: HeatProduced in kWh
        heatProduction: plantStatistics?.HeatProduced != null
            ? `${formatNumber(plantStatistics.HeatProduced)} kWh`
            : '-',
        
        // Fuel Consumption: FuelConsumed in kWh
        fuelConsumption: plantStatistics?.FuelConsumed != null
            ? `${formatNumber(plantStatistics.FuelConsumed)} kWh`
            : '-',
        
        // First Call: derived from plantServiceLogData (oldest/first date#time)
        firstCall: getOldestDateFromServiceLog(plantServiceLogData),
        
        // Site Electric Consumption: TotalPowerUsed / 1000 in kWh
        siteElecConsumption: plantStatistics?.TotalPowerUsed != null
            ? `${formatNumber(plantStatistics.TotalPowerUsed / 1000)} kWh`
            : '-',
        
        // Covered by XRGI System: Min(TotalPowerProduced, TotalPowerUsed) / 1000 in kWh
        coveredByXRGISystem: plantStatistics?.TotalPowerProduced != null && plantStatistics?.TotalPowerUsed != null
            ? `${formatNumber(Math.min(plantStatistics.TotalPowerProduced, plantStatistics.TotalPowerUsed) / 1000)} kWh`
            : '-',
        
        // Covered by Power Purchase: Max(0, TotalPowerUsed - TotalPowerProduced) / 1000 in kWh
        coveredByPowerPurchase: plantStatistics?.TotalPowerUsed != null && plantStatistics?.TotalPowerProduced != null
            ? `${formatNumber(Math.max(0, (plantStatistics.TotalPowerUsed - plantStatistics.TotalPowerProduced)) / 1000)} kWh`
            : '-',
        
        // Sold Electricity: Loss value (with negative sign)
        soldElectricity: plantStatistics?.Loss != null
            ? `- ${formatNumber(plantStatistics.Loss)} kWh`
            : '-'
    };

    const existingConfigData = {
        configurationChanged: '-',
        heatPump1Efficiency: systemConfiguration?.numberOfHeatPumpControl || '-',
        highLoadWeekdays: (systemConfiguration?.highLoadWeekday?.start || systemConfiguration?.highLoadWeekday?.end) ? `${systemConfiguration?.highLoadWeekday?.start} - ${systemConfiguration?.highLoadWeekday?.end}` : '-',
        loadWeekdays: (systemConfiguration?.highTariffWeekday?.start || systemConfiguration?.highTariffWeekday?.end) ? `${systemConfiguration?.highTariffWeekday?.start} - ${systemConfiguration?.highTariffWeekday?.end}` : '-',
        electricitySales: '-',
        senderCountry: dealerData?.country || '-',
        serialNo: systemConfiguration?.centralControlSerialNumber || '-',
        operator: systemConfiguration?.gsmOperator || '-',
        systemXRGIType: facilityData?.modelNumber || '-',
        heatPump2Efficiency: '-',
        highLoadSaturday: systemConfiguration?.highLoadSaturday?.start || systemConfiguration?.highLoadSaturday?.end ? `${systemConfiguration?.highLoadSaturday?.start} - ${systemConfiguration?.highLoadSaturday?.end}` : '-',
        loadSaturday: systemConfiguration?.highTariffSunday?.start || systemConfiguration?.highTariffSunday?.end ? `${systemConfiguration?.highTariffSunday?.start} - ${systemConfiguration?.highTariffSunday?.end}` : '-',
        saleWeekdays: systemConfiguration?.salePeriodWeekday?.start || systemConfiguration?.salePeriodWeekday?.end ? `${systemConfiguration?.salePeriodWeekday?.start} - ${systemConfiguration?.salePeriodWeekday?.end}` : '-',
        stopInLowLoad: systemConfiguration?.hrtmEnabled ? 'Yes' : 'No',
        versionNumber: '-',
        generation: '-',
        heatBackUp: systemConfiguration?.heatBackupAvailable ? 'Yes' : 'No',
        highLoadSunday: systemConfiguration?.highLoadSunday?.start || systemConfiguration?.highLoadSunday?.end ? `${systemConfiguration?.highLoadSunday?.start} - ${systemConfiguration?.highLoadSunday?.end}` : '-',
        loadSunday: systemConfiguration?.highTariffSunday?.start || systemConfiguration?.highTariffSunday?.end ? `${systemConfiguration?.highTariffSunday?.start} - ${systemConfiguration?.highTariffSunday?.end}` : '-',
        saleSaturday: systemConfiguration?.salePeriodSaturday?.start || systemConfiguration?.salePeriodSaturday?.end ? `${systemConfiguration?.salePeriodSaturday?.start} - ${systemConfiguration?.salePeriodSaturday?.end}` : '-',
        consumptionInHighLoad: systemConfiguration?.highLoadMaxPower?.power || '-',
        simCardNo: systemConfiguration?.simCardNumber || '-',
        communicationType: systemConfiguration?.communicationType || 'Unknown',
        meterType: systemConfiguration?.meterType || 'Unknown',
        saleSunday: systemConfiguration?.salePeriodSunday?.start || systemConfiguration?.salePeriodSunday?.end ? `${systemConfiguration?.salePeriodSunday?.start} - ${systemConfiguration?.salePeriodSunday?.end}` : '-',
        consumptionInLowLoad: systemConfiguration?.lowLoadMaxPower?.power || '-',
        terminalSerialNo: systemConfiguration?.terminalSerialNumber || '-'
    };

    const toggleSection = (itemId: string) => {
        setExpandedSection(expandedSection === itemId ? null : itemId);
    };

    const handleStartSystem = (onSuccess?: () => void) => {
        setAlert({
            visible: true,
            type: 'warning',
            title: t('unitDetail.alerts.startSystemTitle'),
            message: t('unitDetail.alerts.startSystemMessage'),
            onConfirm: () => {
                setIsStarting(true);
                setTimeout(() => {
                    setIsStarting(false);
                    setSystemStatus('running');
                    onSuccess?.();
                }, 2000);
            }
        });
    };

    const handleStopSystem = (onSuccess?: () => void) => {
        setAlert({
            visible: true,
            type: 'error',
            title: t('unitDetail.alerts.stopSystemTitle'),
            message: t('unitDetail.alerts.stopSystemMessage'),
            onConfirm: () => {
                setIsStopping(true);
                setTimeout(() => {
                    setIsStopping(false);
                    setSystemStatus('stopped');
                    onSuccess?.();
                }, 2000);
            }
        });
    };

    const handleAlertConfirm = () => {
        if (alert.onConfirm) {
            alert.onConfirm();
        }
        setAlert(prev => ({ ...prev, visible: false }));
    };

    const handleAlertCancel = () => {
        setAlert(prev => ({ ...prev, visible: false }));
    };

    return {
        // State
        isStarting,
        isStopping,
        systemStatus,
        expandedSection,
        isLoading,
        isRecentCallLoading,
        isSystemConfigurationLoading,
        alert,

        // Data
        menuItems,
        generalData,
        lastCallData,
        customerLoginData,
        formattedStatusData,
        existingConfigData,

        // Methods
        toggleSection,
        handleStartSystem,
        handleStopSystem,
        handleAlertConfirm,
        handleAlertCancel,
        setExpandedSection
    };
};

export default useUnitDetail;
