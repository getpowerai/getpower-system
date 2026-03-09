export interface Customer {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
}

export interface SalesProject {
    id: string;
    customerId: string;
    projectName: string;
    moduleBrand: string;
    inverterBrand: string;
    expectedCompletion: string;
    projectType: "Roof" | "Ground";
    structureType: string;
    status: "Lead" | "Signed" | "PM_Notified";
    contractDate?: string;
    contractFileName?: string;
    notes?: string;
}

export const mockCustomers: Customer[] = [
    { id: "c1", name: "宏達綠能科技", contactPerson: "王大同", phone: "0912-345-678", email: "tt.wang@hontagreen.com" },
    { id: "c2", name: "陽光住宅管委會", contactPerson: "陳小姐", phone: "0923-456-789", email: "sunnyres@outlook.com" },
    { id: "c3", name: "吉陽能源科技有限公司", contactPerson: "林經理", phone: "0934-567-890", email: "service@jiyang.com" },
];

export const mockSalesProjects: SalesProject[] = [
    {
        id: "p1",
        customerId: "c1",
        projectName: "台南永康一期工程",
        moduleBrand: "隆基 (Longi)",
        inverterBrand: "陽光能源 (Sungrow)",
        expectedCompletion: "2024-12-31",
        projectType: "Roof",
        structureType: "浪板 (Wave board)",
        status: "PM_Notified",
        contractDate: "2024-03-01",
        notes: "屋主預計月底出國，需在那之前完成現勘。"
    },
    {
        id: "p2",
        customerId: "c3",
        projectName: "台中市北屯區吉陽台中辦公室",
        moduleBrand: "Anji",
        inverterBrand: "Growatt",
        expectedCompletion: "2024-06-30",
        projectType: "Roof",
        structureType: "防水型鋼構",
        status: "Signed",
        contractDate: "2024-03-07",
        notes: "辦公室頂樓結構較特殊，需加強支撐件。"
    },
];
