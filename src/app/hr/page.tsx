"use client";

import Link from "next/link";
import { useState } from "react";

const hrModules = [
    {
        id: "training",
        name: "教育訓練系統",
        description: "各部門專屬數位課程與培訓進度追蹤",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        color: "bg-blue-600",
        href: "/hr/training",
    },
    {
        id: "policy",
        name: "公司政策與福利",
        description: "內部規章、福利制度與公告資訊查詢",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: "bg-emerald-600",
        href: "/hr/policy",
    },
    {
        id: "manpower",
        name: "人力需求系統",
        description: "一般與臨時人力申請，支持跨專案成本分攤",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        color: "bg-amber-600",
        href: "/hr/manpower",
    },
];

export default function HRPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        返回門戶
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">人力資源系統</h1>
                    <p className="text-slate-400 mt-2">教育訓練、規章制度與人力資源調度管理</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hrModules.map((module) => (
                        <Link
                            key={module.id}
                            href={module.href}
                            className="group relative glass p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 border-white/5 hover:border-white/20 hover:-translate-y-2"
                        >
                            <div className={`w-14 h-14 ${module.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                <div className="text-white">
                                    {module.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">
                                {module.name}
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {module.description}
                            </p>

                            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-3xl border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-emerald-500 rounded-full" />
                            最新公告
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-xs text-emerald-400 font-bold mb-1 block">2024-03-07</span>
                                <h4 className="font-bold text-white mb-2">113年度員工健康檢查即日起開放預約</h4>
                                <p className="text-xs text-slate-400">請登入系統查詢合約診所與梯次安排...</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-xs text-emerald-400 font-bold mb-1 block">2024-03-05</span>
                                <h4 className="font-bold text-white mb-2">內部教育訓練：案場安全規範專題講座</h4>
                                <p className="text-xs text-slate-400">地點：三樓會議室｜講者：沈工程師...</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full" />
                            我的學習進度
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">業務開發實務</span>
                                    <span className="text-blue-400">85%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">太陽能板轉換效率計算</span>
                                    <span className="text-blue-400">40%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all text-center">
                            查看所有課程
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
