import { useStepperForm } from '../../hooks/useStepperForm';
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    View,
} from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './StepperScreen.styles';
import ProfileStep from './steps/ProfileStep';
import SmartPriceStep from './steps/SmartPriceStep';
import SystemRegistrationStep from './steps/SystemRegistrationStep';

const StepperScreen: React.FC = () => {
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
    } = useStepperForm();

    const steps = [
        { id: 1, label: 'Profile', icon: 'person', completed: currentStep > 1 },
        { id: 2, label: 'System Registration', icon: 'settings', completed: currentStep > 2 },
        { id: 3, label: 'Smart Price Control', icon: 'electrical-services', completed: currentStep > 3 },
    ];

    const handleNext = () => {
        if (currentStep < 3) {
            nextStep();
        } else {
            console.log('Form completed:', formData);
            navigation.navigate('Home');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            prevStep();
        } else {
            navigation.goBack();
        }
    };

    const handleSaveForLater = () => {
        console.log('Saved for later:', formData);
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
            // Pass all required props to satisfy TypeScript
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
                return <ProfileStep {...commonProps} />;
            case 2:
                return <SystemRegistrationStep {...commonProps} />;
            case 3:
                return <SmartPriceStep {...commonProps} />;
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
                {renderStepIndicator()}
                {renderCurrentStep()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default StepperScreen;