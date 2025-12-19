import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useCallDetailsScreen from '../../../../hooks/Service-portal/call-details/useGetCallDetails';
import styles from "../Statistics/get-statisticsScreen.styles";

interface get_call_detailsScreenProps {
    navigation: any;
    route: any;
}

const Get_call_detailsScreen: React.FC<get_call_detailsScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { system } = route.params;
    const {
        fromDate,
        toDate,
        showFromDatePicker,
        showFromTimePicker,
        showToDatePicker,
        showToTimePicker,
        setShowFromDatePicker,
        setShowFromTimePicker,
        setShowToDatePicker,
        setShowToTimePicker,
        formatDate,
        formatTime,
        onFromDateChange,
        onFromTimeChange,
        onToDateChange,
        onToTimeChange,
        handleGetData,
        handleNavigate
    } = useCallDetailsScreen({ navigation, route });

    const handleBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleGetDataPress = useCallback(() => {
        const formattedDates = handleGetData();
        handleNavigate(formattedDates);
    }, [handleGetData, handleNavigate]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <View style={styles.titleRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="list" size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.title}>{t('callDetails.title')}</Text>
                    </View>
                    <Text style={styles.subtitle}>{t('callDetails.subtitle', { xrgiID: system.xrgiID, modelNumber: system.modelNumber })}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>
                            {t('callDetails.note')}
                        </Text>
                    </View>

                    {/* From Date Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {t('callDetails.fromDate')} <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.dateTimePickerContainer}>
                            <View style={styles.dateTimeRow}>
                                <View style={styles.dateInputWrapper}>
                                    <TouchableOpacity
                                        style={styles.inputTouchable}
                                        onPress={() => setShowFromDatePicker(true)}
                                    >
                                        <View style={styles.inputContent}>
                                            <Text style={styles.inputLabel}>{t('callDetails.date')}</Text>
                                            <Text style={styles.inputValue}>{formatDate(fromDate)}</Text>
                                        </View>
                                        <Ionicons name="calendar-outline" size={20} color="#3B82F6" style={styles.inputIcon} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.timeInputWrapper}>
                                    <TouchableOpacity
                                        style={styles.inputTouchable}
                                        onPress={() => setShowFromTimePicker(true)}
                                    >
                                        <View style={styles.inputContent}>
                                            <Text style={styles.inputLabel}>{t('callDetails.time')}</Text>
                                            <Text style={styles.inputValue}>{formatTime(fromDate)}</Text>
                                        </View>
                                        <Ionicons name="time-outline" size={20} color="#3B82F6" style={styles.inputIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* To Date Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {t('callDetails.toDate')} <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.dateTimePickerContainer}>
                            <View style={styles.dateTimeRow}>
                                <View style={styles.dateInputWrapper}>
                                    <TouchableOpacity
                                        style={styles.inputTouchable}
                                        onPress={() => setShowToDatePicker(true)}
                                    >
                                        <View style={styles.inputContent}>
                                            <Text style={styles.inputLabel}>{t('callDetails.date')}</Text>
                                            <Text style={styles.inputValue}>{formatDate(toDate)}</Text>
                                        </View>
                                        <Ionicons name="calendar-outline" size={20} color="#3B82F6" style={styles.inputIcon} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.timeInputWrapper}>
                                    <TouchableOpacity
                                        style={styles.inputTouchable}
                                        onPress={() => setShowToTimePicker(true)}
                                    >
                                        <View style={styles.inputContent}>
                                            <Text style={styles.inputLabel}>{t('callDetails.time')}</Text>
                                            <Text style={styles.inputValue}>{formatTime(toDate)}</Text>
                                        </View>
                                        <Ionicons name="time-outline" size={20} color="#3B82F6" style={styles.inputIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.backButtonStyle]}
                            onPress={handleBackButton}
                        >
                            <Text style={[styles.buttonText, styles.backButtonText]}>{t('callDetails.back')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.getDataButton]}
                            onPress={handleGetDataPress}
                        >
                            <Text style={[styles.buttonText, styles.getDataButtonText]}>{t('callDetails.getData')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Date/Time Pickers */}
            {showFromDatePicker && (
                <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onFromDateChange}
                />
            )}
            {showFromTimePicker && (
                <DateTimePicker
                    value={fromDate}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onFromTimeChange}
                />
            )}
            {showToDatePicker && (
                <DateTimePicker
                    value={toDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onToDateChange}
                />
            )}
            {showToTimePicker && (
                <DateTimePicker
                    value={toDate}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onToTimeChange}
                />
            )}
        </SafeAreaView>
    );
}

export default Get_call_detailsScreen;