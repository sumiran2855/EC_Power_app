import { useNavigation, useRoute } from '@react-navigation/native';

export interface CallData {
    id: string;
    timeOfCall: string;
    cause: string;
    currentStatus: string;
    latestIncident: string;
    statusOfIncident: string;
}

interface UseStatisticsResultReturn {
    callsData: CallData[];
    fromDate: string;
    toDate: string;
    handleBackButton: () => void;
    getStatusColor: (status: string) => string;
    getStatusBackground: (status: string) => string;
}

const useStatisticsResult = (): UseStatisticsResultReturn => {
    const navigation = useNavigation();
    const route = useRoute();
    const { fromDate, toDate } = route.params as { fromDate: string; toDate: string };

    // Sample data - replace with actual API data
    const callsData: CallData[] = [
        {
            id: "1",
            timeOfCall: "19-09-2025 14:30",
            cause: "System Error",
            currentStatus: "Resolved",
            latestIncident: "Database timeout",
            statusOfIncident: "Closed"
        },
        {
            id: "2",
            timeOfCall: "20-09-2025 09:15",
            cause: "Network Issue",
            currentStatus: "In Progress",
            latestIncident: "Connection lost",
            statusOfIncident: "Open"
        },
        {
            id: "3",
            timeOfCall: "21-09-2025 16:45",
            cause: "Hardware Failure",
            currentStatus: "Pending",
            latestIncident: "Disk failure",
            statusOfIncident: "Under Review"
        },
        {
            id: "4",
            timeOfCall: "22-09-2025 11:20",
            cause: "Software Bug",
            currentStatus: "Resolved",
            latestIncident: "Memory leak",
            statusOfIncident: "Closed"
        },
        {
            id: "5",
            timeOfCall: "23-09-2025 08:00",
            cause: "Power Outage",
            currentStatus: "-",
            latestIncident: "-",
            statusOfIncident: "-"
        }
    ];

    const handleBackButton = () => {
        navigation.goBack();
    };

    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'resolved':
            case 'closed':
                return '#10B981';
            case 'in progress':
            case 'open':
                return '#F59E0B';
            case 'pending':
            case 'under review':
                return '#3B82F6';
            default:
                return '#6B7280';
        }
    };

    const getStatusBackground = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'resolved':
            case 'closed':
                return '#D1FAE5';
            case 'in progress':
            case 'open':
                return '#FEF3C7';
            case 'pending':
            case 'under review':
                return '#DBEAFE';
            default:
                return '#F3F4F6';
        }
    };

    return {
        callsData,
        fromDate,
        toDate,
        handleBackButton,
        getStatusColor,
        getStatusBackground
    };
};

export default useStatisticsResult;
