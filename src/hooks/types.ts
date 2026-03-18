export interface Country {
    code: string;
    flag: string;
    name: string;
}

export interface ProfileData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone_number: string;
    companyName: string;
    companyInfo: {
        address: string;
        city: string;
        phone: string;
        countryCode: string | null;
        companyName: string;
        name: string;
        postal_code: string;
        cvrNumber: string;
        email: string;
    };
    contactPerson:{
        firstName: string;
        lastName: string;
        personalEmail: string;
        personalPhone: string;
        personalCountryCode: string;
    }
    role: string;
    status: string;
}

// Country list
export const countries: Country[] = [
    { code: '+1', flag: '🇺🇸', name: 'US/CA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+91', flag: '🇮🇳', name: 'IN' },
    { code: '+86', flag: '🇨🇳', name: 'CN' },
    { code: '+81', flag: '🇯🇵', name: 'JP' },
    { code: '+49', flag: '🇩🇪', name: 'DE' },
];

export interface MenuItem {
    id: string;
    title: string;
    icon: string;
    hasData?: boolean;
}

export interface GeneralData {
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

export interface LastCallData {
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

export interface StatusData {
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

export type SystemStatus = 'idle' | 'running' | 'stopped';
export type AlertType = 'success' | 'error' | 'warning' | 'info';