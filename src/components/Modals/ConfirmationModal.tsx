import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ConfirmationType = 'warning' | 'error' | 'info' | 'success';

interface ConfirmationModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: ConfirmationType;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    onClose,
    onConfirm,
    title,
    message,
    type = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
}) => {
    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return { name: 'check-circle', color: '#FFFFFF', bgColor: '#10B981' };
            case 'error':
                return { name: 'error', color: '#FFFFFF', bgColor: '#EF4444' };
            case 'warning':
                return { name: 'warning', color: '#FFFFFF', bgColor: '#F59E0B' };
            case 'info':
            default:
                return { name: 'info', color: '#FFFFFF', bgColor: '#3B82F6' };
        }
    };

    const getConfirmButtonStyle = () => {
        switch (type) {
            case 'success':
                return { backgroundColor: '#10B981', shadowColor: '#10B981' };
            case 'error':
                return { backgroundColor: '#EF4444', shadowColor: '#EF4444' };
            case 'warning':
                return { backgroundColor: '#F59E0B', shadowColor: '#F59E0B' };
            case 'info':
            default:
                return { backgroundColor: '#3B82F6', shadowColor: '#3B82F6' };
        }
    };

    const iconConfig = getIconConfig();
    const confirmButtonStyle = getConfirmButtonStyle();

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconBackground, { backgroundColor: iconConfig.bgColor, shadowColor: iconConfig.bgColor }]}>
                            <Icon 
                                name={iconConfig.name as any}
                                size={32} 
                                color={iconConfig.color} 
                            />
                        </View>
                    </View>
                    
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                styles.button, 
                                styles.confirmButton, 
                                confirmButtonStyle,
                                loading && styles.confirmButtonDisabled
                            ]}
                            onPress={onConfirm}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconBackground: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
        color: '#1F2937',
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    confirmButtonDisabled: {
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ConfirmationModal;
