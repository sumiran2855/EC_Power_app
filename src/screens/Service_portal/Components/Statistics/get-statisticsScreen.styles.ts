import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
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
        borderBottomColor: '#E2E8F0',
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    titleSection: {
        marginBottom: 32,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    noteContainer: {
        backgroundColor: '#FEF3C7',
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
    },
    noteText: {
        fontSize: 14,
        color: '#92400E',
        lineHeight: 20,
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
    },
    dateTimePickerContainer: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    dateTimeRow: {
        flexDirection: 'row',
    },
    dateInputWrapper: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
    },
    timeInputWrapper: {
        width: 100,
    },
    inputTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 52,
    },
    inputContent: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 11,
        color: '#94A3B8',
        marginBottom: 2,
        fontWeight: '500',
    },
    inputValue: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '500',
    },
    inputPlaceholder: {
        fontSize: 15,
        color: '#CBD5E1',
    },
    inputIcon: {
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 32,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonStyle: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    getDataButton: {
        backgroundColor: '#1E40AF',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    backButtonText: {
        color: '#475569',
    },
    getDataButtonText: {
        color: '#FFFFFF',
    },
});

export default styles;