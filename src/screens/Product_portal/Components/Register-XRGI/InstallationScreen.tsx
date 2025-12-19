import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RegisterController } from '../../../../controllers/RegisterController';
import { RootStackParamList } from '../../../../navigation/AppNavigator';
import { styles as stepperStyles } from '../../../authScreens/StepperScreen.styles';
import { FormData } from '../../../authScreens/types';
import { styles as localStyles } from './InstallationScreen.styles';
import { useTranslation } from 'react-i18next';

type InstallationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Installation' | 'ProductDashboard'>;

interface InstallationScreenProps {
    route: {
        params: {
            formData: FormData;
        };
    };
}

const InstallationScreen: React.FC<InstallationScreenProps> = ({ route }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<InstallationScreenNavigationProp>();
    const { formData: initialFormData } = route.params;
    const [formData, setFormData] = React.useState(initialFormData);

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBack = () => {
        navigation.goBack();
    };
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleComplete = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        let response;
        try {

            const energyCheckData = formData.hasEnergyCheckPlus && formData.EnergyCheck_plus
                ? formData.EnergyCheck_plus
                : {} as any;

            const smartPriceControlData = formData.installedSmartPriceController && formData.smartPriceControl
                ? formData.smartPriceControl
                : undefined;

            response = formData.id && formData.id !== ''
                ? await RegisterController.UpdateFacility({
                    ...formData,
                    isInstalled: true,
                    DaSigned: true,
                    hasServiceContract: formData.hasServiceContract,
                    needServiceContract: formData.needServiceContract,
                    hasEnergyCheckPlus: formData.hasEnergyCheckPlus,
                    EnergyCheck_plus: energyCheckData,
                    smartPriceControl: smartPriceControlData,
                    smartPriceControlAdded: formData.smartPriceControlAdded ?? false,
                    installedSmartPriceController: formData.installedSmartPriceController ?? false,
                }, formData.id)
                : await RegisterController.AddFacility({
                    ...formData,
                    isInstalled: true,
                    DaSigned: true,
                    hasServiceContract: formData.hasServiceContract,
                    needServiceContract: formData.needServiceContract,
                    hasEnergyCheckPlus: formData.hasEnergyCheckPlus,
                    EnergyCheck_plus: energyCheckData,
                    smartPriceControl: smartPriceControlData,
                    smartPriceControlAdded: formData.smartPriceControlAdded ?? false,
                    installedSmartPriceController: formData.installedSmartPriceController ?? false,
                });

            if (response) {
                navigation.navigate('ProductDashboard');
            }
        } catch (error) {
            console.log('Error creating facility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };



    const updateSmartPriceControl = (method: 'On_Site_Visit' | 'as_soon_as_possible') => {
        setFormData(prev => ({
            ...prev,
            smartPriceControl: {
                ...prev.smartPriceControl,
                method: method
            }
        }));
    };

    return (
        <SafeAreaView style={stepperStyles.container}>
            <ScrollView style={stepperStyles.formContainer} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={localStyles.header}>
                    <TouchableOpacity
                        style={localStyles.backButton}
                        onPress={handleBack}
                        activeOpacity={0.7}
                    >
                        <Icon name="arrow-back" size={24} color="#1a5490" />
                    </TouchableOpacity>
                    <Text style={localStyles.headerTitle}>{t('smartPriceStep.header.title')}</Text>
                    <View style={localStyles.backButton} /> 
                </View>

                <View style={stepperStyles.headerSection}>
                    <Text style={stepperStyles.title}>{t('smartPriceStep.header.title')}</Text>
                    <Text style={stepperStyles.subtitle}>
                        {t('smartPriceStep.header.subtitle')}
                    </Text>
                </View>

                <View style={stepperStyles.infoCard}>
                    <View style={stepperStyles.infoCardIcon}>
                        <Icon name="lightbulb" size={32} color="#FFA000" />
                    </View>
                    <View style={stepperStyles.infoCardContent}>
                        <Text style={stepperStyles.infoCardTitle}>{t('smartPriceStep.infoCard.title')}</Text>
                        <Text style={stepperStyles.infoCardText}>
                            {t('smartPriceStep.infoCard.description')}
                        </Text>
                        <View style={stepperStyles.infoBadge}>
                            <Icon name="star" size={14} color="#FFA000" />
                            <Text style={stepperStyles.infoBadgeText}>{t('smartPriceStep.infoCard.badge')}</Text>
                        </View>
                    </View>
                </View>

                <View style={stepperStyles.card}>
                    <TouchableOpacity
                        style={stepperStyles.featureToggleCard}
                        onPress={() => updateFormData('installedSmartPriceController', !formData.installedSmartPriceController)}
                    >
                        <View style={stepperStyles.featureToggleLeft}>
                            <View style={[stepperStyles.checkbox, formData.installedSmartPriceController && stepperStyles.checkboxChecked]}>
                                {formData.installedSmartPriceController && (
                                    <Icon name="check" size={16} color="#fff" />
                                )}
                            </View>
                            <View style={stepperStyles.featureToggleContent}>
                                <Text style={stepperStyles.featureToggleTitle}>{t('smartPriceStep.featureToggle.title')}</Text>
                                <Text style={stepperStyles.featureToggleDescription}>
                                    {t('smartPriceStep.featureToggle.description')}
                                </Text>
                            </View>
                        </View>
                        <Icon
                            name="electrical-services"
                            size={28}
                            color={formData.installedSmartPriceController ? "#003D82" : "#CCC"}
                        />
                    </TouchableOpacity>
                </View>

                {formData.installedSmartPriceController && (
                    <View style={stepperStyles.card}>
                        <View style={stepperStyles.cardHeader}>
                            <Icon name="build" size={24} color="#003D82" />
                            <View style={stepperStyles.cardHeaderText}>
                                <Text style={stepperStyles.cardTitle}>{t('smartPriceStep.installation.title')}</Text>
                                <Text style={stepperStyles.cardSubtitle}>{t('smartPriceStep.installation.subtitle')}</Text>
                            </View>
                        </View>

                        <View style={stepperStyles.alertBox}>
                            <Icon name="info" size={20} color="#1976D2" />
                            <Text style={stepperStyles.alertText}>
                                {t('smartPriceStep.installation.alert')}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                stepperStyles.radioCard,
                                formData.smartPriceControl?.method === 'On_Site_Visit' && stepperStyles.radioCardActive
                            ]}
                            onPress={() => updateSmartPriceControl('On_Site_Visit')}
                        >
                            <View style={stepperStyles.radioButton}>
                                {formData.smartPriceControl?.method === 'On_Site_Visit' && (
                                    <View style={stepperStyles.radioButtonInner} />
                                )}
                            </View>
                            <View style={stepperStyles.radioCardContent}>
                                <Text style={stepperStyles.radioCardTitle}>{t('smartPriceStep.installation.onSiteVisit.title')}</Text>
                                <Text style={stepperStyles.radioCardDescription}>
                                    {t('smartPriceStep.installation.onSiteVisit.description')}
                                </Text>
                            </View>
                            <Icon name="event" size={24} color="#003D82" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                stepperStyles.radioCard,
                                formData.smartPriceControl?.method === 'as_soon_as_possible' && stepperStyles.radioCardActive
                            ]}
                            onPress={() => updateSmartPriceControl('as_soon_as_possible')}
                        >
                            <View style={stepperStyles.radioButton}>
                                {formData.smartPriceControl?.method === 'as_soon_as_possible' && (
                                    <View style={stepperStyles.radioButtonInner} />
                                )}
                            </View>
                            <View style={stepperStyles.radioCardContent}>
                                <Text style={stepperStyles.radioCardTitle}>{t('smartPriceStep.installation.asSoonAsPossible.title')}</Text>
                                <Text style={stepperStyles.radioCardDescription}>
                                    {t('smartPriceStep.installation.asSoonAsPossible.description')}
                                </Text>
                            </View>
                            <Icon name="flash-on" size={24} color="#003D82" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={stepperStyles.successCard}>
                    <View style={stepperStyles.successIconWrapper}>
                        <Icon name="check-circle" size={48} color="#00B050" />
                    </View>
                    <Text style={stepperStyles.successTitle}>{t('smartPriceStep.success.title')}</Text>
                    <Text style={stepperStyles.successText}>
                        {t('smartPriceStep.success.description')}
                    </Text>
                </View>

                <View style={stepperStyles.buttonContainer}>
                    <TouchableOpacity style={stepperStyles.buttonSecondary} onPress={handleBack}>
                        <Text style={stepperStyles.buttonSecondaryText}>{t('smartPriceStep.buttons.back')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[stepperStyles.buttonPrimary, isSubmitting && { opacity: 0.7 }]}
                        onPress={handleComplete}
                        disabled={isSubmitting}
                    >
                        <Text style={stepperStyles.buttonPrimaryText}>
                            {isSubmitting ? t('smartPriceStep.buttons.creating') : t('smartPriceStep.buttons.addFacility')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default InstallationScreen;