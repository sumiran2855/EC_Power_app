import { useCallback, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { HelpController } from '@/controllers/HelpController';

export interface ContactFormData {
    selectedSubject: string;
    description: string;
}
type AlertType = 'success' | 'error' | 'warning' | 'info';

const useContact = (navigation: NativeStackNavigationProp<RootStackParamList, 'Contact'>) => {
    const [formData, setFormData] = useState<ContactFormData>({
        selectedSubject: '',
        description: '',
    });

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState<{
        visible: boolean;
        type: AlertType;
        title: string;
        message: string;
    }>({
        visible: false,
        type: 'info',
        title: '',
        message: ''
    });

    const subjects = [
        'Problem with XRGI',
        'Problem with adding information',
        'Problem with Price Smart',
        'I want to be contacted by EC POWER',
        'Other Inquiry',
    ];

    const handleInputChange = useCallback((field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const showAlert = useCallback((type: AlertType, title: string, message: string) => {
        setAlert({
            visible: true,
            type,
            title,
            message
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlert(prev => ({ ...prev, visible: false }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!formData.selectedSubject || !formData.description) {
            showAlert('warning', 'Missing Information', 'Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await HelpController.SendQuery(
                formData.selectedSubject,
                formData.description
            );

            if (response) {
                setFormData({
                    selectedSubject: '',
                    description: ''
                });
                showAlert('success', 'Query Submitted', "Your query has been submitted successfully. We'll get back to you soon.");
            }
        } catch (err) {
            console.log('Failed to send query:', err);
            showAlert('error', 'Submission Failed', 'Failed to submit your query. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, navigation]);

    const toggleDropdown = useCallback(() => {
        setDropdownOpen(prev => !prev);
    }, []);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleAlertClose = useCallback(() => {
        hideAlert();
        if (alert.type === 'success') {
            navigation.goBack();
        }
    }, [alert.type, navigation]);

    return {
        // State
        formData,
        dropdownOpen,
        subjects,
        isSubmitting,
        alert,

        // Handlers
        handleInputChange,
        handleSubmit,
        toggleDropdown,
        handleBack,
        handleAlertClose,
        showAlert,
        hideAlert,
        setFormData,
        setDropdownOpen
    };
};

export default useContact;
