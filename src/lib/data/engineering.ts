import { Material } from "./materials";

export type EngineeringTab = "drawings" | "bom" | "logs" | "safety" | "reports";

export interface TestRunReport {
    id: string;
    projectId: string;
    projectName: string;
    name: string;
    date: string;
}
export interface BOMItem {
    id: string;
    projectId: string;
    materialId: string;
    name: string;
    requiredQuantity: number;
    currentStock: number;
    unit: string;
}

export interface ConstructionLog {
    id: string;
    projectId: string;
    date: string;
    type: "結構" | "電力";
    description: string;
    items: {
        category: "結構" | "電力";
        description: string;
        quantity: number;
        unit: string;
        totalTarget: number;
    }[];
    mediaUrls: string[];
    videoUrls?: string[];
    author: string;
    isFinalEntry?: boolean;
    workerCount: number;
}

export interface SafetyNotice {
    id: string;
    projectId: string;
    date: string;
    languages: ("ZH" | "EN" | "VI" | "TH" | "ID")[];
    signedBy: string[];
    status: "Completed" | "Pending";
}

export const mockReports: TestRunReport[] = [
    { id: "r1", projectId: "p1", projectName: "台南永康一期工程", name: "完工試運轉報告_v1.pdf", date: "2024-03-10" }
];

export const mockBOM: BOMItem[] = [
    { id: "b1", projectId: "p1", materialId: "SC-05", name: "304六角螺絲", requiredQuantity: 500, currentStock: 20, unit: "顆" },
    { id: "b2", projectId: "p1", materialId: "MT-01", name: "6005T5鋁支架", requiredQuantity: 120, currentStock: 45, unit: "支" },
];

export const mockLogs: ConstructionLog[] = [
    {
        id: "l1",
        projectId: "p1",
        date: "2024-03-08",
        type: "結構",
        description: "完成結構鋁支架初步安裝與螺絲固定，進度符合預期。",
        items: [
            { category: "結構", description: "鋁支架安裝", quantity: 50, unit: "支", totalTarget: 120 },
            { category: "結構", description: "螺絲鎖固", quantity: 200, unit: "顆", totalTarget: 500 },
        ],
        mediaUrls: [],
        workerCount: 5,
        author: "工地主任-張三"
    }
];
