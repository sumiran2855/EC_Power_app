import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollView: {
        flex: 1,
        marginTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        zIndex: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingRight: 12,
    },
    headerSpacer: {
        flex: 1,
    },

    // User Guide Card Styles
    guideCard: {
        backgroundColor: '#E3F2FD',
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBDEFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    guideHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 18,
    },
    guideTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1565C0',
        flex: 1,
    },
    guideDescription: {
        fontSize: 14,
        color: '#424242',
        lineHeight: 20,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    guideButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2196F3',
        gap: 8,
    },
    buttonIcon: {
        fontSize: 16,
    },
    guideButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1976D2',
    },

    // Form Section Styles
    formSection: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#212121',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#757575',
        lineHeight: 20,
        marginBottom: 24,
    },

    // Input Group Styles
    inputGroup: {
        marginBottom: 24,
        position: 'relative',
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#424242',
        marginBottom: 8,
    },
    required: {
        color: '#F44336',
    },

    // Select Input Styles
    selectInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 50,
    },
    placeholderText: {
        fontSize: 15,
        color: '#9E9E9E',
    },
    selectedText: {
        fontSize: 15,
        color: '#212121',
        fontWeight: '500',
    },
    dropdownIcon: {
        fontSize: 12,
        color: '#757575',
        transform: [{ rotate: '0deg' }],
    },
    dropdownIconOpen: {
        transform: [{ rotate: '180deg' }],
    },

    // Dropdown List Styles (replaces modal)
    dropdownList: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 250,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    dropdownItemSelected: {
        backgroundColor: '#E3F2FD',
    },
    dropdownText: {
        fontSize: 15,
        color: '#424242',
        fontWeight: '500',
    },
    dropdownTextSelected: {
        color: '#1976D2',
        fontWeight: '600',
    },
    checkmark: {
        fontSize: 18,
        color: '#2196F3',
        fontWeight: '700',
    },

    // TextArea Styles
    textArea: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#212121',
        minHeight: 120,
        maxHeight: 200,
    },
    charCount: {
        fontSize: 12,
        color: '#9E9E9E',
        textAlign: 'right',
        marginTop: 6,
    },

    // Submit Button Styles
    submitButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#BDBDBD',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});