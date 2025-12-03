import { SystemController } from '@/controllers/SystemController';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCallReason, getOperationTypes, getServiceCodes } from './serviceCode';

export interface CallData {
    id: string;
    timeOfCall: string;
    cause: string;
    currentStatus: string;
    latestIncident: string;
    statusOfIncident: string;
}

export type StatusType = 'normal' | 'warning' | 'error' | 'no-events';

export interface MappedCallData extends Omit<CallData, 'cause' | 'currentStatus' | 'latestIncident' | 'statusOfIncident'> {
    cause: {
        code: number;
        text: string;
        type: StatusType;
    };
    currentStatus: {
        code: number;
        text: string;
        type: StatusType;
    };
    latestIncident: {
        code: number | null;
        text: string;
        type: StatusType;
    };
    statusOfIncident: {
        code: number | null;
        text: string;
        type: StatusType;
    };
}

interface UseStatisticsResultReturn {
    callsData: MappedCallData[];
    isLoading: boolean;
    handleBackButton: () => void;
    getStatusColor: (type: StatusType) => string;
}

const useStatisticsResult = (fromDate: string, toDate: string, system: any): UseStatisticsResultReturn => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [callsData, setCallsData] = useState<MappedCallData[]>([]);

    // Use useMemo to get code mappings only once
    const serviceCodes = useMemo(() => getServiceCodes(), []);
    const operationTypes = useMemo(() => getOperationTypes(() => ''), []);
    const callReasons = useMemo(() => getCallReason(() => ''), []);

    // Helper function to find a service code by code value and format the text with code
    const findServiceCode = useCallback((code: number | null) => {
        if (code === null) return { code: -1, text: 'No New Events', type: 'no-events' as const };
        const found = serviceCodes.find(sc => sc.code === code);
        if (found) {
            return {
                ...found,
                text: `${code} - ${found.text}`
            };
        }
        return { code, text: `${code} - Unknown`, type: 'warning' as const };
    }, [serviceCodes]);

    // Helper function to find an operation type by code value and format the text with code
    const findOperationType = useCallback((code: number | null) => {
        if (code === null) return { code: -1, text: 'No New Events', type: 'no-events' as const };
        const found = operationTypes.find(ot => ot.code === code);
        if (found) {
            return {
                ...found,
                text: `${code} - ${found.text}`
            };
        }
        return { code, text: `${code} - Unknown`, type: 'warning' as const };
    }, [operationTypes]);

    // Helper function to find a call reason by causeCode and format the text with code
    const findCallReason = useCallback((causeCode: number | null) => {
        if (causeCode === null) return { causeCode: -1, cause: 'No New Events', type: 'no-events' as const };
        const found = callReasons.find(cr => cr.causeCode === causeCode);
        if (found) {
            return {
                ...found,
                cause: `${causeCode} - ${found.cause}`
            };
        }
        return { causeCode, cause: `${causeCode} - Unknown`, type: 'warning' as const };
    }, [callReasons]);

    const getCallsData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await SystemController.getCallStatisticsData(system.xrgiID);
            if (data && Array.isArray(data)) {
                // Parse the date range (input format: DD-MM-YYYY HH:mm)
                const [fromDay, fromMonth, fromYear] = fromDate.split(' ')[0].split('-').map(Number);
                const [fromHour, fromMinute] = fromDate.split(' ')[1].split(':').map(Number);
                const fromDateObj = new Date(fromYear, fromMonth - 1, fromDay, fromHour, fromMinute);

                const [toDay, toMonth, toYear] = toDate.split(' ')[0].split('-').map(Number);
                const [toHour, toMinute] = toDate.split(' ')[1].split(':').map(Number);
                const toDateObj = new Date(toYear, toMonth - 1, toDay, toHour, toMinute);

                const formattedData = data
                    .map((item: any) => {
                        // Extract raw data
                        const rawData = {
                            id: String(item?.[0] || ''),
                            timeOfCall: item?.[1] || '',
                            causeCode: typeof item?.[2] === 'number' ? item[2] : null,
                            currentStatusCode: typeof item?.[3] === 'number' ? item[3] : null,
                            latestIncidentCode: typeof item?.[4] === 'number' ? item[4] : null,
                            statusOfIncidentCode: typeof item?.[5] === 'number' ? item[5] : null,
                        };

                        // Map codes to their corresponding text and type
                        const causeInfo = findCallReason(rawData.causeCode);
                        const currentStatusInfo = findOperationType(rawData.currentStatusCode);
                        const latestIncidentInfo = rawData.latestIncidentCode !== null
                            ? findServiceCode(rawData.latestIncidentCode)
                            : { code: null, text: 'No New Events', type: 'no-events' as const };
                        const statusOfIncidentInfo = rawData.statusOfIncidentCode !== null
                            ? findOperationType(rawData.statusOfIncidentCode)
                            : { code: null, text: 'No New Events', type: 'no-events' as const };

                        return {
                            id: rawData.id,
                            timeOfCall: rawData.timeOfCall,
                            cause: {
                                code: causeInfo.causeCode,
                                text: causeInfo.cause,
                                type: causeInfo.type
                            },
                            currentStatus: {
                                code: currentStatusInfo.code,
                                text: currentStatusInfo.text,
                                type: currentStatusInfo.type
                            },
                            latestIncident: {
                                code: latestIncidentInfo.code,
                                text: latestIncidentInfo.text,
                                type: latestIncidentInfo.type
                            },
                            statusOfIncident: {
                                code: statusOfIncidentInfo.code,
                                text: statusOfIncidentInfo.text,
                                type: statusOfIncidentInfo.type
                            }
                        };
                    })
                    .filter(item => {
                        if (!item.timeOfCall) return false;
                        // Parse the API date string (format: 'YYYY-MM-DD HH:mm:ss')
                        const [datePart, timePart] = item.timeOfCall.split(' ');
                        const [year, month, day] = datePart.split('-').map(Number);
                        const [hour, minute] = timePart.split(':').map(Number);
                        const callDate = new Date(year, month - 1, day, hour, minute);

                        return callDate >= fromDateObj && callDate <= toDateObj;
                    });

                setCallsData(formattedData);
            }
        } catch (error) {
            console.error("Error in getting calls data", error);
        } finally {
            setIsLoading(false);
        }
    }, [fromDate, toDate, system.xrgiID]);

    useEffect(() => {
        getCallsData();
    }, [fromDate, toDate, system?.xrgiID]); 

    const handleBackButton = () => {
        navigation.goBack();
    };

    const getStatusColor = (type: 'normal' | 'warning' | 'error' | 'no-events'): string => {
        switch (type) {
            case 'normal':
                return '#10B981'; 
            case 'warning':
                return '#F59E0B';
            case 'error':
                return '#EF4444';
            case 'no-events':
                return '#6B7280'; 
            default:
                return '#6B7280';
        }
    };


    return {
        callsData,
        isLoading,
        handleBackButton,
        getStatusColor,
    };
};

export default useStatisticsResult;
