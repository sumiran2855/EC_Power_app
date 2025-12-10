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

export interface EnergyCheckPlusDetail {
    XRGI_ID: string;
    address: string;
    annualSavings: string;
    city: string;
    createdAt: string;
    energy_check_plus_saving: number;
    facilityId: string;
    id: string;
    operatingHours: string;
    postalCode: string;
    runtimeHours: number;
    salesPartner: {
        name?: string;
        email?: string;
        phone?: string;
    };
    serviceProvider: {
        name?: string;
        email?: string;
        phone?: string;
    };
    updatedAt: string;
    url: string;
    userId: string;
}

export interface EnergyCheckPlusResponse {
    data: EnergyCheckPlusDetail[];
    success: boolean;
}

export interface GroupedEnergyRecords {
    month: string;
    year: string;
    latestRecord: EnergyCheckPlusDetail;
}