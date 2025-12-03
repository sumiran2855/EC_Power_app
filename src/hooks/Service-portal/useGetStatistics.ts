import { useState } from 'react';

const useStatisticsScreen = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showFromTimePicker, setShowFromTimePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [showToTimePicker, setShowToTimePicker] = useState(false);

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

    const formatDateTime = (date: Date): string => {
        return `${formatDate(date)} ${formatTime(date)}`;
    };

    const onFromDateChange = (event: any, selectedDate?: Date) => {
        setShowFromDatePicker(false);
        if (selectedDate) {
            // Preserve the time when changing date
            const newDate = new Date(fromDate);
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
            setFromDate(newDate);
        }
    };

    const onFromTimeChange = (event: any, selectedDate?: Date) => {
        setShowFromTimePicker(false);
        if (selectedDate) {
            // Preserve the date when changing time
            const newDate = new Date(fromDate);
            newDate.setHours(selectedDate.getHours());
            newDate.setMinutes(selectedDate.getMinutes());
            setFromDate(newDate);
        }
    };

    const onToDateChange = (event: any, selectedDate?: Date) => {
        setShowToDatePicker(false);
        if (selectedDate) {
            const newDate = new Date(toDate);
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
            setToDate(newDate);
        }
    };

    const onToTimeChange = (event: any, selectedDate?: Date) => {
        setShowToTimePicker(false);
        if (selectedDate) {
            // Preserve the date when changing time
            const newDate = new Date(toDate);
            newDate.setHours(selectedDate.getHours());
            newDate.setMinutes(selectedDate.getMinutes());
            setToDate(newDate);
        }
    };

    const handleGetData = () => {
        return {
            fromDate: formatDateTime(fromDate),
            toDate: formatDateTime(toDate),
            fromDateObject: fromDate,
            toDateObject: toDate
        };
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
