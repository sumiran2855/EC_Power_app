import { useState, useEffect } from 'react';
import { FormData } from '../screens/authScreens/types';
import { Alert } from 'react-native';

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

    const [formData, setFormData] = useState<FormData>({
        companyName: '',
        vatNo: '',
        address: '',
        postcode: '',
        city: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        contactEmail: '',
        contactPhone: '',
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
        hasServiceContract: null,
        interestedInServiceContract: null,
        serviceProviderName: '',
        serviceProviderEmail: '',
        serviceProviderPhone: '',
        serviceCountryCode: '+1',
        isSalesPartnerSame: null,
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
        if (formData.expectedOperatingHours && formData.distributeHoursEvenly) {
            distributeHoursEvenly();
        }
    }, [formData.expectedOperatingHours]);

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    };

    const distributeHoursEvenly = () => {
        const totalHours = parseFloat(formData.expectedOperatingHours) || 0;
        const hoursPerMonth = totalHours / 12;
        const percentagePerMonth = (100 / 12);

        const newDistribution = formData.monthlyDistribution.map((month: { month: string; percentage: string; hours: string; editable: boolean }) => ({
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
        const total = formData.monthlyDistribution.reduce((sum: number, month: { percentage: string; hours: string }) => {
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
        const totalHours = parseFloat(formData.expectedOperatingHours) || 0;
        const percentage = parseFloat(value) || 0;
        const hours = (totalHours * percentage) / 100;

        const newDistribution = [...formData.monthlyDistribution];
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
        const total = formData.monthlyDistribution.reduce((sum: number, month: { percentage: string; hours: string }) => {
            const hours = parseFloat(month.hours) || 0;
            return sum + hours;
        }, 0);
        return `${total.toFixed(0)}h`;
    };

    const calculateTotalPercentage = () => {
        const total = formData.monthlyDistribution.reduce((sum: number, month: { percentage: string; hours: string }) => {
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
        if (!formData.systemName?.trim()) {
            newErrors.systemName = 'System name is required';
            isValid = false;
        }

        if (!formData.xrgiIdNumber?.trim()) {
            newErrors.xrgiIdNumber = 'XRGI ID Number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.xrgiIdNumber)) {
            newErrors.xrgiIdNumber = 'XRGI ID must be 10 digits';
            isValid = false;
        }

        if (!formData.selectedModel) {
            newErrors.selectedModel = 'Please select a model';
            isValid = false;
        }

        // XRGI Site Validation
        if (!formData.systemAddress?.trim()) {
            newErrors.systemAddress = 'Address is required';
            isValid = false;
        }

        if (!formData.systemPostcode?.trim()) {
            newErrors.systemPostcode = 'Postcode is required';
            isValid = false;
        }

        if (!formData.systemCity?.trim()) {
            newErrors.systemCity = 'City is required';
            isValid = false;
        }

        if (!formData.systemCountry) {
            newErrors.systemCountry = 'Country is required';
            isValid = false;
        }

        // Service Contract Validation
        if (formData.hasServiceContract === true) {
            if (!formData.serviceProviderName?.trim()) {
                newErrors.serviceProviderName = 'Service provider name is required';
                isValid = false;
            }

            if (!formData.serviceProviderEmail?.trim()) {
                newErrors.serviceProviderEmail = 'Service provide   r email is required';
                isValid = false;
            } else if (!validateEmail(formData.serviceProviderEmail)) {
                newErrors.serviceProviderEmail = 'Please enter a valid email address';
                isValid = false;
            }

            if (!formData.serviceProviderPhone?.trim()) {
                newErrors.serviceProviderPhone = 'Service provider phone is required';
                isValid = false;
            } else if (!validatePhone(formData.serviceProviderPhone)) {
                newErrors.serviceProviderPhone = 'Phone number must be at least 8 digits';
                isValid = false;
            }

            // Sales Partner Validation if different from service provider
            if (formData.isSalesPartnerSame === false) {
                if (!formData.salesPartnerName?.trim()) {
                    newErrors.salesPartnerName = 'Sales partner name is required';
                    isValid = false;
                }

                if (!formData.salesPartnerEmail?.trim()) {
                    newErrors.salesPartnerEmail = 'Sales partner email is required';
                    isValid = false;
                } else if (!validateEmail(formData.salesPartnerEmail)) {
                    newErrors.salesPartnerEmail = 'Please enter a valid email address';
                    isValid = false;
                }

                if (!formData.salesPartnerPhone?.trim()) {
                    newErrors.salesPartnerPhone = 'Sales partner phone is required';
                    isValid = false;
                } else if (!validatePhone(formData.salesPartnerPhone)) {
                    newErrors.salesPartnerPhone = 'Phone number must be at least 8 digits';
                    isValid = false;
                }
            }
        }

        // EnergyCheck Plus Validation
        if (formData.energyCheckPlus) {
            // Make all EnergyCheck Plus fields required
            if (!formData.expectedOperatingHours?.trim()) {
                newErrors.expectedOperatingHours = 'Expected operating hours are required';
                isValid = false;
            } else {
                const hours = parseFloat(formData.expectedOperatingHours);
                if (isNaN(hours) || hours < 0 || hours > 8760) {
                    newErrors.expectedOperatingHours = 'Operating hours must be between 0 and 8760';
                    isValid = false;
                }
            }

            if (!formData.recipientEmails?.trim()) {
                newErrors.recipientEmails = 'At least one recipient email is required';
                isValid = false;
            } else {
                const emails = formData.recipientEmails.split(',').map(email => email.trim()).filter(Boolean);
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
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateProfileStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Company Information Validation
        const companyNameError = validateRequired(formData.companyName, 'Company name');
        if (companyNameError) {
            newErrors.companyName = companyNameError;
            isValid = false;
        }

        const vatNoError = validateRequired(formData.vatNo, 'VAT number');
        if (vatNoError) {
            newErrors.vatNo = vatNoError;
            isValid = false;
        }

        const addressError = validateRequired(formData.address, 'Address');
        if (addressError) {
            newErrors.address = addressError;
            isValid = false;
        }

        const postcodeError = validateRequired(formData.postcode, 'Postcode');
        if (postcodeError) {
            newErrors.postcode = postcodeError;
            isValid = false;
        }

        const cityError = validateRequired(formData.city, 'City');
        if (cityError) {
            newErrors.city = cityError;
            isValid = false;
        }

        const emailError = validateRequired(formData.email, 'Email');
        if (emailError) {
            newErrors.email = emailError;
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        const phoneError = validateRequired(formData.phone, 'Phone number');
        if (phoneError) {
            newErrors.phone = phoneError;
            isValid = false;
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Phone number must be at least 8 digits';
            isValid = false;
        }

        // Contact Person Validation
        const firstNameError = validateRequired(formData.firstName, 'First name');
        if (firstNameError) {
            newErrors.firstName = firstNameError;
            isValid = false;
        }

        const lastNameError = validateRequired(formData.lastName, 'Last name');
        if (lastNameError) {
            newErrors.lastName = lastNameError;
            isValid = false;
        }

        const contactEmailError = validateRequired(formData.contactEmail, 'Contact email');
        if (contactEmailError) {
            newErrors.contactEmail = contactEmailError;
            isValid = false;
        } else if (!validateEmail(formData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
            isValid = false;
        }

        const contactPhoneError = validateRequired(formData.contactPhone, 'Contact phone number');
        if (contactPhoneError) {
            newErrors.contactPhone = contactPhoneError;
            isValid = false;
        } else if (!validatePhone(formData.contactPhone)) {
            newErrors.contactPhone = 'Phone number must be at least 8 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        if (currentStep === 1 && !validateProfileStep()) {
            return;
        }
        if (currentStep === 2 && !validateSystemRegistrationStep()) {
            return;
        }
        setCurrentStep((prev: number) => prev + 1);
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
