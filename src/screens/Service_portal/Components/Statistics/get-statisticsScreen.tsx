import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import React from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useStatisticsScreen from "../../../../hooks/Service-portal/useGetStatistics";
import styles from "./get-statisticsScreen.styles";

interface StatisticsScreenProps {
    navigation: any;
    route: any;
}

const Get_StatisticsScreen: React.FC<StatisticsScreenProps> = ({ navigation, route }) => {
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
        handleGetData,
        formatDate,
        formatTime,
        onFromDateChange,
        onFromTimeChange,
        onToDateChange,
        onToTimeChange
    } = useStatisticsScreen();

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleGetDataPress = () => {
        const { fromDate: formattedFromDate, toDate: formattedToDate, fromDateObject, toDateObject } = handleGetData();
        
        // Navigate to StatisticsResultScreen with the date parameters and system
        navigation.navigate('StatisticsResult', {
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            system: system
        });
    };

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
                            <Ionicons name="stats-chart" size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.title}>Statistics</Text>
                    </View>
                    <Text style={styles.subtitle}>See system statistics {system.xrgiID} / {system.modelNumber}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>
                            Please note: Both date and hour must be set
                        </Text>
                    </View>

                    {/* From Date Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            From Date (DD-MM-YY HH:MM) <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.dateTimePickerContainer}>
                            <View style={styles.dateTimeRow}>
                                <View style={styles.dateInputWrapper}>
                                    <TouchableOpacity
                                        style={styles.inputTouchable}
                                        onPress={() => setShowFromDatePicker(true)}
                                    >
                                        <View style={styles.inputContent}>
                                            <Text style={styles.inputLabel}>DATE</Text>
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
                                            <Text style={styles.inputLabel}>TIME</Text>
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
                            To Date (DD-MM-YY HH:MM) <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.dateTimePickerContainer}>
                            <View style={styles.dateTimeRow}>
                                <View style={styles.dateInputWrapper}>
                                    <TouchableOpacity
                                        style={styles.inputTouchable}
                                        onPress={() => setShowToDatePicker(true)}
                                    >
                                        <View style={styles.inputContent}>
                                            <Text style={styles.inputLabel}>DATE</Text>
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
                                            <Text style={styles.inputLabel}>TIME</Text>
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
                            <Text style={[styles.buttonText, styles.backButtonText]}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.getDataButton]}
                            onPress={handleGetDataPress}
                        >
                            <Text style={[styles.buttonText, styles.getDataButtonText]}>Get Data</Text>
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
};

export default Get_StatisticsScreen;