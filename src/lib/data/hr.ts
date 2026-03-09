export interface Employee {
    id: string;
    name: string;
    department: "Sales" | "Design" | "Engineering" | "Finance" | "HR" | "O&M";
    role: string;
    avatar?: string;
}

export interface TrainingCourse {
    id: string;
    title: string;
    department: string;
    duration: string;
    description: string;
    thumbnail?: string;
}

export interface ManpowerRequest {
    id: string;
    requesterId: string;
    type: "General" | "Temporary";
    startDate: string;
    endDate: string;
    purpose: string;
    projectIds: string[]; // Can be specific or non-specific
    status: "Pending" | "Approved" | "Rejected";
    costAllocation?: Record<string, number>; // ProjectId -> Percentage
}

export const mockEmployees: Employee[] = [
    { id: "e1", name: "張小王", department: "Engineering", role: "資深工程師" },
    { id: "e2", name: "李小明", department: "Sales", role: "業務經理" },
    { id: "e3", name: "王大同", department: "HR", role: "人資專員" },
];

export const mockCourses: TrainingCourse[] = [
    {
        id: "c1",
        title: "業務開發進階技巧",
        department: "Sales",
        duration: "2小時",
        description: "針對太陽能案場開發的洽談與簽約實務。"
    },
    {
        id: "c2",
        title: "台電併網申請流程",
        department: "Design",
        duration: "1.5小時",
        description: "最新併網技術規範與審查要點解析。"
    },
    {
        id: "c3",
        title: "施工現場安全管理",
        department: "Engineering",
        duration: "3小時",
        description: "高空作業與電氣設備安全標準作業程序。"
    },
];

export const mockManpowerRequests: ManpowerRequest[] = [
    {
        id: "mr1",
        requesterId: "e2",
        type: "Temporary",
        startDate: "2024-03-20",
        endDate: "2024-03-21",
        purpose: "台南案場材料載運與現場點交",
        projectIds: ["p1"],
        status: "Pending"
    }
];
