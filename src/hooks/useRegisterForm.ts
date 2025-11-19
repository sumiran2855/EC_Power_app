import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FormData } from '../screens/authScreens/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

const useRegisterForm = (route?: RegisterScreenRouteProp) => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [formData, setFormData] = useState<FormData>({
        id: '',
        name: '',
        location: {
            address: '',
            postalCode: '',
            city: '',
            country: ''
        },
        status: '',
        xrgiID: '',
        modelNumber: '',
        userID: '',
        DaSigned: false,
        hasServiceContract: false,
        needServiceContract: false,
        distributeHoursEvenly: false,
        serviceProvider: {
            name: '',
            mailAddress: '',
            phone: '',
            countryCode: '+45'
        },
        salesPartner: {
            name: '',
            mailAddress: '',
            phone: '',
            countryCode: '+45',
            isSameAsServiceProvider: false
        },
        isSalesPartnerSame: false,
        EnergyCheck_plus: {
            annualSavings: '',
            co2Savings: '',
            operatingHours: '',
            industry: '',
            email: '',
            monthlyDistribution: {
                january: '0',
                february: '0',
                march: '0',
                april: '0',
                may: '0',
                june: '0',
                july: '0',
                august: '0',
                september: '0',
                october: '0',
                november: '0',
                december: '0'
            }
        },
        hasEnergyCheckPlus: false,
        smartPriceControl: undefined,
        installedSmartPriceController: false,
        smartPriceControlAdded: false,
        isInstalled: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Track if user has made a choice for service contract (for UI purposes)
    const [hasServiceContractChoice, setHasServiceContractChoice] = useState<boolean | null>(null);
    const [needServiceContractChoice, setNeedServiceContractChoice] = useState<boolean | null>(null);

    // Handle edit mode - populate form data when facility is provided
    useEffect(() => {
        if (route?.params?.editMode && route?.params?.facilityData) {
            const facility = route.params.facilityData;
            
            // Convert facility data to form format
            const editFormData: FormData = {
                id: facility.id || '',
                name: facility.name || '',
                location: {
                    address: facility.location?.address || '',
                    postalCode: facility.location?.postalCode || '',
                    city: facility.location?.city || '',
                    country: facility.location?.country || ''
                },
                status: facility.status || '',
                xrgiID: facility.xrgiID || '',
                modelNumber: facility.modelNumber || '',
                userID: '',
                DaSigned: facility.DaSigned || false,
                hasServiceContract: facility.hasServiceContract || false,
                needServiceContract: facility.needServiceContract || false,
                distributeHoursEvenly: facility.distributeHoursEvenly || false,
                serviceProvider: {
                    name: facility.serviceProvider?.name || '',
                    mailAddress: facility.serviceProvider?.mailAddress || '',
                    phone: facility.serviceProvider?.phone || '',
                    countryCode: facility.serviceProvider?.countryCode || '+45'
                },
                salesPartner: {
                    name: facility.salesPartner?.name || '',
                    mailAddress: facility.salesPartner?.mailAddress || '',
                    phone: facility.salesPartner?.phone || '',
                    countryCode: facility.salesPartner?.countryCode || '+45',
                    isSameAsServiceProvider: false
                },
                isSalesPartnerSame: false,
                EnergyCheck_plus: facility.EnergyCheck_plus ? {
                    annualSavings: facility.EnergyCheck_plus.annualSavings || '',
                    co2Savings: facility.EnergyCheck_plus.co2Savings || '',
                    operatingHours: facility.EnergyCheck_plus.operatingHours || '',
                    industry: facility.EnergyCheck_plus.industry || '',
                    email: facility.EnergyCheck_plus.email || '',
                    monthlyDistribution: facility.EnergyCheck_plus?.monthlyDistribution || {
                        january: '0',
                        february: '0',
                        march: '0',
                        april: '0',
                        may: '0',
                        june: '0',
                        july: '0',
                        august: '0',
                        september: '0',
                        october: '0',
                        november: '0',
                        december: '0'
                    }
                } : undefined,
                hasEnergyCheckPlus: facility.hasEnergyCheckPlus || false,
                smartPriceControl: facility.smartPriceControl,
                installedSmartPriceController: facility.installedSmartPriceController || false,
                smartPriceControlAdded: false,
                isInstalled: facility.isInstalled || false,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            setFormData(editFormData);
            
            // Initialize monthlyDistribution state if facility has EnergyCheck_plus data
            if (facility.EnergyCheck_plus?.monthlyDistribution) {
                const dist = facility.EnergyCheck_plus.monthlyDistribution;
                if (typeof dist === 'object' && !Array.isArray(dist)) {
                    setMonthlyDistribution({
                        January: parseFloat(dist.january || '0'),
                        February: parseFloat(dist.february || '0'),
                        March: parseFloat(dist.march || '0'),
                        April: parseFloat(dist.april || '0'),
                        May: parseFloat(dist.may || '0'),
                        June: parseFloat(dist.june || '0'),
                        July: parseFloat(dist.july || '0'),
                        August: parseFloat(dist.august || '0'),
                        September: parseFloat(dist.september || '0'),
                        October: parseFloat(dist.october || '0'),
                        November: parseFloat(dist.november || '0'),
                        December: parseFloat(dist.december || '0')
                    });
                }
            }
            
            // Set service contract choices based on facility data
            setHasServiceContractChoice(facility.hasServiceContract !== undefined ? facility.hasServiceContract : null);
            setNeedServiceContractChoice(facility.needServiceContract !== undefined ? facility.needServiceContract : null);
        }
    }, [route?.params?.editMode, route?.params?.facilityData]);

    // UI state
    const [showModelPicker, setShowModelPicker] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showServiceCountryCodePicker, setShowServiceCountryCodePicker] = useState(false);
    const [showSalesCountryCodePicker, setShowSalesCountryCodePicker] = useState(false);
    const [showIndustryPicker, setShowIndustryPicker] = useState(false);
    const [monthlyErrors, setMonthlyErrors] = useState<{ [key: string]: string }>({});
    const [totalPercentageError, setTotalPercentageError] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [distributeEvenly, setDistributeEvenly] = useState(true);
    const [monthlyDistribution, setMonthlyDistribution] = useState<{ [key: string]: number }>({
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0
    });
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

    const handleBackPress = () => {
        navigation.goBack();
    };

    // Form update handler with special handling for nested fields
    const updateFormData = (field: string, value: any) => {
        if (field.includes('.')) {
            const keys = field.split('.');
            setFormData(prev => {
                const updated = { ...prev };
                let current: any = updated;

                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) {
                        current[keys[i]] = {};
                    }
                    current = current[keys[i]];
                }

                current[keys[keys.length - 1]] = value;
                return updated;
            });
        } else {
            // Special handling for service contract choices
            if (field === 'hasServiceContract') {
                setHasServiceContractChoice(value);
                setFormData(prev => ({ ...prev, hasServiceContract: value }));

                // Reset needServiceContract when hasServiceContract is true
                if (value === true) {
                    setNeedServiceContractChoice(null);
                    setFormData(prev => ({ ...prev, needServiceContract: false }));
                }
                return;
            }

            if (field === 'needServiceContract') {
                setNeedServiceContractChoice(value);
                setFormData(prev => ({ ...prev, needServiceContract: value }));
                return;
            }

            // Special handling for EnergyCheck_plus toggle
            if (field === 'EnergyCheck_plus') {
                if (value === true || (typeof value === 'object' && value !== null)) {
                    // Initialize EnergyCheck_plus object when enabled
                    setFormData(prev => ({
                        ...prev,
                        EnergyCheck_plus: {
                            annualSavings: '',
                            co2Savings: '',
                            operatingHours: '',
                            industry: '',
                            email: '',
                            monthlyDistribution: {
                                january: '0',
                                february: '0',
                                march: '0',
                                april: '0',
                                may: '0',
                                june: '0',
                                july: '0',
                                august: '0',
                                september: '0',
                                october: '0',
                                november: '0',
                                december: '0'
                            }
                        },
                        hasEnergyCheckPlus: true
                    }));
                } else {
                    // Set to undefined when disabled
                    setFormData(prev => ({
                        ...prev,
                        EnergyCheck_plus: undefined,
                        hasEnergyCheckPlus: false
                    }));
                }
                return;
            }

            // Special handling for SmartPriceControl toggle
            if (field === 'installedSmartPriceController') {
                if (value === true) {
                    // Initialize smartPriceControl when enabled
                    setFormData(prev => ({
                        ...prev,
                        installedSmartPriceController: true,
                        smartPriceControlAdded: true,
                        smartPriceControl: {
                            method: 'as_soon_as_possible'
                        }
                    }));
                } else {
                    // Set to undefined when disabled
                    setFormData(prev => ({
                        ...prev,
                        installedSmartPriceController: false,
                        smartPriceControlAdded: false,
                        smartPriceControl: undefined
                    }));
                }
                return;
            }

            setFormData(prev => ({ ...prev, [field]: value }));
        }

        // Handle sales partner same logic
        if (field === 'isSalesPartnerSame' && value === true && formData.serviceProvider) {
            setFormData(prev => ({
                ...prev,
                salesPartner: {
                    name: formData.serviceProvider?.name || '',
                    mailAddress: formData.serviceProvider?.mailAddress || '',
                    phone: formData.serviceProvider?.phone || '',
                    countryCode: formData.serviceProvider?.countryCode || '+45',
                    isSameAsServiceProvider: true
                }
            }));
        } else if (field === 'isSalesPartnerSame' && value === false) {
            setFormData(prev => ({
                ...prev,
                salesPartner: {
                    name: '',
                    mailAddress: '',
                    phone: '',
                    countryCode: '+45',
                    isSameAsServiceProvider: false
                }
            }));
        }

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Calculate initial distribution when operating hours change
    useEffect(() => {
        if (formData.EnergyCheck_plus && formData.EnergyCheck_plus.operatingHours && distributeEvenly) {
            const operatingHours = parseFloat(formData.EnergyCheck_plus.operatingHours);
            if (!isNaN(operatingHours) && operatingHours > 0) {
                const newDistribution: { [key: string]: number } = {};
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                // Set 8.33% for first 11 months
                months.forEach((month, index) => {
                    if (index < 11) {
                        newDistribution[month] = 8.33;
                    } else {
                        // December gets the remaining percentage to total 100%
                        newDistribution[month] = 8.37;
                    }
                });

                setMonthlyDistribution(newDistribution);
            }
        }
    }, [formData.EnergyCheck_plus?.operatingHours, distributeEvenly]);

    const handleMonthlyPercentageChange = (month: string, value: string) => {
        setInputValues(prev => ({
            ...prev,
            [month]: value
        }));

        if (value === '' || value === '.' || value.endsWith('.')) {
            return;
        }

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            return;
        }

        if (numValue < 0 || numValue > 100) {
            setMonthlyErrors(prev => ({
                ...prev,
                [month]: 'Percentage must be between 0 and 100'
            }));
            return;
        }

        const operatingHours = parseFloat(formData.EnergyCheck_plus?.operatingHours || "0");
        const monthlyHours = (numValue / 100) * operatingHours;

        if (monthlyHours > 730) {
            const maxPercentage = (730 / operatingHours) * 100;
            setMonthlyDistribution(prev => ({
                ...prev,
                [month]: maxPercentage
            }));
            setMonthlyErrors(prev => ({
                ...prev,
                [month]: `Hours cannot exceed 730 per month (max: ${maxPercentage.toFixed(2)}%)`
            }));
        } else {
            setMonthlyDistribution(prev => ({
                ...prev,
                [month]: numValue
            }));
            setMonthlyErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[month];
                return newErrors;
            });
        }
    };

    const handleDistributeEvenlyChange = (checked: boolean) => {
        setDistributeEvenly(checked);

        if (checked) {
            const evenDistribution: { [key: string]: number } = {};
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            months.forEach((month, index) => {
                if (index < 11) {
                    evenDistribution[month] = 8.33;
                } else {
                    evenDistribution[month] = 8.37;
                }
            });

            setMonthlyDistribution(evenDistribution);
            setMonthlyErrors({});
            setInputValues({});
        } else {
            const initialInputValues: { [key: string]: string } = {};
            Object.entries(monthlyDistribution).forEach(([month, value]) => {
                initialInputValues[month] = value.toString();
            });
            setInputValues(initialInputValues);
        }
    };

    const calculateMonthlyHours = (percentage: number) => {
        if (!formData.EnergyCheck_plus?.operatingHours) return '0';
        const operatingHours = parseFloat(formData.EnergyCheck_plus.operatingHours);
        return ((percentage / 100) * operatingHours).toFixed(2);
    };

    const getTotalPercentage = () => {
        return Object.values(monthlyDistribution).reduce((sum, val) => sum + val, 0);
    };

    const isDistributionValid = () => {
        const total = getTotalPercentage();
        if (Math.abs(total - 100) > 0.01) return false;

        const operatingHours = parseFloat(formData.EnergyCheck_plus?.operatingHours || "0");
        return Object.values(monthlyDistribution).every(percentage => {
            const monthlyHours = (percentage / 100) * operatingHours;
            return monthlyHours <= 730;
        });
    };

    // Convert monthlyDistribution object to array format for rendering
    const getMonthlyDistributionArray = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months.map(month => ({
            month,
            percentage: monthlyDistribution[month] || 0,
            hours: calculateMonthlyHours(monthlyDistribution[month] || 0)
        }));
    };

    // Handle form submission
    const handleSubmit = (isInstall: boolean = false) => {
        let submissionData = { ...formData };

        if (!formData.EnergyCheck_plus || !formData.hasEnergyCheckPlus) {
            submissionData.EnergyCheck_plus = {} as any;
            submissionData.hasEnergyCheckPlus = false;
        } else {
            const monthlyDistributionData = {
                january: calculateMonthlyHours(monthlyDistribution.January || 0).toString(),
                february: calculateMonthlyHours(monthlyDistribution.February || 0).toString(),
                march: calculateMonthlyHours(monthlyDistribution.March || 0).toString(),
                april: calculateMonthlyHours(monthlyDistribution.April || 0).toString(),
                may: calculateMonthlyHours(monthlyDistribution.May || 0).toString(),
                june: calculateMonthlyHours(monthlyDistribution.June || 0).toString(),
                july: calculateMonthlyHours(monthlyDistribution.July || 0).toString(),
                august: calculateMonthlyHours(monthlyDistribution.August || 0).toString(),
                september: calculateMonthlyHours(monthlyDistribution.September || 0).toString(),
                october: calculateMonthlyHours(monthlyDistribution.October || 0).toString(),
                november: calculateMonthlyHours(monthlyDistribution.November || 0).toString(),
                december: calculateMonthlyHours(monthlyDistribution.December || 0).toString(),
            };

            submissionData.EnergyCheck_plus = {
                ...formData.EnergyCheck_plus,
                monthlyDistribution: monthlyDistributionData
            };
            submissionData.hasEnergyCheckPlus = true;
        }

        // Handle SmartPriceControl data
        if (!formData.installedSmartPriceController) {
            submissionData.smartPriceControl = undefined;
            submissionData.smartPriceControlAdded = false;
            submissionData.installedSmartPriceController = false;
        } else {
            if (!submissionData.smartPriceControl) {
                submissionData.smartPriceControl = {
                    method: 'as_soon_as_possible'
                };
            }
            submissionData.smartPriceControlAdded = true;
            submissionData.installedSmartPriceController = true;
        }

        setFormData(submissionData);

        const isValid = validateForm(isInstall);
        if (!isValid) return;

        if (formData.EnergyCheck_plus && formData.hasEnergyCheckPlus && !isDistributionValid()) {
            setTotalPercentageError(`Total percentage must equal 100%. Current: ${getTotalPercentage().toFixed(2)}%`);
            return;
        }

        navigation.navigate('Installation', { formData: submissionData });
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone: string) => {
        return phone.length >= 8 && /^\d+$/.test(phone);
    };

    const validateForm = (isInstall: boolean = false): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // System Details Validation
        if (!formData.name?.trim()) {
            newErrors.systemName = 'System name is required';
            isValid = false;
        }

        if (!formData.xrgiID?.trim()) {
            newErrors.xrgiIdNumber = 'XRGI ID Number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.xrgiID)) {
            newErrors.xrgiIdNumber = 'XRGI ID must be 10 digits';
            isValid = false;
        }

        if (!formData.modelNumber) {
            newErrors.selectedModel = 'Please select a model';
            isValid = false;
        }

        // XRGI Site Validation
        if (!formData.location?.address?.trim()) {
            newErrors.systemAddress = 'Address is required';
            isValid = false;
        }

        if (!formData.location?.postalCode?.trim()) {
            newErrors.systemPostcode = 'Postcode is required';
            isValid = false;
        }

        if (!formData.location?.city?.trim()) {
            newErrors.systemCity = 'City is required';
            isValid = false;
        }

        if (!formData.location?.country) {
            newErrors.systemCountry = 'Country is required';
            isValid = false;
        }

        // Service Contract Validation - only validate if hasServiceContract is true
        if (formData.hasServiceContract === true) {
            if (!formData.serviceProvider?.name?.trim()) {
                newErrors.serviceProviderName = 'Service provider name is required';
                isValid = false;
            }

            if (!formData.serviceProvider?.mailAddress?.trim()) {
                newErrors.serviceProviderEmail = 'Service provider email is required';
                isValid = false;
            } else if (!validateEmail(formData.serviceProvider.mailAddress)) {
                newErrors.serviceProviderEmail = 'Please enter a valid email address';
                isValid = false;
            }

            if (!formData.serviceProvider?.phone?.trim()) {
                newErrors.serviceProviderPhone = 'Service provider phone is required';
                isValid = false;
            } else if (!validatePhone(formData.serviceProvider.phone)) {
                newErrors.serviceProviderPhone = 'Phone number must be at least 8 digits';
                isValid = false;
            }
        }

        // Sales Partner Validation - only if different from service provider
        if ((formData.hasServiceContract === true || formData.needServiceContract === true) &&
            formData.isSalesPartnerSame === false) {
            if (!formData.salesPartner?.name?.trim()) {
                newErrors.salesPartnerName = 'Sales partner name is required';
                isValid = false;
            }

            if (!formData.salesPartner?.mailAddress?.trim()) {
                newErrors.salesPartnerEmail = 'Sales partner email is required';
                isValid = false;
            } else if (!validateEmail(formData.salesPartner.mailAddress)) {
                newErrors.salesPartnerEmail = 'Please enter a valid email address';
                isValid = false;
            }

            if (!formData.salesPartner?.phone?.trim()) {
                newErrors.salesPartnerPhone = 'Sales partner phone is required';
                isValid = false;
            } else if (!validatePhone(formData.salesPartner.phone)) {
                newErrors.salesPartnerPhone = 'Phone number must be at least 8 digits';
                isValid = false;
            }
        }

        // EnergyCheck Plus Validation - only if enabled and isInstall is true
        if (formData.isInstalled === true && isInstall && formData.hasEnergyCheckPlus) {
            if (formData.EnergyCheck_plus) {
                if (!formData.EnergyCheck_plus?.annualSavings?.trim()) {
                    newErrors.expectedAnnualSavings = 'Expected annual savings are required';
                    isValid = false;
                }

                if (!formData.EnergyCheck_plus?.co2Savings?.trim()) {
                    newErrors.expectedCO2Savings = 'Expected annual CO2 savings are required';
                    isValid = false;
                }

                if (!formData.EnergyCheck_plus?.operatingHours?.trim()) {
                    newErrors.expectedOperatingHours = 'Expected operating hours are required';
                    isValid = false;
                } else {
                    const hours = parseFloat(formData.EnergyCheck_plus.operatingHours);
                    if (isNaN(hours) || hours < 0 || hours > 8760) {
                        newErrors.expectedOperatingHours = 'Operating hours must be between 0 and 8760';
                        isValid = false;
                    }
                }

                if (!formData.EnergyCheck_plus?.email?.trim()) {
                    newErrors.recipientEmails = 'At least one recipient email is required';
                    isValid = false;
                } else {
                    const emails = formData.EnergyCheck_plus.email.split(',').map(email => email.trim()).filter(Boolean);
                    if (emails.length === 0) {
                        newErrors.recipientEmails = 'At least one recipient email is required';
                        isValid = false;
                    } else {
                        const invalidEmails = emails.filter(email => !validateEmail(email));
                        if (invalidEmails.length > 0) {
                            newErrors.recipientEmails = 'Please enter valid email addresses separated by commas';
                            isValid = false;
                        }
                    }
                }

                // Validate distribution if not evenly distributed
                if (!isDistributionValid()) {
                    newErrors.monthlyDistribution = `Total percentage must equal 100%. Current: ${getTotalPercentage().toFixed(2)}%`;
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Update monthly percentage (wrapper for compatibility)
    const updateMonthlyPercentage = (monthName: string, value: string) => {
        handleMonthlyPercentageChange(monthName, value);
    };

    // Calculate total hours from distribution
    const calculateTotalHours = (): string => {
        const operatingHours = parseFloat(formData.EnergyCheck_plus?.operatingHours || '0');
        return `${operatingHours.toFixed(0)}h`;
    };

    // Calculate total percentage from distribution
    const calculateTotalPercentage = (): string => {
        return `${getTotalPercentage().toFixed(2)}%`;
    };

    return {
        // Form state
        formData: {
            ...formData,
            EnergyCheck_plus: formData.EnergyCheck_plus ? {
                ...formData.EnergyCheck_plus,
                monthlyDistribution: getMonthlyDistributionArray() as any
            } : formData.EnergyCheck_plus
        },
        updateFormData,
        hasServiceContractChoice,
        needServiceContractChoice,

        // UI state
        showModelPicker,
        setShowModelPicker,
        showCountryPicker,
        setShowCountryPicker,
        showServiceCountryCodePicker,
        setShowServiceCountryCodePicker,
        showSalesCountryCodePicker,
        setShowSalesCountryCodePicker,
        showIndustryPicker,
        setShowIndustryPicker,
        monthlyErrors,
        totalPercentageError,
        errors,
        distributeEvenly,
        monthlyDistribution,
        inputValues,

        // Methods
        handleSubmit,
        updateMonthlyPercentage,
        handleMonthlyPercentageChange,
        handleDistributeEvenlyChange,
        calculateMonthlyHours,
        calculateTotalHours,
        calculateTotalPercentage,
        getTotalPercentage,
        isDistributionValid,
        handleBackPress,
    };
};

export default useRegisterForm;
