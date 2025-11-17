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
    monthlyDistribution?: MonthlyDistribution[];
}

export interface MonthlyDistribution {
    month: string;
    percentage: string;
    hours: string;
    editable?: boolean;
}

export type SmartPriceControlInfo = {
    method?: 'On_Site_Visit' | 'as_soon_as_possible' | '';
}

export type StepperFormSharedProps = {
    updateFormData: (...args: any[]) => void,
    showCountryCodePicker: boolean,
    setShowCountryCodePicker: React.Dispatch<React.SetStateAction<boolean>>,
    showContactCountryCodePicker?: boolean,
    setShowContactCountryCodePicker?: React.Dispatch<React.SetStateAction<boolean>>,
    showServiceCountryCodePicker?: boolean,
    setShowServiceCountryCodePicker?: React.Dispatch<React.SetStateAction<boolean>>,
    showSalesCountryCodePicker?: boolean,
    setShowSalesCountryCodePicker?: React.Dispatch<React.SetStateAction<boolean>>,
    showModelPicker?: boolean,
    setShowModelPicker?: React.Dispatch<React.SetStateAction<boolean>> | undefined,
    showIndustryPicker?: boolean,
    setShowIndustryPicker?: React.Dispatch<React.SetStateAction<boolean>> | undefined,
    showCountryPicker?: boolean,
    setShowCountryPicker?: React.Dispatch<React.SetStateAction<boolean>> | undefined,
    monthlyErrors?: string[],
    totalPercentageError?: string,
    updateMonthlyPercentage?: (idx: number, value: string) => void,
    distributeHoursEvenly?: () => void,
    calculateTotalHours?: () => string,
    calculateTotalPercentage?: () => string,
    validateMonthHours?: (hours: number, index: number) => void,
    validateTotalPercentage?: () => void,
    errors: Record<string, string>,
    onNext: () => void,
    onBack: () => void,
    onSaveForLater?: () => void,
};

export interface ProfileStepProps extends StepperFormSharedProps {
    formData: ICustomer;
    updateFormData: (field: keyof ICustomer, value: ICustomer[keyof ICustomer]) => void;
}

export interface SystemRegisterStepProps extends StepperFormSharedProps {
    formData: FormData;
    updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void;
}

export interface SmartPriceStepProps extends StepperFormSharedProps {
    formData: FormData;
    updateFormData: (field: keyof FormData, value: FormData[keyof FormData]) => void;
}

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
