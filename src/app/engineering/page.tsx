"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { mockProcesses } from "@/lib/data/process";
import { dispatchGPLineMessage } from "@/lib/utils/gpline";
import {
    EngineeringTab,
    BOMItem,
    ConstructionLog,
    SafetyNotice,
    mockBOM,
    mockLogs
} from "@/lib/data/engineering";
import { safetyTranslations, Language } from "@/lib/data/safety-translations";

export interface Drawing {
    id: string;
    projectId: string;
    projectName: string;
    name: string;
    type: "結構" | "電力";
    date: string;
    status: string;
}

export default function EngineeringPage() {
    const [activeTab, setActiveTab] = useState<EngineeringTab>("drawings");
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [bomItems, setBomItems] = useState<BOMItem[]>([]);
    const [logs, setLogs] = useState<ConstructionLog[]>([]);
    const [safetyNotices, setSafetyNotices] = useState<SafetyNotice[]>([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
    const [uploadProjectId, setUploadProjectId] = useState("");
    const [uploadType, setUploadType] = useState<"結構" | "電力">("電力");
    const [uploadStatus, setUploadStatus] = useState<"審核中" | "已核可">("審核中");
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    // Safety Tab States
    const [safetyLang, setSafetyLang] = useState<Language>("ZH");
    const [selectedSafetyProject, setSelectedSafetyProject] = useState("");
    const [safetyForm, setSafetyForm] = useState({
        contractor: "",
        location: "",
        personnel: "",
        workContent: ""
    });
    const [selectedPPE, setSelectedPPE] = useState<string[]>([]);
    const [isSigned, setIsSigned] = useState(false);
    const [signatureName, setSignatureName] = useState("");

    // BOM Modal States
    const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);

    // Log Modal States
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    useEffect(() => {
        // Load Drawings
        const savedDrawings = localStorage.getItem("gp_engineering_drawings");
        if (savedDrawings) {
            setDrawings(JSON.parse(savedDrawings));
        } else {
            setDrawings([
                { id: "d1", projectId: "p1", projectName: "台南永康一期工程", name: "永康案場-結構施工圖-V2.pdf", type: "結構", date: "2024-03-01", status: "已核可" },
                { id: "d2", projectId: "p1", projectName: "台南永康一期工程", name: "永康案場-電力配置圖-V1.pdf", type: "電力", date: "2024-02-28", status: "審核中" },
            ]);
        }

        // Load BOM and Sync with current stock
        const savedBOM = localStorage.getItem("gp_engineering_bom");
        const materialsStr = localStorage.getItem("gp_materials");
        const currentMaterials = materialsStr ? JSON.parse(materialsStr) : [];

        let initialBOM: BOMItem[] = savedBOM ? JSON.parse(savedBOM) : mockBOM;

        // Sync stock quantity from inventory
        const syncedBOM = initialBOM.map(item => {
            const mat = currentMaterials.find((m: any) => m.id === item.materialId || m.name === item.name);
            return {
                ...item,
                currentStock: mat ? mat.stockQuantity : item.currentStock
            };
        });

        setBomItems(syncedBOM);

        // Load Logs
        const savedLogs = localStorage.getItem("gp_engineering_logs");
        if (savedLogs) {
            setLogs(JSON.parse(savedLogs));
        } else {
            setLogs(mockLogs);
        }

        // Handle Query Params for Safety Tab (LINE share)
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "safety") {
            setActiveTab("safety");
            setSafetyForm({
                contractor: params.get("contractor") || "",
                location: params.get("location") || "",
                personnel: new Date().toISOString().split("T")[0],
                workContent: "現場施工安全作業"
            });
        }

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("gp_engineering_drawings", JSON.stringify(drawings));
            localStorage.setItem("gp_engineering_bom", JSON.stringify(bomItems));
            localStorage.setItem("gp_engineering_logs", JSON.stringify(logs));
        }
    }, [drawings, bomItems, logs, isLoaded]);

    const handleShareToLINE = () => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const shareUrl = `${baseUrl}/engineering?tab=safety&contractor=${encodeURIComponent(safetyForm.contractor)}&location=${encodeURIComponent(safetyForm.location)}`;
        const text = `【工程安全危害告知】\n專案：${safetyForm.location || "台南永康案場"}\n請點擊連結進行數位簽章：\n${shareUrl}`;
        window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, "_blank");
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadProjectId || !uploadFile) return;

        const project = mockProcesses.find(p => p.id === uploadProjectId);
        if (!project) return;

        const newDrawing: Drawing = {
            id: `d_${Date.now()}`,
            projectId: project.id,
            projectName: project.projectName,
            name: uploadFile.name,
            type: uploadType,
            date: new Date().toISOString().split('T')[0],
            status: uploadStatus,
        };

        setDrawings([newDrawing, ...drawings]);
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadProjectId("");

        dispatchGPLineMessage(project.id, `工程設計監造部已上傳「${uploadType}」文件 (${uploadFile.name})，目前狀態：${uploadStatus}`, "工程設計監造部門", "工程設計監造部助理");
    };

    const handleUpdateDrawing = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDrawing) return;

        setDrawings(prev => prev.map(d => {
            if (d.id === selectedDrawing.id) {
                return {
                    ...d,
                    status: selectedDrawing.status,
                    name: uploadFile ? uploadFile.name : d.name,
                    date: new Date().toISOString().split('T')[0], // Update date if modified
                };
            }
            return d;
        }));

        setSelectedDrawing(null);
        setUploadFile(null);

        dispatchGPLineMessage(selectedDrawing.projectId, `工程設計監造部已更新「${selectedDrawing.type}」文件狀態為：${selectedDrawing.status}`, "工程設計監造部門", "工程設計監造部助理");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回門戶
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">工程設計監造系統</h1>
                        <p className="text-slate-400 mt-2">施工圖面、BOM需求、施工日誌與安全告知管理</p>
                    </div>
                </header>

                <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
                    {[
                        {
                            id: "drawings", label: "圖面管理", icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )
                        },
                        {
                            id: "bom", label: "物料需求 (BOM)", icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            )
                        },
                        {
                            id: "logs", label: "施工日誌", icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )
                        },
                        {
                            id: "safety", label: "危害告知", icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )
                        },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as EngineeringTab)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === tab.id
                                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        {activeTab === "drawings" && (
                            <div className="glass p-8 rounded-3xl border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        施工圖面清單
                                    </h2>
                                    <button
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-cyan-500/30">
                                        上傳施工圖 +
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {drawings.map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => setSelectedDrawing(doc)}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm group-hover:text-cyan-400 transition-colors">{doc.name}</p>
                                                    <p className="text-[10px] text-slate-500">{doc.projectName} · {doc.type} · {doc.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] px-2 py-1 rounded font-bold ${doc.status === '已核可' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                    {doc.status}
                                                </span>
                                                <svg className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "bom" && (
                            <div className="glass p-8 rounded-3xl border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        物料需求計算 (BOM)
                                    </h2>
                                    <button
                                        onClick={() => setIsBOMModalOpen(true)}
                                        className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-cyan-500/30">
                                        新增 BOM 項目 +
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">料件名稱</th>
                                                <th className="px-4 py-3 font-semibold">需求數量</th>
                                                <th className="px-4 py-3 font-semibold">目前庫存 (總)</th>
                                                <th className="px-4 py-3 font-semibold">建議動作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {bomItems.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-4 py-4 font-medium">{item.name}</td>
                                                    <td className="px-4 py-4 font-mono text-cyan-400">{item.requiredQuantity} {item.unit}</td>
                                                    <td className={`px-4 py-4 font-mono ${item.currentStock < item.requiredQuantity ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                                                        {item.currentStock} {item.unit}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {item.currentStock >= item.requiredQuantity ? (
                                                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                                庫存充足 (可直接出庫)
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-rose-400 text-xs font-bold animate-pulse">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]" />
                                                                庫存不足 (請購作業 PR)
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {bomItems.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">尚未錄入 BOM 項目</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "logs" && (
                            <div className="glass p-8 rounded-3xl border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        數位施工日誌
                                    </h2>
                                    <button
                                        onClick={() => setIsLogModalOpen(true)}
                                        className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-cyan-500/30">
                                        填寫今日日誌 +
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {logs.map((log) => (
                                        <div key={log.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-lg font-bold text-white">{log.date}</p>
                                                    <p className="text-xs text-slate-500">記錄者：{log.author}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {log.mediaUrls.length > 0 && (
                                                        <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-1 rounded font-bold">
                                                            {log.mediaUrls.length} 媒體檔案
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {log.items.map((item, idx) => {
                                                    const percent = Math.round((item.quantity / item.totalTarget) * 100);
                                                    return (
                                                        <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5">
                                                            <div className="flex justify-between text-xs mb-2">
                                                                <span className="text-slate-400">{item.category} / {item.description}</span>
                                                                <span className="text-cyan-400 font-mono">今日: {item.quantity} / 目標: {item.totalTarget}</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${percent}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    {logs.length === 0 && (
                                        <div className="text-center py-12 text-slate-500">尚無施工記錄</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "safety" && (
                            <div className="glass p-4 md:p-8 rounded-3xl border-white/5 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {safetyTranslations[safetyLang].title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={handleShareToLINE}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-green-500/20"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 10.304c0-5.231-5.383-9.486-12-9.486-6.617 0-12 4.255-12 9.486 0 4.691 4.269 8.618 10.031 9.349.39.085.92.258 1.058.591.121.291.079.746.039 1.042l-.171 1.025c-.053.304-.251 1.192 1.085.65 1.336-.541 7.203-4.242 9.833-7.257 1.83-2.094 2.134-3.564 2.134-5.4z" />
                                            </svg>
                                            分享至 LINE 簽章
                                        </button>
                                        <div className="flex flex-wrap gap-1.5 border-l border-white/10 pl-3">
                                            {(["ZH", "EN", "VI", "TH", "ID"] as Language[]).map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setSafetyLang(lang)}
                                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${safetyLang === lang
                                                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                                                        : "border-white/10 text-slate-400 hover:border-white/30"
                                                        }`}>
                                                    {lang === "ZH" ? "繁體中文" : lang === "EN" ? "English" : lang === "VI" ? "Tiếng Việt" : lang === "TH" ? "ไทย" : "Bahasa Indonesia"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Project Selection for Auto-fill */}
                                <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">
                                            快速帶入專案快照 (Quick Project Info)
                                        </label>
                                        <select
                                            value={selectedSafetyProject}
                                            onChange={(e) => {
                                                const projectId = e.target.value;
                                                setSelectedSafetyProject(projectId);
                                                const project = mockProcesses.find(p => p.id === projectId);
                                                if (project) {
                                                    setSafetyForm(prev => ({
                                                        ...prev,
                                                        location: project.projectName
                                                    }));
                                                }
                                            }}
                                            disabled={isSigned}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all disabled:opacity-50"
                                        >
                                            <option value="">請選擇專案以帶入名稱...</option>
                                            {mockProcesses.map(p => (
                                                <option key={p.id} value={p.id}>{p.projectName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="hidden md:block w-px h-12 bg-white/10" />
                                    <div className="text-slate-500 text-xs italic leading-relaxed md:max-w-[200px]">
                                        選擇專案後，系統會自動將專案名稱帶入下方的「施工區域/地點」欄位。
                                    </div>
                                </div>

                                {/* Header Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                                    {(Object.keys(safetyTranslations[safetyLang].form) as Array<keyof typeof safetyForm>).map((key) => (
                                        <div key={key}>
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                                {safetyTranslations[safetyLang].form[key]}
                                            </label>
                                            <input
                                                type="text"
                                                value={safetyForm[key]}
                                                onChange={(e) => setSafetyForm({ ...safetyForm, [key]: e.target.value })}
                                                disabled={isSigned}
                                                placeholder="..."
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-50"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* PPE Checklist */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                        {safetyTranslations[safetyLang].ppeTitle}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {Object.entries(safetyTranslations[safetyLang].ppeItems).map(([id, label]) => (
                                            <label key={id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedPPE.includes(id)
                                                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-100"
                                                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedPPE.includes(id)}
                                                    onChange={() => {
                                                        if (isSigned) return;
                                                        setSelectedPPE(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
                                                    }}
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedPPE.includes(id) ? "bg-cyan-500 border-cyan-500" : "border-white/20"
                                                    }`}>
                                                    {selectedPPE.includes(id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className="text-xs font-medium truncate">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Hazard Categories */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        {safetyTranslations[safetyLang].hazardTitle}
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(safetyTranslations[safetyLang].hazards).map(([key, item]) => (
                                            <div key={key} className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl group hover:bg-amber-500/10 transition-all">
                                                <h4 className="text-amber-400 font-bold text-sm mb-1">{item.title}</h4>
                                                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 border-dashed text-center">
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        {safetyTranslations[safetyLang].legalNote}
                                    </p>
                                </div>

                                {/* Footer Sign-off */}
                                <div className="pt-8 border-t border-white/10 space-y-6">
                                    {!isSigned ? (
                                        <div className="bg-cyan-500/10 p-8 rounded-3xl border border-cyan-500/20 text-center space-y-6">
                                            <div className="max-w-xs mx-auto">
                                                <label className="block text-xs font-bold text-cyan-500 mb-3 tracking-widest uppercase">
                                                    工地人員端簽署 Signature
                                                </label>
                                                <input
                                                    type="text"
                                                    value={signatureName}
                                                    onChange={(e) => setSignatureName(e.target.value)}
                                                    placeholder="請輸入姓名 / Please enter name"
                                                    className="w-full bg-white/10 border border-cyan-500/30 rounded-2xl px-6 py-4 text-center text-lg font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500 transition-all mb-4"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!signatureName.trim()) return;
                                                    setIsSigned(true);
                                                }}
                                                className="w-full max-w-sm mx-auto bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-cyan-500/20 transition-all flex justify-center items-center gap-3 transform active:scale-95 text-lg"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                {safetyTranslations[safetyLang].signOff}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-500/10 p-8 rounded-3xl border border-emerald-500/20 text-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-black text-emerald-400 mb-2">
                                                {safetyTranslations[safetyLang].signedStatus}
                                            </h3>
                                            <div className="text-slate-400 text-sm space-y-1 mb-8 font-mono">
                                                <p>{safetyTranslations[safetyLang].timestampLabel}: {new Date().toLocaleString()}</p>
                                                <p>Signee: {signatureName}</p>
                                                <p>Location: {safetyForm.location || "台南永康案場"}</p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <button
                                                    onClick={() => {
                                                        const text = `【危害告知簽署完成】\n人員: ${signatureName}\n地點: ${safetyForm.location}\n時間: ${new Date().toLocaleString()}\n請安心施工。`;
                                                        navigator.clipboard.writeText(text);
                                                        alert("已複製 LINE 訊息狀態，可直接傳送給師傅或工地群組！");
                                                    }}
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 10.304c0-5.231-5.383-9.486-12-9.486-6.617 0-12 4.255-12 9.486 0 4.691 4.269 8.618 10.031 9.349.39.085.92.258 1.058.591.121.291.079.746.039 1.042l-.171 1.025c-.053.304-.251 1.192 1.085.65 1.336-.541 7.203-4.242 9.833-7.257 1.83-2.094 2.134-3.564 2.134-5.4z" />
                                                    </svg>
                                                    {safetyTranslations[safetyLang].copyLine}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl border-white/5 bg-cyan-500/5">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                專案導管說明
                            </h3>
                            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                                <div>
                                    <p className="text-white font-bold mb-1">圖面 → BOM</p>
                                    <p>上傳核可施工圖後，請至 BOM 分頁錄入料件，系統會自動比對總分庫存。</p>
                                </div>
                                <div>
                                    <p className="text-white font-bold mb-1">數量化日誌</p>
                                    <p>日誌現在支援按「數量」記錄。數據將累積成為公司專案 Big Data。</p>
                                </div>
                                <div>
                                    <p className="text-white font-bold mb-1">外籍勞工友善</p>
                                    <p>安全告知提供四國語言，支持手機端直接簽核。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
                    <div className="glass w-full max-w-md rounded-[2.5rem] p-10 relative animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-xl">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                上傳施工圖面
                            </h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">所屬專案</label>
                                <select
                                    className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white"
                                    value={uploadProjectId}
                                    onChange={e => setUploadProjectId(e.target.value)}
                                    required
                                >
                                    <option value="">請選擇專案...</option>
                                    {mockProcesses.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">圖面類型</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {["電力", "結構"].map(type => (
                                        <label key={type} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="drawingType"
                                                className="sr-only peer"
                                                checked={uploadType === type}
                                                onChange={() => setUploadType(type as any)}
                                            />
                                            <div className="text-center py-3 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 transition-all text-sm font-medium text-slate-300 peer-checked:text-cyan-400">
                                                {type}施工圖
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">文件狀態</label>
                                <div className="flex gap-4">
                                    {["審核中", "已核可"].map(status => (
                                        <label key={status} className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="uploadStatus"
                                                className="sr-only peer"
                                                checked={uploadStatus === status}
                                                onChange={() => setUploadStatus(status as any)}
                                            />
                                            <div className="text-center py-3 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 transition-all text-sm font-medium text-slate-300 peer-checked:text-cyan-400">
                                                {status === "審核中" ? "送件文件 (審核中)" : "核准/完成文件 (已核可)"}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">圖面檔案 (PDF/DWG)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                        className="sr-only"
                                        required
                                    />
                                    <label htmlFor="fileUpload" className="w-full flex items-center gap-3 px-4 py-3 border border-white/20 bg-slate-900 rounded-xl cursor-pointer hover:border-cyan-500 transition-colors">
                                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className={`text-sm ${uploadFile ? "text-white" : "text-slate-500"} truncate block w-full`}>
                                            {uploadFile ? uploadFile.name : "選擇檔案..."}
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all text-white flex justify-center items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    確認上傳
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedDrawing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setSelectedDrawing(null); setUploadFile(null); }} />
                    <div className="glass w-full max-w-md rounded-[2.5rem] p-10 relative animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-xl">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                修改圖面資枓
                            </h2>
                            <button onClick={() => { setSelectedDrawing(null); setUploadFile(null); }} className="text-slate-400 hover:text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateDrawing} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">專案</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-not-allowed"
                                    value={selectedDrawing.projectName}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">圖面類型</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-not-allowed"
                                    value={selectedDrawing.type + "施工圖"}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">審核狀態</label>
                                <div className="flex gap-4">
                                    {["審核中", "已核可"].map(status => (
                                        <label key={status} className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="drawingStatus"
                                                className="sr-only peer"
                                                checked={selectedDrawing.status === status}
                                                onChange={() => setSelectedDrawing({ ...selectedDrawing, status })}
                                            />
                                            <div className="text-center py-3 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500 transition-all text-sm font-medium text-slate-300 peer-checked:text-emerald-400">
                                                {status}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">重新上傳圖面 (選填)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="editFileUpload"
                                        onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                        className="sr-only"
                                    />
                                    <label htmlFor="editFileUpload" className="w-full flex items-center gap-3 px-4 py-3 border border-white/20 bg-slate-900 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span className={`text-sm ${uploadFile ? "text-white" : "text-slate-500"} truncate block w-full`}>
                                            {uploadFile ? uploadFile.name : `原檔案: ${selectedDrawing.name}`}
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all text-white flex justify-center items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    儲存變更
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedDrawing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setSelectedDrawing(null); setUploadFile(null); }} />
                    <div className="glass w-full max-w-md rounded-[2.5rem] p-10 relative animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-xl">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                修改圖面資枓
                            </h2>
                            <button onClick={() => { setSelectedDrawing(null); setUploadFile(null); }} className="text-slate-400 hover:text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateDrawing} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">專案</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-not-allowed"
                                    value={selectedDrawing.projectName}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">圖面類型</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-not-allowed"
                                    value={selectedDrawing.type + "施工圖"}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">審核狀態</label>
                                <div className="flex gap-4">
                                    {["審核中", "已核可"].map(status => (
                                        <label key={status} className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="drawingStatus"
                                                className="sr-only peer"
                                                checked={selectedDrawing.status === status}
                                                onChange={() => setSelectedDrawing({ ...selectedDrawing, status })}
                                            />
                                            <div className="text-center py-3 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500 transition-all text-sm font-medium text-slate-300 peer-checked:text-emerald-400">
                                                {status}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">重新上傳圖面 (選填)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="editFileUpload"
                                        onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                        className="sr-only"
                                    />
                                    <label htmlFor="editFileUpload" className="w-full flex items-center gap-3 px-4 py-3 border border-white/20 bg-slate-900 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span className={`text-sm ${uploadFile ? "text-white" : "text-slate-500"} truncate block w-full`}>
                                            {uploadFile ? uploadFile.name : `原檔案: ${selectedDrawing.name}`}
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all text-white flex justify-center items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    儲存變更
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
