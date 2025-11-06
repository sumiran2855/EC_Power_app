import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles as stepperStyles } from '../../../authScreens/StepperScreen.styles';
import { FormData } from '../../../authScreens/types';
import { styles as localStyles } from './InstallationScreen.styles';

type RootStackParamList = {
    Register: undefined;
    Installation: { formData: FormData };
};

type InstallationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Installation'>;

interface InstallationScreenProps {
    route: {
        params: {
            formData: FormData;
        };
    };
}

const InstallationScreen: React.FC<InstallationScreenProps> = ({ route }) => {
    const navigation = useNavigation<InstallationScreenNavigationProp>();
    const { formData: initialFormData } = route.params;
    const [formData, setFormData] = React.useState(initialFormData);

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleComplete = () => {
        // Handle form completion
        console.log('Installation completed:', formData);
        navigation.goBack();
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
                        <Text>
                            <Icon name="arrow-back" size={24} color="#1a5490" />
                        </Text>
                    </TouchableOpacity>
                    <Text style={localStyles.headerTitle}>Smart PriceControl</Text>
                    <View style={localStyles.backButton} /> {/* Empty view for spacing */}
                </View>

                <View style={stepperStyles.headerSection}>
                    <Text style={stepperStyles.title}>Smart PriceControl</Text>
                    <Text style={stepperStyles.subtitle}>
                        Optimize your energy production with real-time electricity market prices
                    </Text>
                </View>

                <View style={stepperStyles.infoCard}>
                    <View style={stepperStyles.infoCardIcon}>
                        <Text>
                            <Icon name="lightbulb" size={32} color="#FFA000" />
                        </Text>
                    </View>
                    <View style={stepperStyles.infoCardContent}>
                        <Text style={stepperStyles.infoCardTitle}>How it works</Text>
                        <Text style={stepperStyles.infoCardText}>
                            Our software uses EPEX Day-ahead market prices to automatically pause energy
                            production when prices are zero or negative, maximizing your savings.
                        </Text>
                        <View style={stepperStyles.infoBadge}>
                            <Text>
                                <Icon name="star" size={14} color="#FFA000" />
                            </Text>
                            <Text style={stepperStyles.infoBadgeText}>Standard on all XRCP® systems from April 2025</Text>
                        </View>
                    </View>
                </View>

                <View style={stepperStyles.card}>
                    <TouchableOpacity
                        style={stepperStyles.featureToggleCard}
                        onPress={() => updateFormData('installSmartPrice', !formData.installSmartPrice)}
                    >
                        <View style={stepperStyles.featureToggleLeft}>
                            <View style={[stepperStyles.checkbox, formData.installSmartPrice && stepperStyles.checkboxChecked]}>
                                {formData.installSmartPrice && (
                                    <Text>
                                        <Icon name="check" size={16} color="#fff" />
                                    </Text>
                                )}
                            </View>
                            <View style={stepperStyles.featureToggleContent}>
                                <Text style={stepperStyles.featureToggleTitle}>Install SmartPriceControl</Text>
                                <Text style={stepperStyles.featureToggleDescription}>
                                    Enable automatic optimization
                                </Text>
                            </View>
                        </View>
                        <Text>
                            <Icon
                                name="electrical-services"
                                size={28}
                                color={formData.installSmartPrice ? "#003D82" : "#CCC"}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>

                {formData.installSmartPrice && (
                    <View style={stepperStyles.card}>
                        <View style={stepperStyles.cardHeader}>
                            <Text>
                                <Icon name="build" size={24} color="#003D82" />
                            </Text>
                            <View style={stepperStyles.cardHeaderText}>
                                <Text style={stepperStyles.cardTitle}>Installation Timing</Text>
                                <Text style={stepperStyles.cardSubtitle}>Choose when to install the software</Text>
                            </View>
                        </View>

                        <View style={stepperStyles.alertBox}>
                            <Text>
                                <Icon name="info" size={20} color="#1976D2" />
                            </Text>
                            <Text style={stepperStyles.alertText}>
                                Physical installation on your XRGI® system is required by your service partner
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                stepperStyles.radioCard,
                                formData.installationTiming === 'next-visit' && stepperStyles.radioCardActive
                            ]}
                            onPress={() => updateFormData('installationTiming', 'next-visit')}
                        >
                            <View style={stepperStyles.radioButton}>
                                {formData.installationTiming === 'next-visit' && (
                                    <View style={stepperStyles.radioButtonInner} />
                                )}
                            </View>
                            <View style={stepperStyles.radioCardContent}>
                                <Text style={stepperStyles.radioCardTitle}>At next on-site visit</Text>
                                <Text style={stepperStyles.radioCardDescription}>
                                    Install during scheduled maintenance
                                </Text>
                            </View>
                            <Text>
                                <Icon name="event" size={24} color="#003D82" />
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                stepperStyles.radioCard,
                                formData.installationTiming === 'asap' && stepperStyles.radioCardActive
                            ]}
                            onPress={() => updateFormData('installationTiming', 'asap')}
                        >
                            <View style={stepperStyles.radioButton}>
                                {formData.installationTiming === 'asap' && (
                                    <View style={stepperStyles.radioButtonInner} />
                                )}
                            </View>
                            <View style={stepperStyles.radioCardContent}>
                                <Text style={stepperStyles.radioCardTitle}>As soon as possible</Text>
                                <Text style={stepperStyles.radioCardDescription}>
                                    Schedule a dedicated installation visit
                                </Text>
                            </View>
                            <Text>
                                <Icon name="flash-on" size={24} color="#003D82" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={stepperStyles.successCard}>
                    <View style={stepperStyles.successIconWrapper}>
                        <Text>
                            <Icon name="check-circle" size={48} color="#00B050" />
                        </Text>
                    </View>
                    <Text style={stepperStyles.successTitle}>Almost Done!</Text>
                    <Text style={stepperStyles.successText}>
                        Review your information and save to complete the setup process
                    </Text>
                </View>

                <View style={stepperStyles.buttonContainer}>
                    <TouchableOpacity style={stepperStyles.buttonSecondary} onPress={handleBack}>
                        <Text>
                            <Icon name="arrow-back" size={20} color="#003D82" />
                        </Text>
                        <Text style={stepperStyles.buttonSecondaryText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={stepperStyles.buttonPrimary} onPress={handleComplete}>
                        <Text>
                            <Icon name="check" size={20} color="#fff" />
                        </Text>
                        <Text style={stepperStyles.buttonPrimaryText}>Complete Setup</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default InstallationScreen;