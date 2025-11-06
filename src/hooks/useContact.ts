import { useState, useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export interface ContactFormData {
    selectedSubject: string;
    description: string;
}

const useContact = (navigation: NativeStackNavigationProp<RootStackParamList, 'Contact'>) => {
    const [formData, setFormData] = useState<ContactFormData>({
        selectedSubject: '',
        description: '',
    });

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const subjects = [
        'Technical Support',
        'Account Issues',
        'Feature Request',
        'Billing Inquiry',
        'General Question',
        'Other',
    ];

    const handleInputChange = useCallback((field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        if (formData.selectedSubject && formData.description) {
            console.log('Form submitted:', formData);

            // Reset form
            setFormData({
                selectedSubject: '',
                description: ''
            });
        }
    }, [formData]);

    const toggleDropdown = useCallback(() => {
        setDropdownOpen(prev => !prev);
    }, []);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return {
        // State
        formData,
        dropdownOpen,
        subjects,

        // Handlers
        handleInputChange,
        handleSubmit,
        toggleDropdown,
        handleBack,
        setFormData,
        setDropdownOpen
    };
};

export default useContact;
