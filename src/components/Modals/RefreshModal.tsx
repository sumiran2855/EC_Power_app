import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface RefreshModalProps {
    isVisible: boolean;
    onClose: () => void;
    isLoading: boolean;
    title: string;
    message: string;
    waitMessage: string;
    okButtonText: string;
}

const RefreshModal: React.FC<RefreshModalProps> = ({
    isVisible,
    onClose,
    isLoading,
    title,
    message,
    waitMessage,
    okButtonText,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconWrapper}>
                            <Icon name="refresh" size={28} color="#FFFFFF" />
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1E88E5" />
                            <Text style={styles.loadingText}>{waitMessage}</Text>
                        </View>
                    )}

                    {!isLoading && (
                        <TouchableOpacity
                            style={styles.okButton}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.okButtonText}>{okButtonText}</Text>
                        </TouchableOpacity>
                    )}
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
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: width * 0.85,
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    iconContainer: {
        marginBottom: 16,
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#546E7A',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    loadingText: {
        fontSize: 14,
        color: '#90A4AE',
        marginTop: 12,
        textAlign: 'center',
    },
    okButton: {
        backgroundColor: '#1E88E5',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        minWidth: 100,
    },
    okButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default RefreshModal;