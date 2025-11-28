import { StyleSheet } from 'react-native';

const tabCommonStyles = StyleSheet.create({
    // Container Styles
    tabContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        padding: 20,
    },

    // Enhanced Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#0f172a',
        fontWeight: '500',
    },

    // Enhanced Card Styles
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardExpanded: {
        borderColor: '#3b82f6',
        borderWidth: 1.5,
        shadowColor: '#3b82f6',
        shadowOpacity: 0.15,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    reportIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },

    // Description
    descriptionContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
    },
    descriptionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    descriptionText: {
        fontSize: 14,
        color: '#0f172a',
        lineHeight: 20,
        fontWeight: '500',
    },

    // Info Grid
    infoGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    infoGridItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    infoIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    infoGridLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    infoGridValue: {
        fontSize: 11,
        color: '#0f172a',
        fontWeight: '700',
    },

    // Expand Indicator
    expandIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    expandLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        gap: 6,
    },
    expandText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3b82f6',
    },

    // Expanded Content
    expandedContent: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1.5,
        borderTopColor: '#e2e8f0',
    },
    resourcesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#e2e8f0',
    },
    resourcesTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginLeft: 10,
    },

    // Table Styles
    tableScrollContainer: {
        marginBottom: 12,
    },
    tableScrollContent: {
        paddingRight: 20,
    },
    tableContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        minWidth: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#e2e8f0',
    },
    tableHeaderText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#ffffff',
    },
    tableRowEven: {
        backgroundColor: '#f9fafb',
    },
    tableCellText: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: '500',
    },

    // Scroll Hint
    scrollHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 6,
        marginBottom: 16,
    },
    scrollHintText: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '500',
        fontStyle: 'italic',
    },

    // Action Buttons
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#3b82f6',
        shadowColor: '#000',
        shadowOpacity: 0.08,
    },
    secondaryButtonText: {
        color: '#3b82f6',
    },

    // Badge Styles
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    activeBadge: {
        backgroundColor: '#d1fae5',
    },
    activeBadgeText: {
        color: '#065f46',
    },
    repairBadge: {
        backgroundColor: '#fef3c7',
    },
    repairBadgeText: {
        color: '#92400e',
    },
    maintenanceBadge: {
        backgroundColor: '#dbeafe',
    },
    maintenanceBadgeText: {
        color: '#1e40af',
    },

    // Info Row (for other tabs)
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    infoRowLast: {
        borderBottomWidth: 0,
    },
    infoLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: '700',
    },

    // Grid Layout (for other tabs)
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        marginHorizontal: -6,
    },
    gridItem: {
        width: '50%',
        paddingHorizontal: 6,
        marginBottom: 12,
    },
    gridCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    gridLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    gridValue: {
        fontSize: 15,
        color: '#0f172a',
        fontWeight: '700',
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 10,
    },
    emptyDescription: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 22,
    },

    // Icon Container
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 16,
    },

    // Section Header
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 16,
        marginTop: 18,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // Accordion
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    accordionContent: {
        paddingTop: 16,
    },

    // File Attachment
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 14,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    fileIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 3,
    },
    fileSize: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    removeFileButton: {
        padding: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginTop: 16,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
        textAlign: 'center',
        maxWidth: 300,
    },
});

export default tabCommonStyles;