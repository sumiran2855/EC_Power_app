export interface ConfigDetail {
    label: string;
    value: string;
}

export interface ConfigItem {
    id: string;
    timestamp: string;
    isExpanded: boolean;
    details: ConfigDetail[];
}