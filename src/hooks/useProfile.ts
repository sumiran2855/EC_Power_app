import { UserController } from '@/controllers/UserController';
import { UserData } from '@/screens/authScreens/types';
import StorageService from '@/utils/secureStorage';
import { useCallback, useEffect, useState } from 'react';
import { countries, Country, ProfileData } from './types';

const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    companyName: '',
    companyInfo: {
      address: '',
      city: '',
      phone: '',
      countryCode: null,
      companyName: '',
      name: '',
      postal_code: '',
      cvrNumber: '',
      email: '',
    },
    contactPerson:{
      firstName: '',
      lastName: '',
      personalEmail: '',
      personalPhone: '',
      personalCountryCode: '',
    },
    role: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: '+44',
    flag: '🇬🇧',
    name: 'United Kingdom'
  });


  const parsePhoneNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber) return { countryCode: '+44', phoneNumber: '' };

    for (const country of countries) {
      if (phoneNumber.startsWith(country.code)) {
        return {
          countryCode: country.code,
          phoneNumber: phoneNumber.slice(country.code.length)
        };
      }
    }

    return { countryCode: '+44', phoneNumber };
  }, [countries]);

  const handleInputChange = useCallback((field: keyof ProfileData | keyof ProfileData['companyInfo'] | keyof ProfileData['contactPerson'], value: string) => {
    setProfileData(prev => {
      if (field in prev.companyInfo) {
        return {
          ...prev,
          companyInfo: {
            ...prev.companyInfo,
            [field]: value
          }
        };
      } else if (field in prev.contactPerson) {
        return {
          ...prev,
          contactPerson: {
            ...prev.contactPerson,
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
  }, []);

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setProfileData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        countryCode: country.code
      }
    }));
    setShowCountryPicker(false);
  }, []);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    const userData = await StorageService.user.getData<UserData>();
    if (!userData?.id) {
      return;
    }

    try {
      const response = await UserController.getCustomerDetail(userData?.id)
      if (!response!.success) {
        return;
      }

      const profileData = response!.data;
      setProfileData(profileData);

      const countryCodeToUse = profileData.contactPerson?.personalCountryCode || 
                              (profileData.phone_number ? parsePhoneNumber(profileData.phone_number).countryCode : null);
      
      if (countryCodeToUse) {
        const country = countries.find(c => c.code === countryCodeToUse);
        if (country) {
          setSelectedCountry(country);
        }
      }
      
      if (profileData.phone_number) {
        const { phoneNumber } = parsePhoneNumber(profileData.phone_number);
        setProfileData(prev => ({
          ...prev,
          phone_number: phoneNumber,
          companyInfo: {
            ...prev.companyInfo,
            countryCode: countryCodeToUse || ''
          }
        }));
      }
    } catch (error) {
      console.log("Error getting user profile", error);
    } finally {
      setLoading(false);
    }
  }, [parsePhoneNumber, countries]);

  const handleSaveChanges = useCallback(async () => {
    setLoading(true);
    const userData = await StorageService.user.getData<UserData>();
    if (!userData?.email) {
      return;
    }

    try {
      const updatedProfileData = {
        ...profileData,
        phone_number: profileData.phone_number ? `${selectedCountry.code}${profileData.phone_number}` : '',
        companyInfo: {
          ...profileData.companyInfo,
          countryCode: selectedCountry.code
        },
        contactPerson: {
          ...profileData.contactPerson,
          personalCountryCode: selectedCountry.code
        }
      };

      delete (updatedProfileData as any).createdAt;
      delete (updatedProfileData as any).updatedAt;
      delete (updatedProfileData as any).id;

      const response = await UserController.UpdateUserProfile(userData.email, updatedProfileData);
      if (response?.success) {
        await getUserProfile();
      }
    } catch (error) {
      console.log("Error updating profile", error);
    } finally {
      setLoading(false);
    }
  }, [profileData, selectedCountry, getUserProfile]);

  useEffect(() => {
    getUserProfile();
  }, []);

  return {
    profileData,
    showCountryPicker,
    selectedCountry,
    countries,
    handleInputChange,
    handleCountrySelect,
    handleSaveChanges,
    setShowCountryPicker,
    loading,
  };
};

export default useProfile;
