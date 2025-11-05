import { useState } from 'react';

export interface IncidentData {
    dateOfIncident: string;
    incidentType: string;
    incidents: string;
    statusOfIncident: string;
}

export interface CallData {
    id: string;
    serialNumber: string;
    systemName: string;
    heatDistributor: string;
    timeOfCall: string;
    attemptedRedials: number;
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
    boilerReleased: string;
    controlPanelAntennaSignal: string;
    controlPanelPCBTemp: string;
    controlPanelPSUVoltage: string;
    powerUnitUPSAccumulator: string;
    powerUnitPCBTemp: string;
    heatDistributorPCBTemp: string;
    flowmasterPSUVoltage: string;
    flowmasterPCBTemp: string;
    surgeProtector: string;
    smartstarterLastError: string;
    incidents: IncidentData[];
}

interface UseCallDetailsResultReturn {
    callData: CallData;
    expandedIncidents: { [key: string]: boolean };
    handleBackButton: () => void;
    toggleIncident: (index: number) => void;
    navigateToHeatDistribution: () => void;
}

const useCallDetailsResult = (navigation: any): UseCallDetailsResultReturn => {
    const [expandedIncidents, setExpandedIncidents] = useState<{ [key: string]: boolean }>({});

    // Sample data - replace with your actual data
    const callData: CallData = {
        id: "1",
        serialNumber: "2000799148",
        systemName: "XRGI® 6 LOWNOX",
        heatDistributor: "Heat Distributor",
        timeOfCall: "02-11-24 15:14",
        attemptedRedials: 0,
        softwareValidated: 1,
        actualStatus: "0. Full Stop",
        statusColor: "#F59E0B",
        stopped: "698 hours 36 minutes",
        operationalHoursToNextService: "3629 hours",
        operatingHours: "12373 hours",
        actualElecProduced: "1W",
        forcedStandby: "No",
        loadLevel: "0%(VkP mode only)",
        storageLevel: "100%",
        oilPressure: "No",
        smartstarterBoardTemp: "ABSENT",
        boilerReleased: "N/A",
        controlPanelAntennaSignal: "0 (Max: 31)",
        controlPanelPCBTemp: "24.50 °C",
        controlPanelPSUVoltage: "24.1V",
        powerUnitUPSAccumulator: "Error",
        powerUnitPCBTemp: "27.4 °C",
        heatDistributorPCBTemp: "29.50 °C",
        flowmasterPSUVoltage: "0.0V",
        flowmasterPCBTemp: "Not available",
        surgeProtector: "Ok",
        smartstarterLastError: "000",
        incidents: [
            {
                dateOfIncident: "25-06-16 16:37",
                incidentType: "-",
                incidents: "-",
                statusOfIncident: "-"
            },
            {
                dateOfIncident: "25-06-16 16:37",
                incidentType: "-",
                incidents: "-",
                statusOfIncident: "-"
            }
        ]
    };

    const handleBackButton = () => {
        navigation.goBack();
    };

    const toggleIncident = (index: number) => {
        setExpandedIncidents(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const navigateToHeatDistribution = () => {
        navigation.navigate('HeatDistribution');
    };

    return {
        callData,
        expandedIncidents,
        handleBackButton,
        toggleIncident,
        navigateToHeatDistribution
    };
};

export default useCallDetailsResult;