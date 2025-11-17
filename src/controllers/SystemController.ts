import { StorageService } from "@/utils/secureStorage";

export class SystemController {
    static async GetSystemStatus() {
        try {
            const response = await fetch('https://service.ecpower.dk/rest/service/v1/plant/statistics/api/status', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log("response", response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("data", data);
            return data;
        } catch (error) {
            console.log("Error getting system status", error);
            throw error;
        }
    }
}
