import { StepperController } from '@/controllers/StepperController';
import { useEffect, useState } from 'react';
import { FormData, ICustomer } from '../screens/authScreens/types';

export const useStepperForm = () => {
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
            { month: 'December', percentage: '8.33', hours: '0', editable: true },
        ],
    });

    // Effect to distribute hours when expected operating hours changes
    useEffect(() => {
        if (formData.EnergyCheck_plus?.annualSavings && formData.distributeHoursEvenly) {
            distributeHoursEvenly();
        }
    }, [formData.EnergyCheck_plus?.annualSavings]);

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    };

    const distributeHoursEvenly = () => {
        const totalHours = parseFloat(formData.EnergyCheck_plus?.annualSavings!) || 0;
        const hoursPerMonth = totalHours / 12;
        const percentagePerMonth = (100 / 12);

        const newDistribution = formData.EnergyCheck_plus?.monthlyDistribution!.map((month: { month: string; percentage: string; hours: string; editable: boolean }) => ({
            ...month,
            hours: hoursPerMonth.toFixed(2),
            percentage: percentagePerMonth.toFixed(2),
        }));

        setFormData((prev: FormData) => ({
            ...prev,
            monthlyDistribution: newDistribution,
        }));

        // Clear errors when distributing evenly
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
        const total = formData.EnergyCheck_plus?.monthlyDistribution!.reduce((sum: number, month: { percentage: string; hours: string }) => {
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

    const updateMonthlyPercentage = (index: number, value: string) => {
        const totalHours = parseFloat(formData.EnergyCheck_plus?.annualSavings!) || 0;
        const percentage = parseFloat(value) || 0;
        const hours = (totalHours * percentage) / 100;

        const newDistribution = [...formData.EnergyCheck_plus?.monthlyDistribution!];
        newDistribution[index] = {
            ...newDistribution[index],
            percentage: value,
            hours: hours.toFixed(2),
        };

        setFormData((prev: FormData) => ({
            ...prev,
            monthlyDistribution: newDistribution,
        }));

        validateMonthHours(hours, index);
        setTimeout(validateTotalPercentage, 0);
    };

    const calculateTotalHours = () => {
        const total = formData.EnergyCheck_plus?.monthlyDistribution!.reduce((sum: number, month: { percentage: string; hours: string }) => {
            const hours = parseFloat(month.hours) || 0;
            return sum + hours;
        }, 0);
        return `${total.toFixed(0)}h`;
    };

    const calculateTotalPercentage = () => {
        const total = formData.EnergyCheck_plus?.monthlyDistribution!.reduce((sum: number, month: { percentage: string; hours: string }) => {
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

        // Service Contract Validation
        if (formData.hasServiceContract === true) {
            if (!formData.serviceProvider?.name?.trim()) {
                newErrors.serviceProviderName = 'Service provider name is required';
                isValid = false;
            }

            if (!formData.serviceProvider?.mailAddress?.trim()) {
                newErrors.serviceProviderEmail = 'Service provide   r email is required';
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

            // Sales Partner Validation if different from service provider
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

        // EnergyCheck Plus Validation
        if (formData.EnergyCheck_plus) {
            // Make all EnergyCheck Plus fields required
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

        // Company Information Validation
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

        // Contact Person Validation
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
    const nextStep = async () => {
        if (currentStep === 1 && !validateProfileStep()) {
            return;
        }

        if (currentStep === 1) {
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
                    result = await StepperController.UpdateProfile(profileData);
                } else {
                    result = await StepperController.CreateProfile(profileData);
                }

                if (!result.success) {
                    console.error('Profile creation failed:', result.error);
                    setErrors({ ...errors, apiError: result.error || 'Failed to create profile' });
                    setIsSubmitting(false);
                    return;
                }

                console.log(`Profile ${formData.id ? 'updated' : 'created'} successfully`);

                setFormData((prev: any) => ({
                    ...prev,
                    ...profileData,
                    companyInfo: profileData.companyInfo,
                    contactPerson: profileData.contactPerson
                }));

                setIsSubmitting(false);
                setCurrentStep((prev: number) => prev + 1);
            } catch (error) {
                console.error('Error creating profile:', error);
                setErrors({ ...errors, apiError: 'An unexpected error occurred' });
                setIsSubmitting(false);
                return;
            }
        } else if (currentStep === 2 && !validateSystemRegistrationStep()) {
            // Validate System Registration Step
            return;
        } else {
            // For other steps, just proceed
            setCurrentStep((prev: number) => prev + 1);
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
