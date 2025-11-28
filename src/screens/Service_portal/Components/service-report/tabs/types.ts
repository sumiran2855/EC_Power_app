export interface Resource {
    workType: string;
    resourceQuantity: string;
    deliveryCreationDate: string;
    unit: string;
    serviceTechnician: string;
}

export interface ItemUsage {
    description: string;
    partNumber: string;
    unit: string;
    serialNumber: string;
    quantity: string;
}

export interface ServiceReport {
    id: string;
    Service_Report_Number: string;
    creatingDate: {
        serviceType: string | null;
        serviceDescription: string;
        creationDate: string;
        deliveryDate: string;
    };
    resources: Resource[];
    itemUsages: ItemUsage[];
    xrgiID: string;
    customerID: string;
    createdAt: string;
    updatedAt: string;
}