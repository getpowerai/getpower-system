"use client";

import Link from "next/link";
import { useState } from "react";
import { mockCourses } from "@/lib/data/hr";

const departments = ["All", "Sales", "Design", "Engineering", "Finance", "HR"];

export default function TrainingPage() {
    const [selectedDept, setSelectedDept] = useState("All");

    const filteredCourses = selectedDept === "All"
        ? mockCourses
        : mockCourses.filter(c => c.department === selectedDept);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <Link href="/hr" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        返回人資中心
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-white px-2">教育訓練系統</h1>
                </header>

                <div className="flex flex-wrap gap-4 mb-8">
                    {departments.map(dept => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedDept === dept
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                                }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="glass rounded-[2rem] overflow-hidden border-white/5 group hover:border-emerald-500/30 transition-all">
                            <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/40 via-transparent to-transparent" />
                                </div>
                                <svg className="w-16 h-16 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                                </svg>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                                        {course.department}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        {course.title}
                                    </h3>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">{course.duration}</span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                    {course.description}
                                </p>
                                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-emerald-600 transition-all font-bold text-sm text-slate-300 hover:text-white">
                                    開始上課
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-24 glass rounded-[3rem] border-dashed border-white/10">
                        <p className="text-slate-500">此部門暫時沒有上架課程</p>
                    </div>
                )}
            </div>
        </div>
    );
}
