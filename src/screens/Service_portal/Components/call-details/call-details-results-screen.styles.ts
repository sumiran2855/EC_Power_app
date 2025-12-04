import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    // Header
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
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1E293B",
    },
    headerSpacer: {
        width: 40,
    },

    // Content
    content: {
        flex: 1,
    },

    // Title Card
    titleCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    titleHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    titleText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginLeft: 8,
    },
    serialNumber: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 16,
    },
    distributorCard: {
        backgroundColor: "#F1F5F9",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    distributorIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#053472ff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    distributorText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#334155",
    },

    // Section
    section: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 8,
    },
    sectionValue: {
        fontSize: 15,
        color: "#1E293B",
    },

    // Status Section
    statusSection: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    statusSectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#3B82F6",
        marginBottom: 16,
    },

    // Data Row
    dataRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    dataLabel: {
        fontSize: 13,
        color: "#64748B",
        marginBottom: 4,
    },
    dataValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1E293B",
    },

    // Incidents Section
    incidentsSection: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    incidentCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 12,
        overflow: "hidden",
    },
    incidentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#FAFBFC",
    },
    incidentHeaderLeft: {
        flex: 1,
    },
    incidentTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#3B82F6",
        marginBottom: 4,
    },
    incidentHeaderRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    incidentDate: {
        fontSize: 13,
        color: "#64748B",
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    incidentContent: {
        padding: 16,
        paddingTop: 8,
    },

    // Loading and Empty States
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: "#64748B",
        marginTop: 8,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    noDataTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1E293B",
        marginTop: 16,
        marginBottom: 8,
    },
    noDataSubTitle: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 4,
    },

    // Action Button
    newSearchButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3B82F6",
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 10,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    newSearchButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        marginLeft: 8,
    },

    // Bottom Spacer
    bottomSpacer: {
        height: 32,
    },
});

export default styles;