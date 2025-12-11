import { MaterialIcons as Icon } from "@expo/vector-icons";
import React from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../StepperScreen.styles';
import { SmartPriceStepProps } from '../types';

const SmartPriceStep: React.FC<SmartPriceStepProps> = ({
    formData,
    updateFormData,
    onBack,
    onNext,
}) => {
    const { t } = useTranslation();

    const handleSmartPriceToggle = () => {
        const newValue = !formData.smartPriceControlAdded;
        updateFormData('smartPriceControlAdded', newValue);
        
        // If enabling, set default method
        if (newValue && !formData.smartPriceControl?.method) {
            setTimeout(() => {
                updateFormData('smartPriceControl', { method: 'as_soon_as_possible' } as any);
            }, 0);
        }
    };

    const handleMethodSelect = (method: string) => {
        updateFormData('smartPriceControl', { method } as any);
    };

    const handleNext = () => {
        onNext();
    };

    // Add useEffect to log state changes
    React.useEffect(() => {
    }, [formData.smartPriceControlAdded]);

    React.useEffect(() => {
    }, [formData.smartPriceControl?.method]);

    return (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <Text style={styles.title}>{t('smartPriceStep.header.title')}</Text>
                <Text style={styles.subtitle}>
                    {t('smartPriceStep.header.subtitle')}
                </Text>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.infoCardIcon}>
                    <Icon name="lightbulb" size={32} color="#FFA000" />
                </View>
                <View style={styles.infoCardContent}>
                    <Text style={styles.infoCardTitle}>{t('smartPriceStep.infoCard.title')}</Text>
                    <Text style={styles.infoCardText}>
                        {t('smartPriceStep.infoCard.description')}
                    </Text>
                    <View style={styles.infoBadge}>
                        <Icon name="star" size={14} color="#FFA000" />
                        <Text style={styles.infoBadgeText}>{t('smartPriceStep.infoCard.badge')}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.featureToggleCard}
                    onPress={handleSmartPriceToggle}
                >
                    <View style={styles.featureToggleLeft}>
                        <View style={[styles.checkbox, formData.smartPriceControlAdded && styles.checkboxChecked]}>
                            {formData.smartPriceControlAdded && <Icon name="check" size={16} color="#fff" />}
                        </View>
                        <View style={styles.featureToggleContent}>
                            <Text style={styles.featureToggleTitle}>{t('smartPriceStep.featureToggle.title')}</Text>
                            <Text style={styles.featureToggleDescription}>
                                {t('smartPriceStep.featureToggle.description')}
                            </Text>
                        </View>
                    </View>
                    <Icon
                        name="electrical-services"
                        size={28}
                        color={formData.smartPriceControlAdded ? "#003D82" : "#CCC"}
                    />
                </TouchableOpacity>
            </View>

            {formData.smartPriceControlAdded && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon name="build" size={24} color="#003D82" />
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>{t('smartPriceStep.installation.title')}</Text>
                            <Text style={styles.cardSubtitle}>{t('smartPriceStep.installation.subtitle')}</Text>
                        </View>
                    </View>

                    <View style={styles.alertBox}>
                        <Icon name="info" size={20} color="#1976D2" />
                        <Text style={styles.alertText}>
                            {t('smartPriceStep.installation.alert')}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.radioCard,
                            formData.smartPriceControl?.method === 'On_Site_Visit' && styles.radioCardActive
                        ]}
                        onPress={() => handleMethodSelect('On_Site_Visit')}
                    >
                        <View style={styles.radioButton}>
                            {formData.smartPriceControl?.method === 'On_Site_Visit' && (
                                <View style={styles.radioButtonInner} />
                            )}
                        </View>
                        <View style={styles.radioCardContent}>
                            <Text style={styles.radioCardTitle}>{t('smartPriceStep.installation.onSiteVisit.title')}</Text>
                            <Text style={styles.radioCardDescription}>
                                {t('smartPriceStep.installation.onSiteVisit.description')}
                            </Text>
                        </View>
                        <Icon name="event" size={24} color="#003D82" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.radioCard,
                            formData.smartPriceControl?.method === 'as_soon_as_possible' && styles.radioCardActive
                        ]}
                        onPress={() => handleMethodSelect('as_soon_as_possible')}
                    >
                        <View style={styles.radioButton}>
                            {formData.smartPriceControl?.method === 'as_soon_as_possible' && (
                                <View style={styles.radioButtonInner} />
                            )}
                        </View>
                        <View style={styles.radioCardContent}>
                            <Text style={styles.radioCardTitle}>{t('smartPriceStep.installation.asSoonAsPossible.title')}</Text>
                            <Text style={styles.radioCardDescription}>
                                {t('smartPriceStep.installation.asSoonAsPossible.description')}
                            </Text>
                        </View>
                        <Icon name="flash-on" size={24} color="#003D82" />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.successCard}>
                <View style={styles.successIconWrapper}>
                    <Icon name="check-circle" size={48} color="#00B050" />
                </View>
                <Text style={styles.successTitle}>{t('smartPriceStep.success.title')}</Text>
                <Text style={styles.successText}>
                    {t('smartPriceStep.success.description')}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonSecondary} onPress={onBack}>
                    <Icon name="arrow-back" size={20} color="#003D82" />
                    <Text style={styles.buttonSecondaryText}>{t('smartPriceStep.buttons.back')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonPrimary} onPress={handleNext}>
                    <Icon name="check" size={20} color="#fff" />
                    <Text style={styles.buttonPrimaryText}>{t('smartPriceStep.buttons.complete')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default SmartPriceStep;
