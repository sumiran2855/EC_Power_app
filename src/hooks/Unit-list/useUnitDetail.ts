import { useState } from 'react';
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
        cellPhone: string;
    };
    dealer: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        cellPhone: string;
    };
    technician: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
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

const useUnitDetail = () => {
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

    const generalData: GeneralData = {
        systemName: {
            name: 'Manish 01',
            address: '102R, Barlin station',
            city: 'Berlin',
            postalCode: '8552',
            country: 'Germany',
            cellPhone: '+4598562110'
        },
        dealer: {
            name: '-',
            address: '-',
            city: '-',
            postalCode: '-',
            country: '-',
            cellPhone: '-'
        },
        technician: {
            name: '-',
            address: '-',
            city: '-',
            postalCode: '-',
            country: '-',
            cellPhone: '-'
        }
    };

    const lastCallData: LastCallData = {
        calls: '1979599994',
        timeOfCall: '02-11-24 15:14',
        operationStatus: {
            status: 'Stopped',
            noise: '0 minutes',
            oilPressure: 'NO',
            gasAlarm: 'NO'
        },
        controlPanelTemperature: '50%',
        controlPanelAntennaSignal: '90%'
    };

    const customerLoginData = {
        lastLogin: '25-09-2025'
    };

    const status2025Data: Status2025Data = {
        latestUpdate: '02-11-25 15:14',
        operatingHours: 'out of possible hours',
        lastService: '30-08-25 13:46',
        operationalHoursToNextService: '362h / Latest 30-08-26 13:46',
        elecProduction: 'kWh',
        heatProduction: 'kWh',
        fuelConsumption: 'kWh',
        firstCall: '23-06-20 M, 15:08',
        siteElecConsumption: '0',
        coveredByXRGISystem: '0',
        coveredByPowerPurchase: '0',
        soldElectricity: '0'
    };

    const existingConfigData = {
        configurationChanged: '18-09-24 13:55',
        heatPump1Efficiency: '0',
        highLoadWeekdays: '00:00-23:59',
        loadWeekdays: '00:00-23:59',
        electricitySales: 'No',
        senderCountry: 'England',
        serialNo: '460E92CEE4',
        operator: 'ETHERNET',
        systemXRGIType: 'Toyota 4Y 25.0 - Natural gas',
        heatPump2Efficiency: '0',
        highLoadSaturday: '00:00-23:59',
        loadSaturday: '00:00-23:59',
        saleWeekdays: '00:00-23:59',
        stopInLowLoad: 'No',
        versionNumber: '1.15.16',
        generation: '2',
        heatBackUp: 'No',
        highLoadSunday: '00:00-23:59',
        loadSunday: '00:00-23:59',
        saleSaturday: '00:00-23:59',
        consumptionInHighLoad: '24.0 kW',
        simCardNo: '5410:EC:9A:AF:9F',
        communicationType: 'Ethernet / Unknown',
        meterType: 'Unknown',
        saleSunday: '00:00-23:59',
        consumptionInLowLoad: '24.0 kW',
        terminalSerialNo: 'TMS60024Z3B3'
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
