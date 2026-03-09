"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { mockProcesses } from "@/lib/data/process";
import { dispatchGPLineMessage } from "@/lib/utils/gpline";

export interface DesignDoc {
    id: string;
    projectId: string;
    projectName: string;
    name: string;
    type: "台電細部協商" | "建管免雜備查";
    date: string;
    status: "審核中" | "已核可";
}

export default function DesignPage() {
    const [documents, setDocuments] = useState<DesignDoc[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DesignDoc | null>(null);
    const [uploadProjectId, setUploadProjectId] = useState("");
    const [uploadType, setUploadType] = useState<"台電細部協商" | "建管免雜備查">("台電細部協商");
    const [uploadStatus, setUploadStatus] = useState<"審核中" | "已核可">("審核中");
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("gp_design_documents");
        if (saved) {
            setDocuments(JSON.parse(saved));
        } else {
            // Initial mock data
            setDocuments([
                { id: "ds1", projectId: "p2", projectName: "吉陽台中辦公室案場", name: "台電細部協商-申請書.pdf", type: "台電細部協商", date: "2024-03-05", status: "審核中" },
            ]);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("gp_design_documents", JSON.stringify(documents));
        }
    }, [documents, isLoaded]);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadProjectId || !uploadFile) return;

        const project = mockProcesses.find(p => p.id === uploadProjectId);
        if (!project) return;

        const newDoc: DesignDoc = {
            id: `ds_${Date.now()}`,
            projectId: project.id,
            projectName: project.projectName,
            name: uploadFile.name,
            type: uploadType,
            date: new Date().toISOString().split('T')[0],
            status: uploadStatus,
        };

        setDocuments([newDoc, ...documents]);
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadProjectId("");

        dispatchGPLineMessage(project.id, `設計部已上傳「${uploadType}」文件 (${uploadFile.name})，目前狀態：${uploadStatus}`, "設計部門", "設計助理");
    };

    const handleUpdateDocument = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDocument) return;

        setDocuments(prev => prev.map(d => {
            if (d.id === selectedDocument.id) {
                return {
                    ...d,
                    status: selectedDocument.status,
                    name: uploadFile ? uploadFile.name : d.name,
                    date: new Date().toISOString().split('T')[0],
                };
            }
            return d;
        }));

        setSelectedDocument(null);
        setUploadFile(null);

        dispatchGPLineMessage(selectedDocument.projectId, `設計部已更新「${selectedDocument.type}」文件狀態為：${selectedDocument.status}`, "設計部門", "設計助理");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回門戶
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">設計系統 (行政送審)</h1>
                        <p className="text-slate-400 mt-2">台電電網細部協商與縣市政府建管處免雜項執照備查文件管理</p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-amber-600 hover:bg-amber-500 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform">
                        上傳送審文件 +
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass p-8 rounded-3xl border-white/5">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                即時送審進度清單
                            </h2>
                            <div className="space-y-4">
                                {documents.length === 0 && (
                                    <div className="text-center py-12 text-slate-500 italic">暫無送審文件</div>
                                )}
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setSelectedDocument(doc)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                                                <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm group-hover:text-amber-400 transition-colors">{doc.name}</p>
                                                <p className="text-[10px] text-slate-500">{doc.projectName} · {doc.type} · {doc.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] px-2 py-1 rounded font-bold ${doc.status === '已核可' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {doc.status}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl border-white/5 bg-amber-500/5">
                            <h3 className="font-bold mb-4 text-amber-400">設計系統職責</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                設計部門負責與台電及建管單位進行技術協商與送審。
                            </p>
                            <ul className="text-xs text-slate-500 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">•</span>
                                    台電細部協商：確保電網併聯容量與技術細節符合法規。
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">•</span>
                                    建管免雜備查：取得合法施工之行政文件，確保後續請領補助。
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Upload Modal */}
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
                        <div className="glass w-full max-w-md rounded-[2.5rem] p-10 relative animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-amber-400">
                                    <div className="p-2 bg-amber-500/20 rounded-xl">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    上傳送審文件
                                </h2>
                                <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white p-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleUpload} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">所屬專案</label>
                                    <select
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                                        value={uploadProjectId}
                                        onChange={e => setUploadProjectId(e.target.value)}
                                        required
                                    >
                                        <option value="">請選擇專案...</option>
                                        {mockProcesses.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">文件類型</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["台電細部協商", "建管免雜備查"].map(type => (
                                            <label key={type} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="docType"
                                                    className="sr-only peer"
                                                    checked={uploadType === type}
                                                    onChange={() => setUploadType(type as any)}
                                                />
                                                <div className="text-center py-4 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-amber-500/20 peer-checked:border-amber-500 transition-all text-xs font-bold text-slate-300 peer-checked:text-amber-400">
                                                    {type}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">文件狀態</label>
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
                                                <div className="text-center py-3 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-amber-500/20 peer-checked:border-amber-500 transition-all text-xs font-bold text-slate-300 peer-checked:text-amber-400">
                                                    {status === "審核中" ? "送件文件 (審核中)" : "核准/完成文件 (已核可)"}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">檔案上傳 (PDF/DWG)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                            className="sr-only"
                                            required
                                        />
                                        <label htmlFor="fileUpload" className="w-full flex items-center gap-3 px-4 py-3 border border-white/20 bg-slate-900 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
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
                                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/20 transition-all text-white flex justify-center items-center gap-2">
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
                {selectedDocument && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setSelectedDocument(null); setUploadFile(null); }} />
                        <div className="glass w-full max-w-md rounded-[2.5rem] p-10 relative animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-emerald-400">
                                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    修改送審資枓/進度
                                </h2>
                                <button onClick={() => { setSelectedDocument(null); setUploadFile(null); }} className="text-slate-400 hover:text-white p-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleUpdateDocument} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">專案</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-not-allowed"
                                        value={selectedDocument.projectName}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">送審類型</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-not-allowed"
                                        value={selectedDocument.type}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">審核狀態</label>
                                    <div className="flex gap-4">
                                        {["審核中", "已核可"].map(status => (
                                            <label key={status} className="flex-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="docStatus"
                                                    className="sr-only peer"
                                                    checked={selectedDocument.status === status}
                                                    onChange={() => setSelectedDocument({ ...selectedDocument, status: status as any })}
                                                />
                                                <div className="text-center py-3 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500 transition-all text-xs font-bold text-slate-300 peer-checked:text-emerald-400">
                                                    {status}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 font-bold uppercase tracking-widest">重新上傳文件 (選填)</label>
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
                                                {uploadFile ? uploadFile.name : `原檔案: ${selectedDocument.name}`}
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
        </div>
    );
}
