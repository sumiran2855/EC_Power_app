import { MaterialIcons as Icon } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStepperForm } from '../../hooks/useStepperForm';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './StepperScreen.styles';
import ProfileStep from './steps/ProfileStep';
import SmartPriceStep from './steps/SmartPriceStep';
import SystemRegistrationStep from './steps/SystemRegistrationStep';
import { ICustomer, ProfileStepProps, SmartPriceStepProps, SystemRegisterStepProps } from './types';

const StepperScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const {
        currentStep,
        formData,
        updateFormData,
        nextStep,
        prevStep,
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
        isSubmitting,
    } = useStepperForm();

    useEffect(() => {
        if (currentStep === 4 && formData.journeyStatus === 'completed') {
            const timer = setTimeout(() => {
                navigation.navigate('Home');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, formData.journeyStatus, navigation]);

    const steps = [
        { id: 1, label: t('stepper.steps.profile'), icon: 'person', completed: currentStep > 1 },
        { id: 2, label: t('stepper.steps.systemRegistration'), icon: 'settings', completed: currentStep > 2 },
        { id: 3, label: t('stepper.steps.smartPriceControl'), icon: 'electrical-services', completed: currentStep > 3 },
    ];

    const handleNext = () => {
        nextStep();
    };

    const handleBack = () => {
        if (currentStep > 1) {
            prevStep();
        } else {
            navigation.goBack();
        }
    };

    const handleSaveForLater = () => {
        navigation.goBack();
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicatorContainer}>
            <View style={styles.stepIndicatorContent}>
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <View style={styles.stepItem}>
                            <View style={styles.stepIconWrapper}>
                                <View
                                    style={[
                                        styles.stepCircle,
                                        currentStep === step.id && styles.stepCircleActive,
                                        step.completed && styles.stepCircleCompleted,
                                    ]}
                                >
                                    {step.completed ? (
                                        <Icon name="check" size={20} color="#fff" />
                                    ) : (
                                        <Icon
                                            name={step.icon as any}
                                            size={20}
                                            color={currentStep === step.id ? '#003D82' : '#999'}
                                        />
                                    )}
                                </View>
                            </View>
                            <Text
                                style={[
                                    styles.stepLabel,
                                    currentStep === step.id && styles.stepLabelActive,
                                    step.completed && styles.stepLabelCompleted,
                                ]}
                            >
                                {step.label}
                            </Text>
                        </View>
                        {index < steps.length - 1 && (
                            <View style={styles.stepConnector}>
                                <View
                                    style={[
                                        styles.stepConnectorLine,
                                        step.completed && styles.stepConnectorLineCompleted
                                    ]}
                                />
                            </View>
                        )}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );

    const renderCurrentStep = () => {
        const commonProps = {
            formData,
            updateFormData,
            onNext: handleNext,
            onBack: handleBack,
            onSaveForLater: handleSaveForLater,
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
        switch (currentStep) {
            case 1:
                return (
                    <ProfileStep
                        {...commonProps}
                        formData={formData as ICustomer}
                        updateFormData={updateFormData as ProfileStepProps['updateFormData']}
                    />
                );
            case 2:
                return (
                    <SystemRegistrationStep
                        {...commonProps}
                        formData={formData as any}
                        updateFormData={updateFormData as SystemRegisterStepProps['updateFormData']}
                    />
                );
            case 3:
                return (
                    <SmartPriceStep
                        {...commonProps}
                        formData={formData as any}
                        updateFormData={updateFormData as SmartPriceStepProps['updateFormData']}
                    />
                );
            case 4:
                return (
                    <SafeAreaView style={styles.completionContainer}>
                        <View style={styles.successIconWrapper}>
                            <Icon name="check-circle" size={80} color="#00B050" />
                        </View>

                        <Text style={styles.completionTitle}>{t('stepper.completion.title')}</Text>

                        <Text style={styles.completionText}>
                            {t('stepper.completion.message')}
                        </Text>

                        <Text style={styles.completionSubtext}>
                            {t('stepper.completion.redirecting')}
                        </Text>

                        <TouchableOpacity
                            style={styles.buttonPrimary1}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.buttonPrimaryText1}>{t('stepper.completion.goToDashboard')}</Text>
                            <Icon name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </SafeAreaView>

                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {currentStep < 4 && renderStepIndicator()}
                {renderCurrentStep()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default StepperScreen;