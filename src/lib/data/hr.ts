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
    videoUrl?: string; // NEW: Link to video教材
    trainerId: string; // NEW: Assigned evaluator
}

export type TrainingStatus = "Pending" | "InProgress" | "Passed" | "Failed";

export interface TrainingAssignment {
    courseId: string;
    status: TrainingStatus;
    score?: number;
    comments?: string;
    attempts: number;
    assignedDate: string;
    completedDate?: string;
}

export interface TrainingPlan {
    id: string;
    employeeId: string;
    assignments: TrainingAssignment[];
    chiefTrainerId: string; // The person overseeing the overall plan
    status: "Active" | "Completed";
}

export interface ManpowerRequest {
    id: string;
    requesterId: string;
    type: "General" | "Temporary";
    startDate: string;
    endDate?: string; // Optional for General
    estimatedHours?: string; // Optional for Temporary
    jobDescription?: string; // For General
    ageRange?: string; // For General
    education?: string; // For General
    experience?: string; // For General
    purpose: string;
    projectIds: string[];
    status: "Pending" | "Approved" | "Rejected";
    costAllocation?: Record<string, number>;
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
        description: "針對太陽能案場開發的洽談與簽約實務。",
        videoUrl: "https://example.com/videos/sales-1.mp4",
        trainerId: "e1"
    },
    {
        id: "c2",
        title: "台電併網申請流程",
        department: "Design",
        duration: "1.5小時",
        description: "最新併網技術規範與審查要點解析。",
        videoUrl: "https://example.com/videos/design-1.mp4",
        trainerId: "e2"
    },
    {
        id: "c3",
        title: "施工現場安全管理",
        department: "Engineering",
        duration: "3小時",
        description: "高空作業與電氣設備安全標準作業程序。",
        videoUrl: "https://example.com/videos/eng-1.mp4",
        trainerId: "e1"
    },
];

export const mockTrainingPlans: TrainingPlan[] = [
    {
        id: "tp1",
        employeeId: "e4", // 新進員工 ID (假設)
        chiefTrainerId: "e3",
        status: "Active",
        assignments: [
            {
                courseId: "c1",
                status: "Passed",
                score: 85,
                comments: "表現優異，對合約細節掌握度高。",
                attempts: 1,
                assignedDate: "2024-03-01",
                completedDate: "2024-03-05"
            },
            {
                courseId: "c2",
                status: "Failed",
                score: 55,
                comments: "對併網規範理解尚有不足，需重新觀看影片並複習第3章。",
                attempts: 1,
                assignedDate: "2024-03-06",
                completedDate: "2024-03-07"
            },
            {
                courseId: "c3",
                status: "Pending",
                attempts: 0,
                assignedDate: "2024-03-08"
            }
        ]
    }
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
