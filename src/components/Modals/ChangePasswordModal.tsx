import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ChangePasswordModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (oldPassword: string, newPassword: string) => void;
    loading?: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isVisible,
    onClose,
    onSubmit,
    loading = false,
}) => {
    const { t } = useTranslation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{
        oldPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!oldPassword.trim()) {
            newErrors.oldPassword = t('changePassword.errors.currentPasswordRequired');
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = t('changePassword.errors.newPasswordRequired');
        } else if (newPassword.length < 8) {
            newErrors.newPassword = t('changePassword.errors.newPasswordMinLength');
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            newErrors.newPassword = t('changePassword.errors.newPasswordComplexity');
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = t('changePassword.errors.confirmPasswordRequired');
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = t('changePassword.errors.passwordsDoNotMatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(oldPassword, newPassword);
            // Reset form on successful submission
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
        }
    };

    const handleClose = () => {
        if (!loading) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
            onClose();
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="key-outline" size={28} color="#3B82F6" />
                        </View>
                        <Text style={styles.title}>{t('changePassword.title')}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            disabled={loading}
                        >
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        {/* Old Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('changePassword.currentPassword')}</Text>
                            <View style={[styles.inputContainer, errors.oldPassword && styles.inputError]}>
                                <TextInput
                                    style={styles.input}
                                    value={oldPassword}
                                    onChangeText={(text) => {
                                        setOldPassword(text);
                                        if (errors.oldPassword) {
                                            setErrors({ ...errors, oldPassword: undefined });
                                        }
                                    }}
                                    placeholder={t('changePassword.currentPasswordPlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry={!showOldPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowOldPassword(!showOldPassword)}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name={showOldPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#64748B"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.oldPassword && (
                                <Text style={styles.errorText}>{errors.oldPassword}</Text>
                            )}
                        </View>

                        {/* New Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('changePassword.newPassword')}</Text>
                            <View style={[styles.inputContainer, errors.newPassword && styles.inputError]}>
                                <TextInput
                                    style={styles.input}
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        if (errors.newPassword) {
                                            setErrors({ ...errors, newPassword: undefined });
                                        }
                                        if (errors.confirmPassword && confirmPassword) {
                                            setErrors({ ...errors, confirmPassword: undefined });
                                        }
                                    }}
                                    placeholder={t('changePassword.newPasswordPlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry={!showNewPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#64748B"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.newPassword && (
                                <Text style={styles.errorText}>{errors.newPassword}</Text>
                            )}
                            <Text style={styles.helperText}>
                                {t('changePassword.helperText')}
                            </Text>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('changePassword.confirmNewPassword')}</Text>
                            <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                                <TextInput
                                    style={styles.input}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (errors.confirmPassword) {
                                            setErrors({ ...errors, confirmPassword: undefined });
                                        }
                                    }}
                                    placeholder={t('changePassword.confirmNewPasswordPlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry={!showConfirmPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#64748B"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            )}
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>{t('changePassword.cancel')}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                loading && styles.confirmButtonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.confirmButtonText}>
                                {loading ? t('changePassword.updating') : t('changePassword.update')}
                            </Text>
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
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    formContainer: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    inputError: {
        borderColor: '#EF4444',
        borderWidth: 2,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    eyeIcon: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 6,
        marginLeft: 4,
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 6,
        marginLeft: 4,
        fontStyle: 'italic',
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
        justifyContent: 'center',
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
        backgroundColor: '#3B82F6',
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

export default ChangePasswordModal;
