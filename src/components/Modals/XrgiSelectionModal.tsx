import { MaterialIcons as Icon } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export interface XrgiSystem {
    id: string;
    name: string;
    xrgiID: string;
    modelNumber?: string;
    status: string;
}

interface XrgiSelectionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectSystem: (xrgiId: string) => void;
    systems: XrgiSystem[];
    loading: boolean;
    title: string;
    message: string;
    noSystemsText: string;
    loadingText: string;
    cancelText: string;
    refreshText: string;
    systemLabel: string;
}

const XrgiSelectionModal: React.FC<XrgiSelectionModalProps> = ({
    isVisible,
    onClose,
    onSelectSystem,
    systems,
    loading,
    title,
    message,
    noSystemsText,
    loadingText,
    cancelText,
    refreshText,
    systemLabel,
}) => {
    console.log('systems :', systems);
    const [selectedSystemId, setSelectedSystemId] = useState<string>('');

    const handleSystemSelect = (system: XrgiSystem) => {
        setSelectedSystemId(system.id);
    };

    const handleRefresh = () => {
        if (selectedSystemId) {
            const selectedSystem = systems.find(s => s.id === selectedSystemId);
            if (selectedSystem) {
                onSelectSystem(selectedSystem.xrgiID);
            }
        }
    };

    const renderSystemItem = ({ item }: { item: XrgiSystem }) => (
        <TouchableOpacity
            style={[
                styles.systemItem,
                selectedSystemId === item.id && styles.systemItemSelected,
            ]}
            onPress={() => handleSystemSelect(item)}
            activeOpacity={0.7}
        >
            <View style={styles.systemInfo}>
                <View style={styles.systemHeader}>
                    <Text style={[
                        styles.systemName,
                        selectedSystemId === item.id && styles.systemNameSelected,
                    ]}>
                        XRGI® ID: {item.xrgiID}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.status === 'Active' ? '#10B981' : '#9CA3AF' }
                    ]}>
                        <Text style={styles.statusText}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
            {selectedSystemId === item.id && (
                <Icon name="check-circle" size={24} color="#1E88E5" />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Icon name="settings" size={28} color="#FFFFFF" />
                        </View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <View style={styles.content}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#1E88E5" />
                                <Text style={styles.loadingText}>{loadingText}</Text>
                            </View>
                        ) : systems.length === 0 ? (
                            <View style={styles.noSystemsContainer}>
                                <Icon name="info-outline" size={48} color="#90A4AE" />
                                <Text style={styles.noSystemsText}>{noSystemsText}</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.systemLabel}>{systemLabel}:</Text>
                                <FlatList
                                    data={systems}
                                    renderItem={renderSystemItem}
                                    keyExtractor={(item) => item.id}
                                    style={styles.systemsList}
                                    showsVerticalScrollIndicator={true}
                                />
                            </>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>
                        {!loading && systems.length > 0 && (
                            <TouchableOpacity
                                style={[
                                    styles.refreshButton,
                                    !selectedSystemId && styles.refreshButtonDisabled,
                                ]}
                                onPress={handleRefresh}
                                activeOpacity={0.8}
                                disabled={!selectedSystemId}
                            >
                                <Text style={[
                                    styles.refreshButtonText,
                                    !selectedSystemId && styles.refreshButtonTextDisabled,
                                ]}>
                                    {refreshText}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
        maxWidth: 450,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexShrink: 0,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        color: '#546E7A',
        textAlign: 'center',
        lineHeight: 24,
    },
    content: {
        padding: 24,
        flex: 1,
        minHeight: 200,
        maxHeight: 400,
        overflow: 'hidden',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#90A4AE',
        marginTop: 16,
        textAlign: 'center',
    },
    noSystemsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noSystemsText: {
        fontSize: 16,
        color: '#90A4AE',
        marginTop: 16,
        textAlign: 'center',
    },
    systemLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    systemsList: {
        flex: 1,
        minHeight: 150,
        maxHeight: 300,
    },
    systemItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    systemItemSelected: {
        backgroundColor: '#E3F2FD',
        borderColor: '#1E88E5',
    },
    systemInfo: {
        flex: 1,
    },
    systemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    systemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 12,
    },
    systemNameSelected: {
        color: '#1E88E5',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    xrgiId: {
        fontSize: 14,
        color: '#546E7A',
        marginBottom: 4,
    },
    xrgiIdSelected: {
        color: '#1565C0',
    },
    modelNumber: {
        fontSize: 14,
        color: '#546E7A',
    },
    modelNumberSelected: {
        color: '#1565C0',
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#546E7A',
        textAlign: 'center',
    },
    refreshButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#1E88E5',
    },
    refreshButtonDisabled: {
        backgroundColor: '#B0BEC5',
    },
    refreshButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    refreshButtonTextDisabled: {
        color: '#FFFFFF',
    },
});

export default XrgiSelectionModal;