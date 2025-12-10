import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: AlertType;
    buttonText?: string;
    showIcon?: boolean;
}

const Alert: React.FC<AlertProps> = ({
    isVisible,
    onClose,
    title,
    message,
    type = 'info',
    buttonText = 'OK',
    showIcon = true,
}) => {
    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return { name: 'check-circle', color: '#10B981' }; 
            case 'error':
                return { name: 'error', color: '#EF4444' };
            case 'warning':
                return { name: 'warning', color: '#F59E0B' }; 
            case 'info':
            default:
                return { name: 'info', color: '#3B82F6' };
        }
    };

    const iconConfig = getIconConfig();

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
                    {showIcon && (
                        <View style={styles.iconContainer}>
                            <Icon 
                                name={iconConfig.name as any}
                                size={60} 
                                color={iconConfig.color} 
                            />
                        </View>
                    )}
                    
                    {title && <Text style={[styles.title, { color: iconConfig.color }]}>{title}</Text>}
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: iconConfig.color }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Alert;