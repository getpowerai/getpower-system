"use client";

import { useState } from "react";
import Link from "next/link";
import { mockTrainingPlans, mockCourses, mockEmployees, TrainingPlan } from "@/lib/data/hr";

export default function TrainingAdminPage() {
    const [plans, setPlans] = useState<TrainingPlan[]>(mockTrainingPlans);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <Link href="/hr/training" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回課程清單
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">培訓管理後台 (主訓者專用)</h1>
                        <p className="text-slate-400 mt-2">擬定新人培訓計劃、進度監控與總體考核</p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
                        + 擬定新培訓計劃
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {plans.map(plan => {
                        const employee = mockEmployees.find(e => e.id === plan.employeeId);
                        const progress = Math.round((plan.assignments.filter(a => a.status === "Passed").length / plan.assignments.length) * 100);

                        return (
                            <div key={plan.id} className="glass rounded-[2rem] border-white/5 p-8 hover:border-white/10 transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold">
                                            {employee?.name.slice(0, 1)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{employee?.name}</h3>
                                            <p className="text-slate-400 text-sm">{employee?.department} · {employee?.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8">
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">培訓進度</p>
                                            <p className="text-2xl font-mono font-bold text-emerald-400">{progress}%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">狀態</p>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${plan.status === "Active" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                                                {plan.status === "Active" ? "進行中" : "已完成"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        課程安排與考核狀況
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {plan.assignments.map((asg, idx) => {
                                            const course = mockCourses.find(c => c.id === asg.courseId);
                                            return (
                                                <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 relative group">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-[10px] font-bold text-slate-500">STEP {idx + 1}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${asg.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" :
                                                                asg.status === "Failed" ? "bg-rose-500/10 text-rose-400" :
                                                                    asg.status === "InProgress" ? "bg-amber-500/10 text-amber-500" :
                                                                        "bg-slate-800 text-slate-400"
                                                            }`}>
                                                            {asg.status === "Passed" ? "通過" :
                                                                asg.status === "Failed" ? "不合格" :
                                                                    asg.status === "InProgress" ? "學習中" : "待指派"}
                                                        </span>
                                                    </div>
                                                    <h5 className="text-sm font-bold text-white mb-1 truncate">{course?.title}</h5>
                                                    <div className="flex justify-between items-end mt-4">
                                                        <div className="text-[10px] text-slate-500">
                                                            導師: {mockEmployees.find(e => e.id === course?.trainerId)?.name}
                                                        </div>
                                                        {asg.score !== undefined && (
                                                            <div className={`text-lg font-mono font-bold ${asg.score >= 70 ? "text-emerald-400" : "text-rose-400"}`}>
                                                                {asg.score}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {asg.status === "Failed" && (
                                                        <div className="mt-3 pt-3 border-t border-white/5">
                                                            <p className="text-[10px] text-rose-400/80 italic leading-snug">
                                                                評語: {asg.comments}
                                                            </p>
                                                            <button className="mt-2 w-full py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-bold rounded-lg transition-colors">
                                                                安排第二次訓練
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <button className="border-2 border-dashed border-white/5 hover:border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-emerald-400 transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-emerald-500/10">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-bold">新增關聯課程</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
