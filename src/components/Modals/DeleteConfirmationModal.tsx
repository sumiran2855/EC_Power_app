import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DeleteConfirmationModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isVisible,
    onClose,
    onConfirm,
    itemName = '',
    loading = false,
}) => {
    const { t } = useTranslation();
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
                        <View style={styles.iconBackground}>
                            <Icon 
                                name="warning" 
                                size={32} 
                                color="#FFFFFF" 
                            />
                        </View>
                    </View>
                    
                    <Text style={styles.title}>
                        {t('modals.deleteConfirmation.title')}
                    </Text>
                    <Text style={styles.message}>
                        {t('modals.deleteConfirmation.message', { itemName: itemName ? ` "${itemName}"` : '' })}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>{t('modals.deleteConfirmation.cancelButton')}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton, loading && styles.confirmButtonDisabled]}
                            onPress={onConfirm}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <Text style={styles.confirmButtonText}>{t('modals.deleteConfirmation.deletingButton')}</Text>
                            ) : (
                                <Text style={styles.confirmButtonText}>{t('modals.deleteConfirmation.deleteButton')}</Text>
                            )}
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
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EF4444',
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
    warningText: {
        color: '#EF4444',
        fontWeight: '500',
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
        backgroundColor: '#EF4444',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    confirmButtonDisabled: {
        backgroundColor: '#FCA5A5',
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DeleteConfirmationModal;
