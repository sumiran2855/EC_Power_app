import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";

export interface RegisterFormData {
    systemName: string;
    xrgiIdNumber: string;
    selectedModel: string;
    systemAddress: string;
    systemPostcode: string;
    systemCity: string;
    systemCountry: string;
    hasServiceContract: boolean | null;
    serviceProviderName: string;
    serviceProviderEmail: string;
    serviceProviderPhone: string;
    serviceCountryCode: string;
    isSalesPartnerSame: boolean | null;
    salesPartnerName: string;
    salesPartnerEmail: string;
    salesPartnerPhone: string;
    salesCountryCode: string;
    isSystemInstalled: boolean;
    energyCheckPlus: boolean;
    expectedAnnualSavings: string;
    expectedCO2Savings: string;
    expectedOperatingHours: string;
    industry: string;
    recipientEmails: string;
    distributeHoursEvenly: boolean;
    monthlyDistribution: Array<{
        month: string;
        percentage: string;
        hours: string;
    }>;
    installSmartPrice: boolean;
    installationTiming: 'next-visit' | 'asap';
}

export type XRGIDetailsScreenRouteProp = RouteProp<RootStackParamList, 'XRGI_Details'>;
export type XRGIDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface XRGIDetailsScreenProps {
    route: XRGIDetailsScreenRouteProp;
    navigation: XRGIDetailsScreenNavigationProp;
}

export interface EnergyRecord {
    id: string;
    month: string;
    year: string;
    xrgiId: string;
    records: {
        id: string;
        date: string;
        ecp: string;
        annualSavings: string;
        runtimeHours: string;
        serviceProvider: string;
    }[];
}

export const energyRecords: EnergyRecord[] = [
    {
        id: '1',
        month: 'August',
        year: '2025',
        xrgiId: '2100770084',
        records: [
            {
                id: '1-1',
                date: 'August 5, 2025',
                ecp: '$1244',
                annualSavings: '$20000',
                runtimeHours: '311 hrs',
                serviceProvider: 'TechCorp',
            },
            {
                id: '1-2',
                date: 'August 15, 2025',
                ecp: '$1340',
                annualSavings: '$21000',
                runtimeHours: '350 hrs',
                serviceProvider: 'TechCorp',
            }
        ]
    },
    {
        id: '2',
        month: 'June',
        year: '2025',
        xrgiId: '2100770084',
        records: [
            {
                id: '2-1',
                date: 'June 5, 2025',
                ecp: '$1244',
                annualSavings: '$20000',
                runtimeHours: '311 hrs',
                serviceProvider: 'TechCorp',
            },
        ]
    },
];