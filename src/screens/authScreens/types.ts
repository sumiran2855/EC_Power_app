export interface FormData {
    id: string;
    name: string;
    location: LocationInfo;
    status: string;
    xrgiID?: string;
    modelNumber: string;
    userID: string;
    DaSigned: boolean;
    hasServiceContract: boolean;
    needServiceContract: boolean;
    serviceProvider?: ServiceProviderInfo;
    salesPartner?: SalesPartnerInfo;
    isSalesPartnerSame?: boolean;
    EnergyCheck_plus?: EnergyCheckPlusInfo;
    hasEnergyCheckPlus: boolean;
    smartPriceControl?: SmartPriceControlInfo;
    smartPriceControlAdded?: boolean;
    installedSmartPriceController?: boolean;
    isInstalled: boolean;
    distributeHoursEvenly?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface LocationInfo {
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface ServiceProviderInfo {
    name: string;
    mailAddress: string;
    phone: string;
    countryCode: string;
}

export interface SalesPartnerInfo {
    name: string;
    mailAddress: string;
    phone: string;
    countryCode: string;
    isSameAsServiceProvider?: boolean;
}

export interface EnergyCheckPlusInfo {
    annualSavings?: string;
    co2Savings?: string;
    operatingHours?: string;
    industry?: string;
    email?: string;
    monthlyDistribution?: MonthlyDistribution;
}

export interface MonthlyDistribution {
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
}

export type SmartPriceControlInfo = {
    method?: 'On_Site_Visit' | 'as_soon_as_possible' | '';
}

export type StepperFormProps = {
    formData: FormData;
    updateFormData: (field: keyof FormData, value: any) => void;
    showCountryCodePicker: boolean;
    setShowCountryCodePicker: (show: boolean) => void;
    showContactCountryCodePicker: boolean;
    setShowContactCountryCodePicker: (show: boolean) => void;
    showServiceCountryCodePicker: boolean;
    setShowServiceCountryCodePicker: (show: boolean) => void;
    showSalesCountryCodePicker: boolean;
    setShowSalesCountryCodePicker: (show: boolean) => void;
    showModelPicker: boolean;
    setShowModelPicker: (show: boolean) => void;
    showIndustryPicker: boolean;
    setShowIndustryPicker: (show: boolean) => void;
    showCountryPicker: boolean;
    setShowCountryPicker: (show: boolean) => void;
    monthlyErrors: string[];
    totalPercentageError: string;
    updateMonthlyPercentage: (index: number, value: string) => void;
    distributeHoursEvenly: () => void;
    calculateTotalHours: () => string;
    calculateTotalPercentage: () => string;
    validateMonthHours: (hours: number, index: number) => void;
    validateTotalPercentage: () => void;
    onNext: () => void;
    onBack: () => void;
    onSaveForLater: () => void;
};

export type StepProps = Omit<StepperFormProps, 'formData' | 'updateFormData'> & {
    formData: ICustomer;
    updateFormData: <K extends keyof ICustomer | string>(
        field: K,
        value: K extends keyof ICustomer ? ICustomer[K] : any
    ) => void;
};

export const countryCodes = [
    { code: '+45', country: 'DK', flag: '🇩🇰' },
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
];

export const models = [
    'XRGI® 6 LOWNOX',
    'XRGI® 6',
    'XRGI® 9',
    'XRGI® 15',
    'XRGI® 15 BIO',
    'XRGI® 15 LOWNOX',
    'XRGI® 20',
    'XRGI® 25',
];

export const industries = [
    'Hotel',
    'School',
    'Sport',
    'NursingHome',
    'Industry',
    'Other',
];

export const country = [
    "England",
    "Germany",
    "Denmark",
    "Poland",
    "Italy",
    "Others",
];

export enum CustomerStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive'
}

export type RegisterFormData = {
    email: string;
    phone_number: string;
    name: string;
    verfication_method?: string;
    email_verified?: boolean;
    journeyStatus?: string;
    status?: CustomerStatus;
    password: string;
    group?: string;
    role?: string;
}

export interface UserData {
    id: string;
    email: string;
    role: string;
    group: string;
    status: string;
}

export interface Facility {
    id: string;
    name: string;
    xrgiID: string;
    status: 'Active' | 'Inactive' | 'Data Missing';
    modelNumber?: string;
    location?: LocationInfo;
    hasEnergyCheckPlus?: boolean;
    isInstalled?: boolean;
    hasServiceContract?: boolean;
    needServiceContract?: boolean;
    salesPartner?: SalesPartnerInfo;
    serviceProvider?: ServiceProviderInfo;
    DaSigned?: boolean;
    energyCheckPlus?: EnergyCheckPlusInfo;
    smartPriceControl?: SmartPriceControlInfo;
    installedSmartPriceController?: boolean;
    distributeHoursEvenly?: boolean;
}

export interface ICustomer {
    name: string;
    email?: string;
    phone_number: string;
    journeyStatus: string;
    companyInfo: companyInfo;
    contactPerson: contactPerson;
    status?: string;
    group?: string;
    type?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type companyInfo = {
    name?: string;
    cvrNumber: string;
    address: string;
    city: string;
    postal_code: string;
    email: string;
    countryCode?: string;
    phone: string;
}

export type contactPerson = {
    firstName: string;
    lastName: string;
    email: string;
    countryCode?: string;
    phone: string;
}
