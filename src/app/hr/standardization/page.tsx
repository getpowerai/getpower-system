"use client";

import Link from "next/link";
import { useState } from "react";
import { mockStandardizationData, SOPItem } from "@/lib/data/hr-standardization";

export default function StandardizationPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>(mockStandardizationData[0].id);

    const activeCategory = mockStandardizationData.find(cat => cat.id === selectedCategory);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <Link href="/hr" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        返回人力資源系統
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2">工作作業流程標準化系統</h1>
                    <p className="text-slate-400 text-lg">確保全體系作業一致性與品質規範，打造現代化標桿流程。</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Categories */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-4">作業部門</h2>
                        <div className="flex flex-col gap-2">
                            {mockStandardizationData.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`text-left px-6 py-4 rounded-2xl transition-all font-bold ${selectedCategory === category.id
                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 p-6 glass rounded-3xl border-white/5">
                            <h3 className="text-sm font-bold mb-4">快速操作</h3>
                            <button className="w-full py-3 bg-white/5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors mb-3">
                                建立新 SOP
                            </button>
                            <button className="w-full py-3 border border-white/5 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors">
                                流程審核清單
                            </button>
                        </div>
                    </div>

                    {/* Main Content - SOP Items */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                            <div>
                                <h2 className="text-2xl font-bold">{activeCategory?.name} - 標準作業程序</h2>
                                <p className="text-slate-400 text-sm mt-1">{activeCategory?.items.length} 份文件已上架</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="搜尋 SOP..."
                                        className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeCategory?.items.map((sop: SOPItem) => (
                                <div key={sop.id} className="group glass p-6 rounded-3xl border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${sop.status === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                                                sop.status === "Review" ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-slate-500/10 text-slate-400"
                                            }`}>
                                            {sop.status === "Active" ? "運行中" : sop.status === "Review" ? "審核中" : "草稿"}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">{sop.version}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors">{sop.title}</h3>
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>更新日期: {sop.lastUpdated}</span>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-white/5 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 bg-white/5 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
