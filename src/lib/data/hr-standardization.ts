export interface SOPItem {
    id: string;
    title: string;
    version: string;
    lastUpdated: string;
    status: "Active" | "Draft" | "Review";
    department: string;
}

export interface ProcessCategory {
    id: string;
    name: string;
    items: SOPItem[];
}

export const mockStandardizationData: ProcessCategory[] = [
    {
        id: "dept-engineering",
        name: "工程部",
        items: [
            { id: "sop-eng-1", title: "案場勘查標準作業程序", version: "v1.2", lastUpdated: "2024-01-15", status: "Active", department: "工程部" },
            { id: "sop-eng-2", title: "電力圖說審核規範", version: "v2.0", lastUpdated: "2024-02-10", status: "Active", department: "工程部" },
            { id: "sop-eng-3", title: "施工安全防護查核表", version: "v1.0", lastUpdated: "2024-03-01", status: "Review", department: "工程部" },
        ]
    },
    {
        id: "dept-admin",
        name: "行政部",
        items: [
            { id: "sop-adm-1", title: "員工入職辦理流程", version: "v1.5", lastUpdated: "2023-12-20", status: "Active", department: "行政部" },
            { id: "sop-adm-2", title: "採購申請流程說明", version: "v1.1", lastUpdated: "2024-02-05", status: "Active", department: "行政部" },
        ]
    },
    {
        id: "dept-sales",
        name: "業務部",
        items: [
            { id: "sop-sal-1", title: "客戶開發與簽約流程", version: "v2.1", lastUpdated: "2024-02-28", status: "Active", department: "業務部" },
            { id: "sop-sal-2", title: "案場進案評估標準", version: "v1.0", lastUpdated: "2024-03-05", status: "Draft", department: "業務部" },
        ]
    }
];
