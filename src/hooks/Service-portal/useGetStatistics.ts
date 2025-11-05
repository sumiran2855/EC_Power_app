import { useState } from 'react';
import { Platform } from 'react-native';

interface UseStatisticsScreenReturn {
    fromDate: Date;
    toDate: Date;
    showFromDatePicker: boolean;
    showFromTimePicker: boolean;
    showToDatePicker: boolean;
    showToTimePicker: boolean;
    setShowFromDatePicker: (show: boolean) => void;
    setShowFromTimePicker: (show: boolean) => void;
    setShowToDatePicker: (show: boolean) => void;
    setShowToTimePicker: (show: boolean) => void;
    handleGetData: () => { fromDate: string; toDate: string; fromDateObject: Date; toDateObject: Date };
    formatDate: (date: Date) => string;
    formatTime: (date: Date) => string;
    onFromDateChange: (event: any, selectedDate?: Date) => void;
    onFromTimeChange: (event: any, selectedDate?: Date) => void;
    onToDateChange: (event: any, selectedDate?: Date) => void;
    onToTimeChange: (event: any, selectedDate?: Date) => void;
}

const useStatisticsScreen = (): UseStatisticsScreenReturn => {
    const [fromDate, setFromDate] = useState<Date>(new Date(2025, 8, 19, 0, 0)); // Sept 19, 2025
    const [toDate, setToDate] = useState<Date>(new Date(2026, 8, 19, 0, 0)); // Sept 19, 2026
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showFromTimePicker, setShowFromTimePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [showToTimePicker, setShowToTimePicker] = useState(false);

    const formatDateTime = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const formatTime = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    };

    const handleGetData = () => {
        // Format dates for display
        const formattedFromDate = formatDateTime(fromDate);
        const formattedToDate = formatDateTime(toDate);

        console.log("From Date:", formattedFromDate);
        console.log("To Date:", formattedToDate);

        return {
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            fromDateObject: fromDate,
            toDateObject: toDate
        };
    };

    const onFromDateChange = (event: any, selectedDate?: Date) => {
        setShowFromDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFromDate(selectedDate);
        }
    };

    const onFromTimeChange = (event: any, selectedDate?: Date) => {
        setShowFromTimePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFromDate(selectedDate);
        }
    };

    const onToDateChange = (event: any, selectedDate?: Date) => {
        setShowToDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setToDate(selectedDate);
        }
    };

    const onToTimeChange = (event: any, selectedDate?: Date) => {
        setShowToTimePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setToDate(selectedDate);
        }
    };

    return {
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
    };
};

export default useStatisticsScreen;
