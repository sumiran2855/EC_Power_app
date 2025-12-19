import { HelpController } from '@/controllers/HelpController';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TFunction } from 'i18next';
import { useCallback, useState } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';

export interface ContactFormData {
    selectedSubject: string;
    description: string;
}
type AlertType = 'success' | 'error' | 'warning' | 'info';

const useContact = (navigation: NativeStackNavigationProp<RootStackParamList, 'Contact'>, t: TFunction) => {
    const [formData, setFormData] = useState<ContactFormData>({
        selectedSubject: '',
        description: '',
    });

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        t('contact.subjects.problemWithXRGI'),
        t('contact.subjects.problemWithAddingInfo'),
        t('contact.subjects.problemWithPriceSmart'),
        t('contact.subjects.wantContact'),
        t('contact.subjects.otherInquiry'),
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
            showAlert('warning', t('contact.alerts.missingInfo.title'), t('contact.alerts.missingInfo.message'));
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
                showAlert('success', t('contact.alerts.submissionSuccess.title'), t('contact.alerts.submissionSuccess.message'));
            }
        } catch (err) {
            console.log('Failed to send query:', err);
            showAlert('error', t('contact.alerts.submissionFailed.title'), t('contact.alerts.submissionFailed.message'));
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
