import { useState, useCallback } from 'react';

export interface Country {
  code: string;
  flag: string;
  name: string;
}

export interface ProfileData {
  businessName: string;
  vatNo: string;
  address: string;
  postalCode: string;
  city: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
}

const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    businessName: 'Gautam Adani',
    vatNo: '45200200',
    address: '102R, Auxerre street',
    postalCode: '4520',
    city: 'London',
    firstName: 'Gautam',
    lastName: 'Adani',
    email: 'sumiran@b.com',
    countryCode: '+44',
    mobile: '12000012',
  });

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: '+44',
    flag: '🇬🇧',
    name: 'United Kingdom'
  });

  // Country list
  const countries: Country[] = [
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
  ];

  const handleInputChange = useCallback((field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setProfileData(prev => ({
      ...prev,
      countryCode: country.code
    }));
    setShowCountryPicker(false);
  }, []);

  const handleSaveChanges = useCallback(() => {
  }, [profileData]);

  return {
    profileData,
    showCountryPicker,
    selectedCountry,
    countries,
    handleInputChange,
    handleCountrySelect,
    handleSaveChanges,
    setShowCountryPicker,
  };
};

export default useProfile;
