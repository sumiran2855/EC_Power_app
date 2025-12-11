import { RegisterController } from '@/controllers/RegisterController';
import { StepperController } from '@/controllers/StepperController';
import { useEffect, useRef, useState } from 'react';
import { FormData, ICustomer } from '../screens/authScreens/types';
import StorageService from '../utils/secureStorage';

export const useStepperForm = () => {
    const daSignedRef = useRef(false);
    const smartPriceControlAddedRef = useRef(false);
    const smartPriceControlMethodRef = useRef('');

    const [currentStep, setCurrentStep] = useState(1);
    const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
    const [showContactCountryCodePicker, setShowContactCountryCodePicker] = useState(false);
    const [showServiceCountryCodePicker, setShowServiceCountryCodePicker] = useState(false);
    const [showSalesCountryCodePicker, setShowSalesCountryCodePicker] = useState(false);
    const [showModelPicker, setShowModelPicker] = useState(false);
    const [showIndustryPicker, setShowIndustryPicker] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [monthlyErrors, setMonthlyErrors] = useState<string[]>(Array(12).fill(''));
    const [totalPercentageError, setTotalPercentageError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        phone_number: '',
        journeyStatus: 'facilityInfo',
        companyInfo: {
            name: '',
            cvrNumber: '',
            address: '',
            city: '',
            postal_code: '',
            email: '',
            phone: '',
            countryCode: '+1'
        },
        contactPerson: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            countryCode: '+1'
        },
        status: 'active',
        type: 'Customer',
        role: 'Customer',
        countryCode: '+1',
        contactCountryCode: '+1',
        installSmartPrice: false,
        installationTiming: 'asap',
        systemName: '',
        xrgiIdNumber: '',
        selectedModel: '',
        systemAddress: '',
        systemPostcode: '',
        systemCity: '',
        systemCountry: '',
        hasServiceContract: false,
        interestedInServiceContract: null,
        serviceProviderName: '',
        serviceProviderEmail: '',
        serviceProviderPhone: '',
        serviceCountryCode: '+1',
        isSalesPartnerSame: false,
        salesPartnerName: '',
        salesPartnerEmail: '',
        salesPartnerPhone: '',
        salesCountryCode: '+1',
        isSystemInstalled: false,
        energyCheckPlus: false,
        expectedAnnualSavings: '',
        expectedCO2Savings: '',
        expectedOperatingHours: '',
        industry: '',
        recipientEmails: '',
        distributeHoursEvenly: true,
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
        monthlyDistribution: [
            { month: 'January', percentage: '8.33', hours: '0', editable: true },
            { month: 'February', percentage: '8.33', hours: '0', editable: true },
            { month: 'March', percentage: '8.33', hours: '0', editable: true },
            { month: 'April', percentage: '8.33', hours: '0', editable: true },
            { month: 'May', percentage: '8.33', hours: '0', editable: true },
            { month: 'June', percentage: '8.33', hours: '0', editable: true },
            { month: 'July', percentage: '8.33', hours: '0', editable: true },
            { month: 'August', percentage: '8.33', hours: '0', editable: true },
            { month: 'September', percentage: '8.33', hours: '0', editable: true },
            { month: 'October', percentage: '8.33', hours: '0', editable: true },
            { month: 'November', percentage: '8.33', hours: '0', editable: true },
            { month: 'December', percentage: '8.37', hours: '0', editable: true },
        ],
        smartPriceControlAdded: false,
        smartPriceControl: {
            method: ''
        },
        hasEnergyCheckPlus: false,
        DaSigned: false,
    });

    const getStepFromJourneyStatus = (status: string): number => {
        switch (status) {
            case 'profileInfo':
                return 1;
            case 'facilityInfo':
                return 2;
            case 'smartPriceControlInfo':
                return 3;
            case 'completed':
                return 4;
            default:
                return 1;
        }
    };

    const getNextJourneyStatus = (currentStep: number): string => {
        switch (currentStep) {
            case 1:
                return 'facilityInfo';
            case 2:
                return 'smartPriceControlInfo';
            case 3:
                return 'completed';
            default:
                return 'completed';
        }
    };

    useEffect(() => {
        const initializeStep = async () => {
            try {
                const userData = await StorageService.user.getData<ICustomer>();
                if (userData && userData.journeyStatus) {
                    const step = getStepFromJourneyStatus(userData.journeyStatus);
                    setCurrentStep(step);
                    setFormData((prev: any) => ({ ...prev, journeyStatus: userData.journeyStatus }));
                }
            } catch (error) {
                console.log('Error initializing step:', error);
                setCurrentStep(1);
            }
        };

        initializeStep();
    }, []);

    useEffect(() => {
        if (formData.EnergyCheck_plus?.operatingHours && formData.distributeHoursEvenly) {
            distributeHoursEvenly();
        }
    }, [formData.EnergyCheck_plus?.operatingHours, formData.distributeHoursEvenly]);

    const updateFormData = (field: keyof FormData, value: any) => {
        if (field === 'DaSigned') {
            daSignedRef.current = value;
        }

        if (field === 'smartPriceControlAdded') {
            smartPriceControlAddedRef.current = value;
        }

        if (field === 'smartPriceControl') {
            smartPriceControlMethodRef.current = value?.method || '';
        }

        if (field === 'EnergyCheck_plus' && (typeof value === 'boolean' || value === true)) {
            if (value === true) {
                setFormData((prev: FormData) => ({
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
                    }
                }));
            } else {
                setFormData((prev: FormData) => ({
                    ...prev,
                    EnergyCheck_plus: undefined
                }));
            }
            return;
        }

        setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    };

    const distributeHoursEvenly = () => {
        const totalHours = parseFloat(formData.EnergyCheck_plus?.operatingHours || '0') || 0;
        const hoursPerMonth = totalHours / 12;
        const percentagePerMonth = (100 / 12);

        const newDistribution = [
            { month: 'January', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'February', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'March', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'April', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'May', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'June', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'July', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'August', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'September', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'October', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'November', percentage: percentagePerMonth.toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
            { month: 'December', percentage: (percentagePerMonth + 0.04).toFixed(2), hours: hoursPerMonth.toFixed(2), editable: true },
        ];

        const energyCheckDistribution: { [key: string]: string } = {};
        newDistribution.forEach(month => {
            const monthKey = month.month.toLowerCase();
            energyCheckDistribution[monthKey] = month.hours;
        });

        setFormData((prev: FormData) => ({
            ...prev,
            monthlyDistribution: newDistribution,
            EnergyCheck_plus: prev.EnergyCheck_plus ? {
                ...prev.EnergyCheck_plus,
                monthlyDistribution: energyCheckDistribution
            } : undefined
        }));

        setMonthlyErrors(Array(12).fill(''));
        setTotalPercentageError('');
    };

    const validateMonthHours = (hours: number, index: number) => {
        const errors = [...monthlyErrors];
        if (hours > 730) {
            errors[index] = 'Hours cannot exceed 730 per month';
        } else {
            errors[index] = '';
        }
        setMonthlyErrors(errors);
    };

    const validateTotalPercentage = () => {
        const monthlyDistribution = formData.monthlyDistribution || [];
        const total = monthlyDistribution.reduce((sum: number, month: { percentage: string; hours: string }) => {
            return sum + (parseFloat(month.percentage) || 0);
        }, 0);

        if (total > 100) {
            setTotalPercentageError('Total percentage cannot exceed 100%');
        } else if (total < 100) {
            setTotalPercentageError('Total percentage should equal 100%');
        } else {
            setTotalPercentageError('');
        }
    };

    const updateMonthlyPercentage = (monthName: string, value: string) => {
        const totalHours = parseFloat(formData.EnergyCheck_plus?.operatingHours || '0') || 0;
        const percentage = parseFloat(value) || 0;
        const hours = (totalHours * percentage) / 100;

        const monthlyDistribution = formData.monthlyDistribution || [];
        const newDistribution = [...monthlyDistribution];
        const monthIndex = newDistribution.findIndex((month: { month: string; percentage: string; hours: string }) => month.month === monthName);

        if (monthIndex !== -1) {
            newDistribution[monthIndex] = {
                ...newDistribution[monthIndex],
                percentage: value,
                hours: hours.toFixed(2),
            };

            const energyCheckDistribution: { [key: string]: string } = {};
            newDistribution.forEach(month => {
                const monthKey = month.month.toLowerCase();
                energyCheckDistribution[monthKey] = month.hours;
            });

            setFormData((prev: FormData) => ({
                ...prev,
                monthlyDistribution: newDistribution,
                EnergyCheck_plus: prev.EnergyCheck_plus ? {
                    ...prev.EnergyCheck_plus,
                    monthlyDistribution: energyCheckDistribution
                } : undefined
            }));

            validateMonthHours(hours, monthIndex);
            setTimeout(validateTotalPercentage, 0);
        }
    };

    const calculateTotalHours = () => {
        const monthlyDistribution = formData.monthlyDistribution || [];
        const total = monthlyDistribution.reduce((sum: number, month: { percentage: string; hours: string }) => {
            const hours = parseFloat(month.hours) || 0;
            return sum + hours;
        }, 0);
        return `${total.toFixed(0)}h`;
    };

    const calculateTotalPercentage = () => {
        const monthlyDistribution = formData.monthlyDistribution || [];
        const total = monthlyDistribution.reduce((sum: number, month: { percentage: string; hours: string }) => {
            const percentage = parseFloat(month.percentage) || 0;
            return sum + percentage;
        }, 0);
        return `${total.toFixed(2)}%`;
    };

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone: string) => {
        return phone.length >= 8 && /^\d+$/.test(phone);
    };

    const validateRequired = (value: string, fieldName: string) => {
        if (!value || value.trim() === '') {
            return `${fieldName} is required`;
        }
        return '';
    };

    const validateSystemRegistrationStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

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

        if (!formData.location.address?.trim()) {
            newErrors.systemAddress = 'Address is required';
            isValid = false;
        }

        if (!formData.location.postalCode?.trim()) {
            newErrors.systemPostcode = 'Postcode is required';
            isValid = false;
        }

        if (!formData.location.city?.trim()) {
            newErrors.systemCity = 'City is required';
            isValid = false;
        }

        if (!formData.location.country) {
            newErrors.systemCountry = 'Country is required';
            isValid = false;
        }

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
            } else if (!validatePhone(formData.serviceProvider?.phone)) {
                newErrors.serviceProviderPhone = 'Phone number must be at least 8 digits';
                isValid = false;
            }

            if (formData.isSalesPartnerSame === false) {
                if (!formData.salesPartner?.name?.trim()) {
                    newErrors.salesPartnerName = 'Sales partner name is required';
                    isValid = false;
                }

                if (!formData.salesPartner?.mailAddress?.trim()) {
                    newErrors.salesPartnerEmail = 'Sales partner email is required';
                    isValid = false;
                } else if (!validateEmail(formData.salesPartner?.mailAddress)) {
                    newErrors.salesPartnerEmail = 'Please enter a valid email address';
                    isValid = false;
                }

                if (!formData.salesPartner?.phone?.trim()) {
                    newErrors.salesPartnerPhone = 'Sales partner phone is required';
                    isValid = false;
                } else if (!validatePhone(formData.salesPartner?.phone)) {
                    newErrors.salesPartnerPhone = 'Phone number must be at least 8 digits';
                    isValid = false;
                }
            }
        }

        if (formData.hasEnergyCheckPlus) {
            if (!formData.EnergyCheck_plus?.operatingHours?.trim()) {
                newErrors.expectedOperatingHours = 'Expected operating hours are required';
                isValid = false;
            } else {
                const hours = parseFloat(formData.EnergyCheck_plus?.operatingHours);
                if (isNaN(hours) || hours < 0 || hours > 8760) {
                    newErrors.expectedOperatingHours = 'Operating hours must be between 0 and 8760';
                    isValid = false;
                }
            }

            if (!formData.EnergyCheck_plus?.email?.trim()) {
                newErrors.recipientEmails = 'At least one recipient email is required';
                isValid = false;
            } else {
                const emails = formData.EnergyCheck_plus?.email.split(',').map((email: any) => email.trim()).filter(Boolean);
                if (emails.length === 0) {
                    newErrors.recipientEmails = 'At least one recipient email is required';
                    isValid = false;
                } else {
                    const invalidEmails = emails.filter((email: any) => !validateEmail(email));
                    if (invalidEmails.length > 0) {
                        newErrors.recipientEmails = 'Please enter valid email addresses separated by commas';
                        isValid = false;
                    }
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateProfileStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        const companyNameError = validateRequired(formData.companyInfo?.name, 'Company name');
        if (companyNameError) {
            newErrors.companyName = companyNameError;
            isValid = false;
        }

        const vatNoError = validateRequired(formData.companyInfo?.cvrNumber, 'VAT number');
        if (vatNoError) {
            newErrors.vatNo = vatNoError;
            isValid = false;
        }

        const addressError = validateRequired(formData.companyInfo?.address, 'Address');
        if (addressError) {
            newErrors.address = addressError;
            isValid = false;
        }

        const postcodeError = validateRequired(formData.companyInfo?.postal_code, 'Postcode');
        if (postcodeError) {
            newErrors.postcode = postcodeError;
            isValid = false;
        }

        const cityError = validateRequired(formData.companyInfo?.city, 'City');
        if (cityError) {
            newErrors.city = cityError;
            isValid = false;
        }

        const emailError = validateRequired(formData.companyInfo?.email, 'Email');
        if (emailError) {
            newErrors.email = emailError;
            isValid = false;
        } else if (!validateEmail(formData.companyInfo?.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        const phoneError = validateRequired(formData.companyInfo?.phone, 'Phone number');
        if (phoneError) {
            newErrors.phone = phoneError;
            isValid = false;
        } else if (!validatePhone(formData.companyInfo?.phone)) {
            newErrors.phone = 'Phone number must be at least 8 digits';
            isValid = false;
        }

        const firstNameError = validateRequired(formData.contactPerson?.firstName, 'First name');
        if (firstNameError) {
            newErrors.firstName = firstNameError;
            isValid = false;
        }

        const lastNameError = validateRequired(formData.contactPerson?.lastName, 'Last name');
        if (lastNameError) {
            newErrors.lastName = lastNameError;
            isValid = false;
        }

        const contactEmailError = validateRequired(formData.contactPerson?.email, 'Contact email');
        if (contactEmailError) {
            newErrors.contactEmail = contactEmailError;
            isValid = false;
        } else if (!validateEmail(formData.contactPerson?.email)) {
            newErrors.contactEmail = 'Please enter a valid email address';
            isValid = false;
        }

        const contactPhoneError = validateRequired(formData.contactPerson?.phone, 'Contact phone number');
        if (contactPhoneError) {
            newErrors.contactPhone = contactPhoneError;
            isValid = false;
        } else if (!validatePhone(formData.contactPerson?.phone)) {
            newErrors.contactPhone = 'Phone number must be at least 8 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const createFacilityPayload = () => {
        const daSignedValue = daSignedRef.current || formData.DaSigned || false;
        const smartPriceControlAddedValue = smartPriceControlAddedRef.current;
        const smartPriceControlMethodValue = smartPriceControlMethodRef.current;

        // Prepare monthlyDistribution for EnergyCheck_plus
        const monthlyDistributionObj: { [key: string]: string } = {};
        if (formData.hasEnergyCheckPlus && formData.monthlyDistribution) {
            formData.monthlyDistribution.forEach((month: any) => {
                const monthKey = month.month.toLowerCase();
                monthlyDistributionObj[monthKey] = month.hours;
            });
        }

        // Build the clean payload with only required fields
        const payload: any = {
            id: '',
            name: formData.name || '',
            location: {
                address: formData.location?.address || '',
                postalCode: formData.location?.postalCode || '',
                city: formData.location?.city || '',
                country: formData.location?.country || ''
            },
            status: 'Active',
            xrgiID: formData.xrgiID || '',
            modelNumber: formData.modelNumber || '',
            userID: 'temp-user-id',
            DaSigned: daSignedValue,
            hasServiceContract: formData.hasServiceContract || false,
            needServiceContract: formData.needServiceContract || false,
            distributeHoursEvenly: formData.distributeHoursEvenly || false,
            isSalesPartnerSame: formData.isSalesPartnerSame || false,
            isInstalled: formData.isInstalled || false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Add serviceProvider only if hasServiceContract is true
        if (formData.hasServiceContract && formData.serviceProvider) {
            payload.serviceProvider = {
                name: formData.serviceProvider.name || '',
                mailAddress: formData.serviceProvider.mailAddress || '',
                phone: formData.serviceProvider.phone || '',
                countryCode: formData.serviceProvider.countryCode || '+45'
            };
        } else {
            payload.serviceProvider = {
                name: '',
                mailAddress: '',
                phone: '',
                countryCode: '+45'
            };
        }

        // Add salesPartner based on isSalesPartnerSame flag
        if (formData.isSalesPartnerSame === false && formData.salesPartner) {
            payload.salesPartner = {
                name: formData.salesPartner.name || '',
                mailAddress: formData.salesPartner.mailAddress || '',
                phone: formData.salesPartner.phone || '',
                countryCode: formData.salesPartner.countryCode || '+45',
                isSameAsServiceProvider: false
            };
        } else if (formData.isSalesPartnerSame === true && payload.serviceProvider) {
            // When isSalesPartnerSame is true, populate salesPartner with serviceProvider details
            payload.salesPartner = {
                name: payload.serviceProvider.name || '',
                mailAddress: payload.serviceProvider.mailAddress || '',
                phone: payload.serviceProvider.phone || '',
                countryCode: payload.serviceProvider.countryCode || '+45',
                isSameAsServiceProvider: true
            };
        } else {
            payload.salesPartner = {
                name: '',
                mailAddress: '',
                phone: '',
                countryCode: '+45',
                isSameAsServiceProvider: formData.isSalesPartnerSame || false
            };
        }

        // Add EnergyCheck_plus only if enabled
        if (formData.hasEnergyCheckPlus && formData.EnergyCheck_plus) {
            payload.hasEnergyCheckPlus = true;
            payload.EnergyCheck_plus = {
                annualSavings: formData.EnergyCheck_plus.annualSavings || '',
                co2Savings: formData.EnergyCheck_plus.co2Savings || '',
                operatingHours: formData.EnergyCheck_plus.operatingHours || '',
                industry: formData.EnergyCheck_plus.industry || '',
                email: formData.EnergyCheck_plus.email || '',
                monthlyDistribution: monthlyDistributionObj
            };
        } else {
            payload.hasEnergyCheckPlus = false;
            payload.EnergyCheck_plus = {
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
            };
        }

        // Add smartPriceControl only if enabled
        if (smartPriceControlAddedValue) {
            payload.smartPriceControlAdded = true;
            payload.installedSmartPriceController = true;
            payload.smartPriceControl = {
                method: smartPriceControlMethodValue || 'as_soon_as_possible'
            };
        } else {
            payload.smartPriceControlAdded = false;
            payload.installedSmartPriceController = false;
            payload.smartPriceControl = undefined;
        }

        return payload;
    };

    const nextStep = async () => {
    if (currentStep === 1) {
        if (!validateProfileStep()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const profileData: ICustomer = {
                name: formData.companyInfo?.name || formData.name,
                phone_number: formData.countryCode + formData.companyInfo?.phone,
                journeyStatus: formData.journeyStatus || 'facilityInfo',
                companyInfo: {
                    name: formData.companyInfo?.name,
                    cvrNumber: formData.companyInfo?.cvrNumber || '',
                    address: formData.companyInfo?.address || '',
                    city: formData.companyInfo?.city || '',
                    postal_code: formData.companyInfo?.postal_code || '',
                    email: formData.companyInfo?.email || '',
                    phone: formData.countryCode + formData.companyInfo?.phone
                },
                contactPerson: {
                    firstName: formData.contactPerson?.firstName,
                    lastName: formData.contactPerson?.lastName,
                    email: formData.contactPerson?.email,
                    phone: formData.countryCode + formData.contactPerson?.phone
                },
            };

            let result;
            if (formData.id) {
                result = await StepperController.UpdateProfile(profileData, formData.id);
            } else {
                result = await StepperController.CreateProfile(profileData);
            }

            if (!result.success) {
                console.log('Profile creation failed:', result.error);
                setErrors({ ...errors, apiError: result.error || 'Failed to create profile' });
                setIsSubmitting(false);
                return;
            }

            const nextStatus = getNextJourneyStatus(currentStep);
            setFormData((prev: any) => ({
                ...prev,
                ...profileData,
                companyInfo: profileData.companyInfo,
                contactPerson: profileData.contactPerson,
                journeyStatus: nextStatus
            }));
            setCurrentStep((prev: number) => prev + 1);
        } catch (error) {
            console.log('Error creating profile:', error);
            setErrors({ ...errors, apiError: 'An unexpected error occurred' });
            return;
        } finally {
            setIsSubmitting(false);
        }
    } else if (currentStep === 2) {
        if (!validateSystemRegistrationStep()) {
            return;
        }
        
        const nextStatus = getNextJourneyStatus(currentStep);
        setFormData((prev: any) => ({ ...prev, journeyStatus: nextStatus }));
        setCurrentStep((prev: number) => prev + 1);
    } else if (currentStep === 3) {
        setIsSubmitting(true);
        try {
            const facilityPayload = createFacilityPayload();
            const response = await RegisterController.AddFacility(facilityPayload);
            console.log("Facility creation response:", response);
            if (!response || !response.data?.id) {
                console.log('Facility creation failed:', response);
                setErrors({ ...errors, apiError: 'Failed to create facility' });
                setIsSubmitting(false);
                return;
            }

            // Update formData with facility ID and completed status
            const nextStatus = getNextJourneyStatus(currentStep);
            setFormData((prev: any) => ({
                ...prev,
                id: response.data.id,
                journeyStatus: nextStatus
            }));
            
            const profileUpdateData = {
                id: response.data.id,
                journeyStatus: nextStatus
            };
            
            const updateResult = await StepperController.UpdateProfile(profileUpdateData, response.data.userID);
            console.log("Update profile response:", updateResult);
            if (!updateResult.success) {
                console.log('Failed to update profile journeyStatus:', updateResult.error);
            }
            
            // Move to step 4 (completion step) instead of navigating away
            setCurrentStep(4);
        } catch (error) {
            console.log('Error creating facility:', error);
            setErrors({ ...errors, apiError: 'An unexpected error occurred while creating facility' });
            setIsSubmitting(false);
            return;
        } finally {
            setIsSubmitting(false);
        }
    }
};

    const prevStep = () => setCurrentStep((prev: number) => Math.max(1, prev - 1));
    const goToStep = (step: number) => setCurrentStep(step);

    return {
        currentStep,
        formData,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        isSubmitting,
        showCountryCodePicker,
        setShowCountryCodePicker,
        showContactCountryCodePicker,
        setShowContactCountryCodePicker,
        showServiceCountryCodePicker,
        setShowServiceCountryCodePicker,
        showSalesCountryCodePicker,
        setShowSalesCountryCodePicker,
        showModelPicker,
        setShowModelPicker,
        showIndustryPicker,
        setShowIndustryPicker,
        showCountryPicker,
        setShowCountryPicker,
        monthlyErrors,
        totalPercentageError,
        updateMonthlyPercentage,
        distributeHoursEvenly,
        calculateTotalHours,
        calculateTotalPercentage,
        validateMonthHours,
        validateTotalPercentage,
        errors,
    };
};
