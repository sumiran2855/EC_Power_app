import { RegisterController } from '@/controllers/RegisterController';
import { SystemController } from '@/controllers/SystemController';
import { UserController } from '@/controllers/UserController';
import { Facility } from '@/screens/authScreens/types';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface MenuItem {
    id: string;
    title: string;
    icon: string;
    hasData?: boolean;
}

interface GeneralData {
    systemName: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        email: string;
        cellPhone: string;
    };
    dealer: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        email: string;
        cellPhone: string;
    };
    technician: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        email: string;
        cellPhone: string;
    };
}

interface LastCallData {
    calls: string;
    timeOfCall: string;
    operationStatus: {
        status: string;
        noise: string;
        oilPressure: string;
        gasAlarm: string;
    };
    controlPanelTemperature: string;
    controlPanelAntennaSignal: string;
}

interface Status2025Data {
    latestUpdate: string;
    operatingHours: string;
    lastService: string;
    operationalHoursToNextService: string;
    elecProduction: string;
    heatProduction: string;
    fuelConsumption: string;
    firstCall: string;
    siteElecConsumption: string;
    coveredByXRGISystem: string;
    coveredByPowerPurchase: string;
    soldElectricity: string;
}

type SystemStatus = 'idle' | 'running' | 'stopped';

interface UseUnitDetailProps {
    XrgiId?: string;
}

const useUnitDetail = ({ XrgiId }: UseUnitDetailProps = {}) => {
    const [isStarting, setIsStarting] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>('idle');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const menuItems: MenuItem[] = [
        { id: 'general', title: 'General', icon: 'information-circle-outline', hasData: true },
        { id: 'lastCall', title: 'Last Call', icon: 'call-outline', hasData: false },
        { id: 'customerLogin', title: 'Customer Login', icon: 'person-outline', hasData: false },
        { id: 'status2025', title: 'Status 2025', icon: 'stats-chart-outline', hasData: false },
        { id: 'existingConfig', title: 'Existing Configuration', icon: 'settings-outline', hasData: false },
    ];

    // Fetch facility and user details
    const [facilityData, setFacilityData] = useState<Facility>();
    const [userData, setUserData] = useState<any>();
    const [dealerData, setDealerData] = useState<any>(null);
    const [recentCallData, setRecentCallData] = useState<any>(null);
    const [statusData, setStatusData] = useState<any>(null);
    const [systemConfiguration, setSystemConfiguration] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecentCallLoading, setIsRecentCallLoading] = useState(false);
    const [isSystemConfigurationLoading, setIsSystemConfigurationLoading] = useState(false);
    const [isStatusData2025Loading, setIsStatusData2025Loading] = useState(false);

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

    const GetstatusData2025 = async () => {
        setIsStatusData2025Loading(true);
        try {
            // Get current date and time
            const endDate = new Date();
            // Calculate date 7 days ago
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 7);
            
            // Format dates to match the required format (YYYY-MM-DD+HH:MM:SS)
            const formatDate = (date: Date) => {
                return date.toISOString()
                    .replace(/T/, '+')
                    .replace(/\..+/, '')
                    .replace(/:00\+/, '+00:00');
            };
            
            const startDateStr = formatDate(startDate);
            const endDateStr = formatDate(endDate);
            
            const response = await fetch(`https://service.ecpower.dk/rest/service/v1/plant/statistics/api/${XrgiId}/${startDateStr}/${endDateStr}`);
            if (response) {
                const data = await response.json();
                setStatusData(data);
            }
        } catch (error) {
            console.log("Error fetching status data:", error);
        } finally {
            setIsStatusData2025Loading(false);
        }
    }

    const getSystemConfiguration = async () => {
        setIsSystemConfigurationLoading(true);
        try {
            const response = await SystemController.getSystemConfiguration(XrgiId!);
            if (response?.raw?.plantConfigurationData?.[0]?.configuration) {
                setSystemConfiguration(response.raw?.plantConfigurationData?.[0]?.configuration);
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
        GetstatusData2025();
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

    const lastCallData: LastCallData = {
        calls: recentCallData?.[0]?.[0]?.toString() || '-',
        timeOfCall: recentCallData?.[0]?.[1] || '-',
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

    const status2025Data: Status2025Data = {
        latestUpdate: statusData?.LatesCallDate
            ? statusData.LatesCallDate
            : '-',
        operatingHours: statusData?.PossibleMinutes > 0
            ? formatMinutesRatio(statusData.OperationalMinutes ?? 0, statusData.PossibleMinutes)
            : 'out of possible hours',
        lastService: statusData?.LatesServiceDate
            ? statusData.LatesServiceDate
            : '-',
        operationalHoursToNextService: statusData?.TimeNextService
            ? `${formatNumber(secondsToHours(statusData.TimeNextService))} hours`
            : '-',
        elecProduction: statusData?.PowerProduction
            ? `${formatNumber(statusData.PowerProduction / 1000)} kWh`
            : '0 kWh',
        heatProduction: statusData?.HeatProduction
            ? `${formatNumber(statusData.HeatProduction)} kWh`
            : '0 kWh',
        fuelConsumption: statusData?.FuelConsumption
            ? `${formatNumber(statusData.FuelConsumption)} kWh`
            : '0 kWh',
        firstCall: statusData?.FirstCallDate
            ? statusData.FirstCallDate
            : '-',
        siteElecConsumption: statusData?.PowerConsumption
            ? formatNumber(statusData.PowerConsumption / 1000) + ' kWh'
            : '0 kWh',
        coveredByXRGISystem: statusData?.PowerCoveredByXRGI
            ? formatNumber(statusData.PowerCoveredByXRGI / 1000) + ' kWh'
            : '0 kWh',
        coveredByPowerPurchase: statusData?.PowerCoveredByPurchase
            ? formatNumber(statusData.PowerCoveredByPurchase / 1000) + ' kWh'
            : '0 kWh',
        soldElectricity: statusData?.PowerSoldEl
            ? formatNumber(statusData.PowerSoldEl / 1000) + ' kWh'
            : '0 kWh'
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
        Alert.alert(
            'Start System',
            'Are you sure you want to start the XRGI system?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Start',
                    onPress: () => {
                        setIsStarting(true);
                        setTimeout(() => {
                            setIsStarting(false);
                            setSystemStatus('running');
                            onSuccess?.();
                        }, 2000);
                    }
                }
            ]
        );
    };

    const handleStopSystem = (onSuccess?: () => void) => {
        Alert.alert(
            'Stop System',
            'Are you sure you want to stop the XRGI system?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Stop',
                    onPress: () => {
                        setIsStopping(true);
                        setTimeout(() => {
                            setIsStopping(false);
                            setSystemStatus('stopped');
                            onSuccess?.();
                        }, 2000);
                    },
                    style: 'destructive'
                }
            ]
        );
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
        isStatusData2025Loading,

        // Data
        menuItems,
        generalData,
        lastCallData,
        customerLoginData,
        status2025Data,
        existingConfigData,

        // Methods
        toggleSection,
        handleStartSystem,
        handleStopSystem,
        setExpandedSection
    };
};

export default useUnitDetail;
