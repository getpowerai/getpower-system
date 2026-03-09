import { Material } from "./materials";

export type EngineeringTab = "drawings" | "bom" | "logs" | "safety";

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
    items: {
        category: "結構" | "電力";
        description: string;
        quantity: number;
        unit: string;
        totalTarget: number;
    }[];
    mediaUrls: string[];
    author: string;
}

export interface SafetyNotice {
    id: string;
    projectId: string;
    date: string;
    languages: ("ZH" | "EN" | "VI" | "TH" | "ID")[];
    signedBy: string[];
    status: "Completed" | "Pending";
}

export const mockBOM: BOMItem[] = [
    { id: "b1", projectId: "p1", materialId: "SC-05", name: "304六角螺絲", requiredQuantity: 500, currentStock: 20, unit: "顆" },
    { id: "b2", projectId: "p1", materialId: "MT-01", name: "6005T5鋁支架", requiredQuantity: 120, currentStock: 45, unit: "支" },
];

export const mockLogs: ConstructionLog[] = [
    {
        id: "l1",
        projectId: "p1",
        date: "2024-03-08",
        items: [
            { category: "結構", description: "鋁支架安裝", quantity: 50, unit: "支", totalTarget: 120 },
            { category: "結構", description: "螺絲鎖固", quantity: 200, unit: "顆", totalTarget: 500 },
        ],
        mediaUrls: [],
        author: "工地主任-張三"
    }
];
