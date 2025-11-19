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