"use client";

import Link from "next/link";
import { useState } from "react";
import { mockSalesProjects } from "@/lib/data/sales";
import { mockManpowerRequests, ManpowerRequest } from "@/lib/data/hr";

export default function ManpowerPage() {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requests, setRequests] = useState<ManpowerRequest[]>(mockManpowerRequests);

    // Form States
    const [requestType, setRequestType] = useState<"General" | "Temporary">("Temporary");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [purpose, setPurpose] = useState("");
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

    const toggleProject = (id: string) => {
        if (selectedProjects.includes(id)) {
            setSelectedProjects(selectedProjects.filter(pid => pid !== id));
        } else {
            setSelectedProjects([...selectedProjects, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newRequest: ManpowerRequest = {
            id: `mr-${Date.now()}`,
            requesterId: "e1", // Default to current mock user
            type: requestType,
            startDate,
            endDate,
            purpose,
            projectIds: selectedProjects,
            status: "Pending"
        };

        setRequests([newRequest, ...requests]);
        setIsRequestModalOpen(false);

        // Reset form
        setStartDate("");
        setEndDate("");
        setPurpose("");
        setSelectedProjects([]);
        setRequestType("Temporary");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/hr" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回人資中心
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">人力需求系統</h1>
                        <p className="text-slate-400 mt-2">集中化管理臨時與一般人力需求申請</p>
                    </div>
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="bg-amber-600 hover:bg-amber-500 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
                    >
                        提出人力申請 +
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    <div className="glass p-8 rounded-[2.5rem] border-white/5">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-xl">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            申請紀錄
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 text-sm">
                                        <th className="pb-4 font-medium">類型</th>
                                        <th className="pb-4 font-medium">時間範圍</th>
                                        <th className="pb-4 font-medium">目的說明</th>
                                        <th className="pb-4 font-medium">關聯專案</th>
                                        <th className="pb-4 font-medium">狀態</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="border-b border-white/5 group">
                                            <td className="py-6">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${req.type === "Temporary"
                                                        ? "bg-amber-500/10 text-amber-500"
                                                        : "bg-blue-500/10 text-blue-400"
                                                    }`}>
                                                    {req.type === "Temporary" ? "臨時需求" : "一般需求"}
                                                </span>
                                            </td>
                                            <td className="py-6 text-slate-300">
                                                {req.startDate.slice(5).replace('-', '.')} - {req.endDate.slice(5).replace('-', '.')}
                                            </td>
                                            <td className="py-6 text-slate-300 font-medium">{req.purpose}</td>
                                            <td className="py-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {req.projectIds.map(pid => {
                                                        const project = mockSalesProjects.find(p => p.id === pid);
                                                        return (
                                                            <span key={pid} className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-slate-400">
                                                                {project ? project.projectName : (pid === 'non-specific' ? '非特定專案' : pid)}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <span className={`flex items-center gap-1.5 ${req.status === "Pending" ? "text-blue-400" : "text-emerald-400"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${req.status === "Pending" ? "bg-blue-400 animate-pulse" : "bg-emerald-400"
                                                        }`} />
                                                    {req.status === "Pending" ? "審核中" : "已核准"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {isRequestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setIsRequestModalOpen(false)}
                    ></div>
                    <div className="glass w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">提出人力需求申請</h2>
                            <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                {["General", "Temporary"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setRequestType(type as any)}
                                        className={`py-4 rounded-2xl border font-bold text-sm transition-all ${requestType === type
                                            ? "bg-amber-600/20 border-amber-600 text-amber-500"
                                            : "bg-slate-900 border-white/10 text-slate-500 hover:border-white/20"
                                            }`}
                                    >
                                        {type === "General" ? "一般人力需求" : "臨時人力需求"}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">開始時間</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">結束時間</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">需求目的說明</label>
                                <textarea
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white h-24 resize-none"
                                    placeholder="例如：將公司材料載運至施工現場..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">關聯專案案場 (可多選，用於成本分攤)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {mockSalesProjects.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => toggleProject(p.id)}
                                            className={`p-3 rounded-xl border text-left text-xs transition-all ${selectedProjects.includes(p.id)
                                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                                : "bg-slate-900 border-white/5 text-slate-500"
                                                }`}
                                        >
                                            {p.projectName}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => toggleProject("non-specific")}
                                        className={`p-3 rounded-xl border text-left text-xs transition-all ${selectedProjects.includes("non-specific")
                                            ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                            : "bg-slate-900 border-white/5 text-slate-400 font-bold"
                                            }`}
                                    >
                                        + 非特定專案 (公司行政)
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all text-white"
                            >
                                確認提出申請
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
