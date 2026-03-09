export interface Material {
    id: string;
    code: string; // e.g., SC-01
    name: string;
    category: string;
    categoryCode: string;
    specification: string;
    unit: string;
    lastUnitPrice: number;
    supplierName: string;
    brand?: string;
    stockQuantity: number;
}

export interface Supplier {
    id: string;
    name: string;
    contact: string;
    phone: string;
    email: string;
    categoryPreferences?: string[]; // Array of category codes they specialize in
}

export const mockSuppliers: Supplier[] = [
    { id: "s1", name: "岡山東穎", contact: "", phone: "", email: "", categoryPreferences: ["SC"] },
    { id: "s2", name: "東日實業", contact: "", phone: "", email: "", categoryPreferences: ["SC"] },
    { id: "s3", name: "法隆", contact: "", phone: "", email: "", categoryPreferences: ["MT"] },
    { id: "s4", name: "民鎰", contact: "", phone: "", email: "", categoryPreferences: ["ST"] },
    { id: "s5", name: "緻揚", contact: "", phone: "", email: "", categoryPreferences: ["ST"] },
    { id: "s6", name: "研華", contact: "", phone: "", email: "", categoryPreferences: ["LC"] },
    { id: "s7", name: "寬福", contact: "", phone: "", email: "", categoryPreferences: ["LC"] },
    { id: "s8", name: "日煬", contact: "", phone: "", email: "", categoryPreferences: ["LC"] },
];

export const mockMaterials: Material[] = [
    // SC - 螺絲
    { id: "sc01", code: "SC-01", name: "304四角螺絲", category: "螺絲", categoryCode: "SC", specification: "", unit: "顆", lastUnitPrice: 0, supplierName: "岡山東穎", stockQuantity: 500 },
    { id: "sc02", code: "SC-02", name: "304四角螺絲", category: "螺絲", categoryCode: "SC", specification: "m8-40", unit: "顆", lastUnitPrice: 0, supplierName: "岡山東穎", stockQuantity: 1200 },
    { id: "sc03", code: "SC-03", name: "304四角螺絲", category: "螺絲", categoryCode: "SC", specification: "m8-55", unit: "顆", lastUnitPrice: 0, supplierName: "岡山東穎", stockQuantity: 800 },
    { id: "sc05", code: "SC-05", name: "304六角螺絲", category: "螺絲", categoryCode: "SC", specification: "m8-25", unit: "顆", lastUnitPrice: 0, supplierName: "岡山東穎", stockQuantity: 1500 },
    { id: "sc11", code: "SC-11", name: "304法蘭帽", category: "螺絲", categoryCode: "SC", specification: "5/16\"", unit: "顆", lastUnitPrice: 0, supplierName: "東日實業", stockQuantity: 2000 },
    { id: "sc12", code: "SC-12", name: "304尼龍螺母", category: "螺絲", categoryCode: "SC", specification: "m8", unit: "顆", lastUnitPrice: 0, supplierName: "東日實業", stockQuantity: 1800 },
    // MT - 腳座支架
    { id: "mt01", code: "MT-01", name: "6005T5鋁支架", category: "腳座支架", categoryCode: "MT", specification: "40*30", unit: "支", lastUnitPrice: 0, supplierName: "法隆", stockQuantity: 45 },
    { id: "mt04", code: "MT-04", name: "h腳座(一般)", category: "腳座支架", categoryCode: "MT", specification: "DCSL049-60-270", unit: "個", lastUnitPrice: 0, supplierName: "法隆", stockQuantity: 120 },
    { id: "mt10", code: "MT-10", name: "35mm平鋪中壓", category: "腳座支架", categoryCode: "MT", specification: "CSL084-70-35N", unit: "個", lastUnitPrice: 0, supplierName: "法隆", stockQuantity: 350 },
    { id: "mt11", code: "MT-11", name: "35mm側壓", category: "腳座支架", categoryCode: "MT", specification: "DCSL060B-70-35N", unit: "個", lastUnitPrice: 0, supplierName: "法隆", stockQuantity: 280 },
    // ST - 自攻釘
    { id: "st01", code: "ST-01", name: "410自攻釘", category: "自攻釘", categoryCode: "ST", specification: "12番2\"", unit: "顆", lastUnitPrice: 0, supplierName: "民鎰", stockQuantity: 5000 },
    { id: "st05", code: "ST-05", name: "410自攻釘", category: "自攻釘", categoryCode: "ST", specification: "12番4\"", unit: "顆", lastUnitPrice: 0, supplierName: "民鎰", stockQuantity: 3000 },
    { id: "st11", code: "ST-11", name: "XP自攻釘", category: "自攻釘", categoryCode: "ST", specification: "14番2\"", unit: "顆", lastUnitPrice: 0, supplierName: "緻揚", stockQuantity: 2500 },
    // PP - 管材
    { id: "pp01", code: "PP-01", name: "EMT管", category: "管材", categoryCode: "PP", specification: "1/2英吋", unit: "支", lastUnitPrice: 0, supplierName: "", stockQuantity: 80 },
    { id: "pp05", code: "PP-05", name: "RSG管(熱浸鍍鋅)", category: "管材", categoryCode: "PP", specification: "1英吋", unit: "支", lastUnitPrice: 0, supplierName: "", stockQuantity: 60 },
    { id: "pp13", code: "PP-13", name: "鋁線槽", category: "管材", categoryCode: "PP", specification: "50(W)*50(H)*1.6(T)", unit: "支", lastUnitPrice: 0, supplierName: "", stockQuantity: 40 },
    // WR - 線材
    { id: "wr01", code: "WR-01", name: "PV線", category: "線材", categoryCode: "WR", specification: "4mm2", unit: "米", lastUnitPrice: 0, supplierName: "", stockQuantity: 1200 },
    { id: "wr04", code: "WR-04", name: "XLPE線", category: "線材", categoryCode: "WR", specification: "8mm2", unit: "米", lastUnitPrice: 0, supplierName: "", stockQuantity: 800 },
    { id: "wr17", code: "WR-17", name: "PVC線", category: "線材", categoryCode: "WR", specification: "3.5mm2", unit: "米", lastUnitPrice: 0, supplierName: "", stockQuantity: 500 },
    { id: "wr32", code: "WR-32", name: "網路線", category: "線材", categoryCode: "WR", specification: "CAT5E/24AWG", unit: "米", lastUnitPrice: 0, supplierName: "", stockQuantity: 300 },
    // LC - 資料收集器
    { id: "lc01", code: "LC-01", name: "資料收集器", category: "資料收集器", categoryCode: "LC", brand: "研華", specification: "SIM卡+SD卡", unit: "個", lastUnitPrice: 0, supplierName: "研華", stockQuantity: 5 },
    { id: "lc17", code: "LC-17", name: "日照計", category: "資料收集器", categoryCode: "LC", specification: "使用12V/1A變壓器", unit: "個", lastUnitPrice: 0, supplierName: "寬福", stockQuantity: 8 },
    { id: "lc20", code: "LC-20", name: "溫度計", category: "資料收集器", categoryCode: "LC", specification: "TS-01A PT100 10M", unit: "個", lastUnitPrice: 0, supplierName: "日煬", stockQuantity: 12 },
    // SM - 模組
    { id: "sm02", code: "SM-02", name: "模組", category: "模組", categoryCode: "SM", brand: "Anji", specification: "AJB-AH1A-460", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 460 },
    { id: "sm03", code: "SM-03", name: "模組", category: "模組", categoryCode: "SM", brand: "Anji", specification: "AJB-AH1B-545", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 240 },
    { id: "sm04", code: "SM-04", name: "模組", category: "模組", categoryCode: "SM", brand: "GINTUNG", specification: "GTEC-470D9D6A", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 180 },
    { id: "sm05", code: "SM-05", name: "模組", category: "模組", categoryCode: "SM", brand: "GINTUNG", specification: "GTEC-550G9B6C", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 150 },
    { id: "sm06", code: "SM-06", name: "模組", category: "模組", categoryCode: "SM", brand: "JA SOLOR", specification: "JAM72D30-545/MB", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 320 },
    { id: "sm07", code: "SM-07", name: "模組", category: "模組", categoryCode: "SM", brand: "LONGi", specification: "LR5-72HBD-545M", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 500 },
    { id: "sm08", code: "SM-08", name: "模組", category: "模組", categoryCode: "SM", brand: "LONGi", specification: "LR5-72HPH-545M", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 400 },
    { id: "sm09", code: "SM-09", name: "模組", category: "模組", categoryCode: "SM", brand: "LONGi", specification: "LR8-66HGD-610M", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 220 },
    { id: "sm10", code: "SM-10", name: "模組", category: "模組", categoryCode: "SM", brand: "LONGi", specification: "LR8-66HGD-625M", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 180 },
    { id: "sm11", code: "SM-11", name: "模組", category: "模組", categoryCode: "SM", brand: "TSEC", specification: "TS60-AMH-370 H1", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 600 },
    { id: "sm12", code: "SM-12", name: "模組", category: "模組", categoryCode: "SM", brand: "VSUN", specification: "VSUN440N-108BMH-DG", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 440 },
    { id: "sm13", code: "SM-13", name: "模組", category: "模組", categoryCode: "SM", brand: "VSUN", specification: "VSUN445N-108BMH-DG", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 445 },
    { id: "sm14", code: "SM-14", name: "模組", category: "模組", categoryCode: "SM", brand: "VSUN", specification: "VSUN485N-108BMH-DG", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 485 },
    { id: "sm15", code: "SM-15", name: "模組", category: "模組", categoryCode: "SM", brand: "VSUN", specification: "VSUN495N-108BMH-DG", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 495 },
    { id: "sm16", code: "SM-16", name: "模組", category: "模組", categoryCode: "SM", brand: "URE", specification: "D2K340H7A", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 340 },
    { id: "sm31", code: "SM-31", name: "模組", category: "模組", categoryCode: "SM", brand: "AUO", specification: "PM060MH8-475", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 475 },
    { id: "sm35", code: "SM-35", name: "模組", category: "模組", categoryCode: "SM", brand: "AUO", specification: "PM060NT8-490", unit: "個", lastUnitPrice: 0, supplierName: "", stockQuantity: 490 },
    // IV - 變流器
    { id: "iv01", code: "IV-01", name: "變流器", category: "變流器", categoryCode: "IV", brand: "Delta 台達", specification: "M30G_120", unit: "台", lastUnitPrice: 0, supplierName: "", stockQuantity: 12 },
    { id: "iv02", code: "IV-02", name: "變流器", category: "變流器", categoryCode: "IV", brand: "Delta 台達", specification: "M70A_260", unit: "台", lastUnitPrice: 0, supplierName: "", stockQuantity: 8 },
    { id: "iv03", code: "IV-03", name: "變流器", category: "變流器", categoryCode: "IV", brand: "Sungrow 陽光", specification: "SG33CX", unit: "台", lastUnitPrice: 0, supplierName: "", stockQuantity: 5 },
    { id: "iv04", code: "IV-04", name: "變流器", category: "變流器", categoryCode: "IV", brand: "Sungrow 陽光", specification: "SG110CX", unit: "台", lastUnitPrice: 0, supplierName: "", stockQuantity: 3 },
    { id: "iv05", code: "IV-05", name: "變流器", category: "變流器", categoryCode: "IV", brand: "Growatt", specification: "MID 30KTL3-X", unit: "台", lastUnitPrice: 0, supplierName: "", stockQuantity: 15 },
    { id: "iv06", code: "IV-06", name: "變流器", category: "變流器", categoryCode: "IV", brand: "Primevolt", specification: "PV-20000T-U", unit: "台", lastUnitPrice: 0, supplierName: "", stockQuantity: 10 },
];
