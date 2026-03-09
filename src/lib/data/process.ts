export interface Milestone {
    id: string;
    label: string;
    stage: "Regulatory" | "Utility" | "Permit" | "Construction" | "Finalization";
    status: "Completed" | "In-Progress" | "Pending";
    submitDate?: string;
    completeDate?: string;
    expectedDate?: string;
    submissionFile?: string;
    submissionFilesHistory?: string[];
    approvalFile?: string;
    approvalFilesHistory?: string[];
}

export interface ProjectProcess {
    id: string;
    projectName: string;
    salesId?: string; // Link to mockSalesProjects in sales.ts
    milestones: Milestone[];
    lastUpdated: string;
    // Basic Info overrides/cache
    moduleBrand?: string;
    inverterBrand?: string;
    structureType?: string;
    notes?: string;
}

export const mockProcesses: ProjectProcess[] = [
    {
        id: "p1",
        projectName: "台南永康一期工程",
        salesId: "p1",
        lastUpdated: "2024-03-05",
        milestones: [
            { id: "m1", label: "簽約", stage: "Regulatory", status: "Completed", completeDate: "2024-03-01" },
            { id: "m2", label: "台電併聯審查", stage: "Regulatory", status: "Completed", submitDate: "2024-03-02", completeDate: "2024-03-05" },
            { id: "m3", label: "同意備案", stage: "Regulatory", status: "In-Progress", submitDate: "2024-03-06" },
            { id: "m4", label: "台電細部協商", stage: "Utility", status: "Pending" },
            { id: "m5", label: "購電簽約 (PPA)", stage: "Utility", status: "Pending" },
            { id: "m_elec_dwg", label: "電力施工圖說", stage: "Utility", status: "Pending" },
            { id: "m6", label: "建管免雜備查/雜照", stage: "Permit", status: "Pending" },
            { id: "m_struct_dwg", label: "結構施工圖說", stage: "Permit", status: "Pending" },
            { id: "m7", label: "進場施工流程", stage: "Construction", status: "Pending" },
            { id: "m10", label: "完工/試運轉", stage: "Construction", status: "Pending" },
            { id: "m11", label: "台電掛表", stage: "Finalization", status: "Pending" },
            { id: "m12", label: "免雜竣工", stage: "Finalization", status: "Pending" },
            { id: "m13", label: "設備登記", stage: "Finalization", status: "Pending" },
            { id: "m14", label: "開始躉售", stage: "Finalization", status: "Pending" },
        ]
    },
    {
        id: "p2",
        projectName: "台中市北屯區吉陽台中辦公室",
        salesId: "p2",
        lastUpdated: "2024-03-07",
        milestones: [
            { id: "m1", label: "簽約", stage: "Regulatory", status: "Completed", completeDate: "2024-03-07" },
            { id: "m2", label: "台電併聯審查", stage: "Regulatory", status: "In-Progress", submitDate: "2024-03-08" },
            { id: "m3", label: "同意備案", stage: "Regulatory", status: "Pending" },
            { id: "m4", label: "台電細部協商", stage: "Utility", status: "Pending" },
            { id: "m5", label: "購電簽約 (PPA)", stage: "Utility", status: "Pending" },
            { id: "m_elec_dwg", label: "電力施工圖說", stage: "Utility", status: "Pending" },
            { id: "m6", label: "建管免雜備查/雜照", stage: "Permit", status: "Pending" },
            { id: "m_struct_dwg", label: "結構施工圖說", stage: "Permit", status: "Pending" },
            { id: "m7", label: "進場施工流程", stage: "Construction", status: "Pending" },
            { id: "m10", label: "完工/試運轉", stage: "Construction", status: "Pending" },
            { id: "m11", label: "台電掛表", stage: "Finalization", status: "Pending" },
            { id: "m12", label: "免雜竣工", stage: "Finalization", status: "Pending" },
            { id: "m13", label: "設備登記", stage: "Finalization", status: "Pending" },
            { id: "m14", label: "開始躉售", stage: "Finalization", status: "Pending" },
        ]
    },
    {
        id: "p3",
        projectName: "彰化大村二期案場",
        lastUpdated: "2024-03-06",
        milestones: [
            { id: "m1", label: "簽約", stage: "Regulatory", status: "Completed", completeDate: "2024-02-20" },
            { id: "m2", label: "台電併聯審查", stage: "Regulatory", status: "Completed", completeDate: "2024-03-01" },
            { id: "m3", label: "同意備案", stage: "Regulatory", status: "In-Progress", submitDate: "2024-03-05" },
            { id: "m4", label: "台電細部協商", stage: "Utility", status: "Pending" },
            { id: "m5", label: "購電簽約 (PPA)", stage: "Utility", status: "Pending" },
            { id: "m_elec_dwg", label: "電力施工圖說", stage: "Utility", status: "Pending" },
            { id: "m6", label: "建管免雜備查/雜照", stage: "Permit", status: "Pending" },
            { id: "m_struct_dwg", label: "結構施工圖說", stage: "Permit", status: "Pending" },
            { id: "m7", label: "進場施工流程", stage: "Construction", status: "Pending" },
            { id: "m10", label: "完工/試運轉", stage: "Construction", status: "Pending" },
            { id: "m11", label: "台電掛表", stage: "Finalization", status: "Pending" },
            { id: "m12", label: "免雜竣工", stage: "Finalization", status: "Pending" },
            { id: "m13", label: "設備登記", stage: "Finalization", status: "Pending" },
            { id: "m14", label: "開始躉售", stage: "Finalization", status: "Pending" },
        ]
    },
    {
        id: "p4",
        projectName: "屏東枋寮屋頂建置",
        lastUpdated: "2024-03-08",
        milestones: [
            { id: "m1", label: "簽約", stage: "Regulatory", status: "Completed", completeDate: "2024-03-08" },
            { id: "m2", label: "台電併聯審查", stage: "Regulatory", status: "Pending" },
            { id: "m3", label: "同意備案", stage: "Regulatory", status: "Pending" },
            { id: "m4", label: "台電細部協商", stage: "Utility", status: "Pending" },
            { id: "m5", label: "購電簽約 (PPA)", stage: "Utility", status: "Pending" },
            { id: "m_elec_dwg", label: "電力施工圖說", stage: "Utility", status: "Pending" },
            { id: "m6", label: "建管免雜備查/雜照", stage: "Permit", status: "Pending" },
            { id: "m_struct_dwg", label: "結構施工圖說", stage: "Permit", status: "Pending" },
            { id: "m7", label: "進場施工流程", stage: "Construction", status: "Pending" },
            { id: "m10", label: "完工/試運轉", stage: "Construction", status: "Pending" },
            { id: "m11", label: "台電掛表", stage: "Finalization", status: "Pending" },
            { id: "m12", label: "免雜竣工", stage: "Finalization", status: "Pending" },
            { id: "m13", label: "設備登記", stage: "Finalization", status: "Pending" },
            { id: "m14", label: "開始躉售", stage: "Finalization", status: "Pending" },
        ]
    },
    {
        id: "p5",
        projectName: "苗栗頭份廠房屋頂",
        salesId: "p5",
        lastUpdated: "2024-03-01",
        milestones: [
            { id: "m1", label: "簽約", stage: "Regulatory", status: "Completed", completeDate: "2023-10-01" },
            { id: "m2", label: "台電併聯審查", stage: "Regulatory", status: "Completed", completeDate: "2023-11-01" },
            { id: "m3", label: "同意備案", stage: "Regulatory", status: "Completed", completeDate: "2023-11-15" },
            { id: "m4", label: "台電細部協商", stage: "Utility", status: "Completed", completeDate: "2023-12-01" },
            { id: "m5", label: "購電簽約 (PPA)", stage: "Utility", status: "Completed", completeDate: "2023-12-10" },
            { id: "m_elec_dwg", label: "電力施工圖說", stage: "Utility", status: "Completed", completeDate: "2023-12-15" },
            { id: "m6", label: "建管免雜備查/雜照", stage: "Permit", status: "Completed", completeDate: "2024-01-05" },
            { id: "m_struct_dwg", label: "結構施工圖說", stage: "Permit", status: "Completed", completeDate: "2024-01-10" },
            { id: "m7", label: "進場施工流程", stage: "Construction", status: "Completed", completeDate: "2024-02-15" },
            { id: "m10", label: "完工/試運轉", stage: "Construction", status: "Completed", completeDate: "2024-02-20" },
            { id: "m11", label: "台電掛表", stage: "Finalization", status: "Completed", completeDate: "2024-02-25" },
            { id: "m12", label: "免雜竣工", stage: "Finalization", status: "Completed", completeDate: "2024-02-26" },
            { id: "m13", label: "設備登記", stage: "Finalization", status: "Completed", completeDate: "2024-02-28" },
            { id: "m14", label: "開始躉售", stage: "Finalization", status: "Completed", completeDate: "2025-01-15" },
        ]
    }
];
