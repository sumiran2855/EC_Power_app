import { MaterialIcons as Icon } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EnergyCheckReportModalProps {
    isVisible: boolean;
    onClose: () => void;
    onGenerateReport: (selectedMonth: string) => void;
    previousMonth: string;
    isGenerating?: boolean;
}

const EnergyCheckReportModal: React.FC<EnergyCheckReportModalProps> = ({
    isVisible,
    onClose,
    onGenerateReport,
    previousMonth,
    isGenerating = false,
}) => {
    const [isMonthSelected, setIsMonthSelected] = useState(false);

    React.useEffect(() => {
        if (!isVisible) {
            setIsMonthSelected(false);
        }
    }, [isVisible]);

    const handleMonthSelect = () => {
        setIsMonthSelected(true);
    };

    const handleGenerateReport = () => {
        if (isMonthSelected) {
            onGenerateReport(previousMonth);
            onClose();
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                {/* Close Button - Above Modal */}
                <TouchableOpacity
                    style={styles.closeButtonAbove}
                    onPress={onClose}
                    activeOpacity={0.7}
                >
                    <Icon name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.container}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Create EnergyCheck Report</Text>
                    </View>

                    {/* Question */}
                    <Text style={styles.question}>
                        For which month do you want to generate the report?
                    </Text>

                    {/* Month Selection */}
                    <View style={styles.monthSelectionContainer}>
                        <TouchableOpacity
                            style={[styles.monthOption, isMonthSelected && styles.monthOptionSelected]}
                            onPress={handleMonthSelect}
                            activeOpacity={0.8}
                        >
                            <Icon name="calendar-today" size={20} color="#3b82f6" />
                            <Text style={styles.monthText}>{previousMonth}</Text>
                            {isMonthSelected ? (
                                <Icon name="check-circle" size={20} color="#10b981" />
                            ) : (
                                <Icon name="radio-button-unchecked" size={20} color="#9ca3af" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Generate Button */}
                    <TouchableOpacity
                        style={[styles.generateButton, !isMonthSelected && styles.generateButtonDisabled]}
                        onPress={handleGenerateReport}
                        disabled={!isMonthSelected || isGenerating}
                        activeOpacity={isMonthSelected && !isGenerating ? 0.8 : 0.5}
                    >
                        {isGenerating ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Icon name="file-download" size={20} color="#fff" />
                        )}
                        <Text style={styles.generateButtonText}>
                            {isGenerating ? 'Generating...' : 'Generate Report'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    closeButtonAbove: {
        position: 'absolute',
        top: 240,
        right: 180,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 20,
        padding: 8,
        zIndex: 2,
        borderWidth: 2,
        borderColor: '#646363ff',
    },
    container: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a365d',
    },
    question: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 24,
    },
    monthSelectionContainer: {
        marginBottom: 24,
    },
    monthOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 16,
    },
    monthOptionSelected: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
    },
    monthText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1a365d',
        flex: 1,
        textAlign: 'center',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        gap: 8,
    },
    generateButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EnergyCheckReportModal;
