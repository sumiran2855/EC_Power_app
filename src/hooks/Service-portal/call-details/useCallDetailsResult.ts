import { SystemController } from '@/controllers/SystemController';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getOperationTypes, getServiceCodes, OperationType, ServiceCode } from '../serviceCode';

interface CodeMapping {
    code: number;
    text: string;
    type: 'normal' | 'warning' | 'error' | 'no-events';
}

interface OperationMapping {
    code: number;
    text: string;
    type: 'normal' | 'warning' | 'error' | 'no-events';
}

export interface CallData {
    id: string;
    serialNumber: string;
    systemName: string;
    heatDistributor: string;
    timeOfCall: string;
    attemptedRedials: string;
    softwareValidated: number;
    actualStatus: string;
    statusColor: string;
    stopped: string;
    operationalHoursToNextService: string;
    operatingHours: string;
    actualElecProduced: string;
    forcedStandby: string;
    loadLevel: string;
    storageLevel: string;
    oilPressure: string;
    smartstarterBoardTemp: string;
    boilerReleased: boolean;
    controlPanelAntennaSignal: string;
    controlPanelPCBTemp: string;
    controlPanelPSUVoltage: string;
    powerUnitUPSAccumulator: boolean;
    powerUnitPCBTemp: string;
    heatDistributorPCBTemp: string;
    flowmasterPSUVoltage: string;
    flowmasterPCBTemp: string;
    surgeProtector: boolean;
    smartstarterLastError: string;
}

interface UseCallDetailsResultReturn {
    callData: CallData;
    callDetailsData: any[];
    isLoading: boolean;
    expandedIncidents: { [key: string]: boolean };
    handleBackButton: () => void;
    toggleIncident: (incidentId: string) => void;
    navigateToHeatDistribution: () => void;
}

const useCallDetailsResult = (navigation: any, route: any): UseCallDetailsResultReturn => {
    const { system, fromDate, toDate, fromDateObject, toDateObject } = route.params;

    const [expandedIncidents, setExpandedIncidents] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [callDetailsData, setCallDetailsData] = useState<any[]>([]);
    const [operationData, setOperationData] = useState<any>({});
    const [plantData, setPlantData] = useState<any>({});

    const serviceCodes = useMemo(() => getServiceCodes(), []);
    const operationTypes = useMemo(() => getOperationTypes(() => ''), []);

    // Helper function to find a service code by code value and format the text with code
    const findServiceCode = useCallback((code: number | null): CodeMapping => {
        if (code === null) return { code: -1, text: 'No New Events', type: 'no-events' };
        const found = serviceCodes.find((sc: ServiceCode) => sc.code === code);
        if (found) {
            return {
                ...found,
                text: `${code} - ${found.text}`
            };
        }
        return { code, text: `${code} - Unknown`, type: 'warning' };
    }, [serviceCodes]);

    // Helper function to find an operation type by code value and format the text with code
    const findOperationType = useCallback((code: number | null): OperationMapping => {
        if (code === null) return { code: -1, text: 'No New Events', type: 'no-events' };
        const found = operationTypes.find((ot: OperationType) => ot.code === code);
        if (found) {
            return {
                ...found,
                text: `${code} - ${found.text}`
            };
        }
        return { code, text: `${code} - Unknown`, type: 'warning' };
    }, [operationTypes]);

    const getCallDetailsData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await SystemController.getCallDetailsData(system.xrgiID);
            if (data && Array.isArray(data)) {

                // Parse the date range (input format: DD-MM-YYYY HH:mm)
                const [fromDay, fromMonth, fromYear] = fromDate.split(' ')[0].split('-').map(Number);
                const [fromHour, fromMinute] = fromDate.split(' ')[1].split(':').map(Number);
                const fromDateObj = new Date(fromYear, fromMonth - 1, fromDay, fromHour, fromMinute);

                const [toDay, toMonth, toYear] = toDate.split(' ')[0].split('-').map(Number);
                const [toHour, toMinute] = toDate.split(' ')[1].split(':').map(Number);
                const toDateObj = new Date(toYear, toMonth - 1, toDay, toHour, toMinute);


                const formattedData = data
                    .map((item: any, index: number) => {
                        // Extract raw data from new API structure
                        const rawData = {
                            dato: item?.dato || '',
                            haendelse: typeof item?.haendelse === 'number' ? item.haendelse : null,
                            effekt: typeof item?.effekt === 'number' ? item.effekt : null,
                        };


                        // Parse dato string (format: "Jun 23, 2020 3:24:21 PM")
                        let parsedDate: Date | null = null;
                        if (rawData.dato) {
                            try {
                                // Manual parsing for the specific format
                                const parts = rawData.dato.split(' ');
                                const month = parts[0];
                                const day = parseInt(parts[1].replace(',', ''));
                                const year = parseInt(parts[2]);
                                const timeParts = parts[3].split(':');
                                const hour = parseInt(timeParts[0]);
                                const minute = parseInt(timeParts[1]);
                                const second = parseInt(timeParts[2]);
                                const ampm = parts[4];

                                // Convert 12-hour format to 24-hour format
                                let hour24 = hour;
                                if (ampm === 'PM' && hour !== 12) {
                                    hour24 = hour + 12;
                                } else if (ampm === 'AM' && hour === 12) {
                                    hour24 = 0;
                                }

                                // Map month name to number
                                const monthMap: { [key: string]: number } = {
                                    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                                    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                                };

                                const monthNum = monthMap[month];
                                if (monthNum !== undefined) {
                                    parsedDate = new Date(year, monthNum, day, hour24, minute, second);
                                } else {
                                    console.warn('Invalid month:', month);
                                }
                            } catch (error) {
                                console.warn('Invalid date format:', rawData.dato, error);
                            }
                        }

                        // Map haendelse to service codes and effekt to operation types
                        const serviceCodeInfo = findServiceCode(rawData.haendelse);
                        const operationTypeInfo = findOperationType(rawData.effekt);

                        return {
                            id: `${rawData.dato}-${index}`, // Create unique key using date and index
                            timeOfCall: rawData.dato,
                            dateObject: parsedDate,
                            incident: {
                                code: serviceCodeInfo.code,
                                text: serviceCodeInfo.text,
                                type: serviceCodeInfo.type,
                                color: serviceCodeInfo.type === 'error' ? '#EF4444' :
                                    serviceCodeInfo.type === 'warning' ? '#F59E0B' : '#10B981'
                            },
                            operation: {
                                code: operationTypeInfo.code,
                                text: operationTypeInfo.text,
                                type: operationTypeInfo.type,
                                color: operationTypeInfo.type === 'error' ? '#EF4444' :
                                    operationTypeInfo.type === 'warning' ? '#F59E0B' : '#10B981'
                            }
                        };
                    })
                    .filter(item => {
                        // Temporarily disable date filtering for testing
                        if (!item.dateObject) {
                            return false;
                        }

                        const shouldInclude = item.dateObject >= fromDateObj && item.dateObject <= toDateObj;
                        return shouldInclude;
                    })
                    .sort((a, b) => {
                        // Sort by date descending (newest first)
                        if (!a.dateObject || !b.dateObject) return 0;
                        return b.dateObject.getTime() - a.dateObject.getTime();
                    });

                setCallDetailsData(formattedData || []);
            } else {
                setCallDetailsData([]);
            }
        } catch (error) {
            console.error("Error in getting calls data", error);
        } finally {
            setIsLoading(false);
        }
    }, [fromDate, toDate, system.xrgiID]);

    // Helper function to format timestamp to DD-MM-YYYY HH:mm format
    const formatTimestamp = (timestamp: number): string => {
        if (!timestamp) return "-";
        return new Date(timestamp * 1000).toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        }).replace(/\//g, '-').replace(',', '');
    };

    const getSystemConfiguration = async () => {
        try {
            const response = await SystemController.getSystemConfiguration(system.xrgiID);
            if (response?.raw) {
                const operationDataArray = response.raw?.plantOperationData || [];
                const operationDataWithTimestamp = operationDataArray.filter(
                    (item: any) => item["plant#metric"] === `${system.xrgiID}#OperationData`
                );

                // Find the latest OperationData by timestamp
                const latestOperationData = operationDataWithTimestamp.reduce(
                    (latest: any, current: any) => {
                        if (!latest || current.timestamp > latest.timestamp) {
                            return current;
                        }
                        return latest;
                    },
                    null
                );

                setOperationData(latestOperationData ? latestOperationData : []);
                setPlantData(response.raw?.plantData);
            } else {
                console.log("Error getting system configuration", response.error);
                setOperationData([]);
            }
        } catch (error) {
            console.log("Error getting system configuration", error);
            setOperationData([]);
        }
    };

    useEffect(() => {
        getCallDetailsData();
        getSystemConfiguration();
    }, []);


    // Sample data - replace with your actual data
    const callData: CallData = {
        id: "1",
        serialNumber: system.xrgiID,
        systemName: system.systemName,
        heatDistributor: "Heat Distributor",
        timeOfCall: formatTimestamp(operationData?.timestamp),
        attemptedRedials: "-",
        softwareValidated: operationData?.value?.SwValidation || 0,
        actualStatus: plantData?.state?.operationStateDetails === "Running" ? "Start-up (* OK)" : "Full stop",
        statusColor: plantData?.state?.operationStateDetails === "Running" ? "#10B981" : "#F59E0B",
        stopped: "-",
        operationalHoursToNextService: plantData?.statistics?.TimeToService,
        operatingHours: plantData?.statistics?.RuntimeSinceService ? `${plantData.statistics.RuntimeSinceService} hours` : "0 hours",
        actualElecProduced: operationData.value?.CurrentPowerProduction?.Power?.Value ? `${operationData.value?.CurrentPowerProduction.Power.Value} W` : "0 W",
        forcedStandby: operationData.value?.ForcedDown,
        loadLevel: operationData.value?.LoadLevel ? `${operationData.value.LoadLevel} %` : "0 %",
        storageLevel: operationData.value?.ActualStorageFilled ? `${operationData.value.ActualStorageFilled} %` : "0 %",
        oilPressure: "-",
        smartstarterBoardTemp: operationData.value?.SmartStarterPcbTemperature ? `${operationData.value.SmartStarterPcbTemperature} °C` : "-",
        boilerReleased: operationData.value?.BoilerSuppressed,
        controlPanelAntennaSignal: operationData.value?.AntennaSignalStrength,
        controlPanelPCBTemp: operationData.value?.EcuPcbTemperature?.Temp ? `${operationData.value.EcuPcbTemperature.Temp} °C` : "-",
        controlPanelPSUVoltage: operationData.value?.CentralControlPsuVoltage ? `${operationData.value.CentralControlPsuVoltage} V` : "-",
        powerUnitUPSAccumulator: operationData.value?.AccumulatorFailure || false,
        powerUnitPCBTemp: "-",
        heatDistributorPCBTemp: operationData.value?.HeatControlPcbTemperature?.Temp ? `${operationData.value.HeatControlPcbTemperature.Temp} °C` : "-",
        flowmasterPSUVoltage: operationData.value?.FlowMasterPsuVoltage ? `${operationData.value.FlowMasterPsuVoltage} V` : "-",
        flowmasterPCBTemp: "-",
        surgeProtector: operationData.value?.SurgeProtectorService || false,
        smartstarterLastError: operationData.value?.SmartStarterLastError,
    };

    const handleBackButton = () => {
        navigation.goBack();
    };

    const toggleIncident = (incidentId: string) => {
        setExpandedIncidents(prev => ({
            ...prev,
            [incidentId]: !prev[incidentId]
        }));
    };

    const navigateToHeatDistribution = () => {
        navigation.navigate('HeatDistribution', { system });
    };

    return {
        callData,
        callDetailsData,
        isLoading,
        expandedIncidents,
        handleBackButton,
        toggleIncident,
        navigateToHeatDistribution
    };
};

export default useCallDetailsResult;