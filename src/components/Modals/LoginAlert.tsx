import { MaterialIcons as Icon } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type LoginAlertType = 'success' | 'error' | 'warning' | 'info';

interface LoginAlertProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: LoginAlertType;
    showIcon?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const LoginAlert: React.FC<LoginAlertProps> = ({
    isVisible,
    onClose,
    title,
    message,
    type = 'info',
    showIcon = true,
    autoClose = true,
    autoCloseDelay = 3000,
}) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    
    const getAlertConfig = () => {
        switch (type) {
            case 'success':
                return { 
                    name: 'check-circle', 
                    iconColor: '#10B981',
                    bgColor: '#D1FAE5',
                    defaultTitle: 'Success'
                }; 
            case 'error':
                return { 
                    name: 'error', 
                    iconColor: '#EF4444',
                    bgColor: '#FEE2E2',
                    defaultTitle: 'Error'
                };
            case 'warning':
                return { 
                    name: 'warning', 
                    iconColor: '#F59E0B',
                    bgColor: '#FEF3C7',
                    defaultTitle: 'Warning'
                }; 
            case 'info':
            default:
                return { 
                    name: 'info', 
                    iconColor: '#3B82F6',
                    bgColor: '#DBEAFE',
                    defaultTitle: 'Information'
                };
        }
    };

    const alertConfig = getAlertConfig();
    const finalTitle = title || alertConfig.defaultTitle;

    useEffect(() => {
        if (isVisible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 8,
            }).start();

            if (autoClose) {
                const timer = setTimeout(() => {
                    handleClose();
                }, autoCloseDelay);
                
                return () => clearTimeout(timer);
            }
        } else {
            slideAnim.setValue(-100);
        }
    }, [isVisible, autoClose, autoCloseDelay]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: -100,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    if (!isVisible) return null;

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <Animated.View 
                    style={[
                        styles.container,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {showIcon && (
                        <View style={[styles.iconSection, { backgroundColor: alertConfig.bgColor }]}>
                            <Icon 
                                name={alertConfig.name as any}
                                size={22} 
                                color={alertConfig.iconColor} 
                            />
                        </View>
                    )}
                    
                    <View style={styles.contentSection}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>
                                {finalTitle}
                            </Text>
                            <Text style={styles.message}>
                                {message}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name="close" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    container: {
        width: '100%',
        borderRadius: 12,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
    },
    iconSection: {
        width: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    contentSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        paddingRight: 12,
    },
    textContainer: {
        flex: 1,
        paddingRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 3,
        letterSpacing: 0.2,
    },
    message: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
});

export default LoginAlert;