export interface FormData {
    companyName: string;
    vatNo: string;
    address: string;
    postcode: string;
    city: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    contactEmail: string;
    contactPhone: string;
    countryCode: string;
    contactCountryCode: string;
    installSmartPrice: boolean;
    installationTiming: 'next-visit' | 'asap';
    systemName: string;
    xrgiIdNumber: string;
    selectedModel: string;
    systemAddress: string;
    systemPostcode: string;
    systemCity: string;
    systemCountry: string;
    hasServiceContract: boolean | null;
    interestedInServiceContract: boolean | null;
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
    monthlyDistribution: {
        month: string;
        percentage: string;
        hours: string;
        editable: boolean;
    }[];
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
    formData: FormData;
    updateFormData: (field: keyof FormData, value: any) => void;
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
