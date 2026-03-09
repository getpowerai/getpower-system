"use client";

import Link from "next/link";
import { useState } from "react";
import { mockCourses, mockTrainingPlans, mockEmployees } from "@/lib/data/hr";

export default function TrainingPage() {
    // For demo purposes, we assume logged in user is "e4"
    const currentUserId = "e4";
    const userPlan = mockTrainingPlans.find(p => p.employeeId === currentUserId);
    const user = mockEmployees.find(e => e.id === currentUserId) || { name: "新進員工", role: "培訓生" };

    const [activeVideo, setActiveVideo] = useState<{ title: string, url: string } | null>(null);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <Link href="/hr" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回人資中心
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">我的學習課表</h1>
                        <p className="text-slate-400 font-medium">{user.name}，這是為您量身打造的入職培訓計劃</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <Link href="/hr/training/admin" className="text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-slate-500 transition-all border border-white/5">
                            進入管理後台 (僅權限人員)
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Progress Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-[2.5rem] p-8 border-white/5 sticky top-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                                培訓總覽
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                                    <p className="text-sm text-slate-500 mb-2">完成進度</p>
                                    <div className="flex items-end gap-3 mb-3">
                                        <span className="text-4xl font-mono font-bold text-emerald-400">
                                            {userPlan ? Math.round((userPlan.assignments.filter(a => a.status === "Passed").length / userPlan.assignments.length) * 100) : 0}%
                                        </span>
                                        <span className="text-slate-500 text-sm mb-1 pb-1">
                                            ({userPlan?.assignments.filter(a => a.status === "Passed").length}/{userPlan?.assignments.length} 課程)
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                            style={{ width: `${userPlan ? (userPlan.assignments.filter(a => a.status === "Passed").length / userPlan.assignments.length) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">學習提醒</p>
                                    {userPlan?.assignments.some(a => a.status === "Failed") && (
                                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex gap-3 items-start">
                                            <svg className="w-5 h-5 text-rose-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-xs text-rose-300 leading-relaxed">
                                                有課程考核未通過，請查看師長評語並重新進行訓練。
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="lg:col-span-2 space-y-8 relative">
                        {/* Timeline vertical line */}
                        <div className="absolute left-10 top-8 bottom-8 w-[2px] bg-white/5 -z-10" />

                        {userPlan?.assignments.map((asg, index) => {
                            const course = mockCourses.find(c => c.id === asg.courseId);
                            const trainer = mockEmployees.find(e => e.id === course?.trainerId);

                            return (
                                <div key={index} className="flex gap-8 group">
                                    {/* Timeline Marker */}
                                    <div className="flex-shrink-0 mt-8">
                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-4 border-slate-950 shadow-xl transition-all duration-500 ${asg.status === "Passed" ? "bg-emerald-600 shadow-emerald-500/20" :
                                                asg.status === "Failed" ? "bg-rose-600 shadow-rose-500/20" :
                                                    asg.status === "InProgress" ? "bg-amber-600 shadow-amber-500/20 animate-pulse" : "bg-slate-800"
                                            }`}>
                                            {asg.status === "Passed" ? (
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="text-2xl font-bold text-white/50">{index + 1}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Course Card */}
                                    <div className={`flex-grow glass rounded-[2.5rem] p-8 border-white/5 transition-all duration-300 ${asg.status !== "Pending" ? "hover:border-white/20" : "opacity-60 grayscale hover:grayscale-0"}`}>
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                            <div>
                                                <span className="bg-slate-900 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-400 mb-3 inline-block">
                                                    {course?.department} · {course?.duration}
                                                </span>
                                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                                    {course?.title}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">負責導師</p>
                                                <p className="text-sm font-bold text-emerald-400">{trainer?.name}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                            {course?.description}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-6 text-xs text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                                    指派日: {asg.assignedDate}
                                                </div>
                                                {asg.score !== undefined && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                                        考核分數: <span className={`font-mono font-bold ${asg.score >= 70 ? "text-emerald-400" : "text-rose-400"}`}>{asg.score}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => course?.videoUrl && setActiveVideo({ title: course.title, url: course.videoUrl })}
                                                disabled={asg.status === "Pending" && index > 0 && userPlan?.assignments[index - 1].status !== "Passed"}
                                                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${asg.status === "Passed" ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" :
                                                        asg.status === "Failed" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" :
                                                            "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
                                                    } ${asg.status === "Pending" && index > 0 && userPlan?.assignments[index - 1].status !== "Passed" ? "opacity-30 cursor-not-allowed" : ""}`}
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                </svg>
                                                {asg.status === "Passed" ? "再次觀看" : asg.status === "Failed" ? "重新訓練" : "開始上課"}
                                            </button>
                                        </div>

                                        {asg.comments && (
                                            <div className="mt-4 p-4 bg-white/5 rounded-2xl border-l-4 border-emerald-500/50">
                                                <p className="text-xs text-slate-400 italic">
                                                    導師評語: {asg.comments}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Video Player Modal (Simulation) */}
            {activeVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setActiveVideo(null)} />
                    <div className="relative w-full max-w-5xl aspect-video glass rounded-[3rem] border-white/10 overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="absolute top-8 right-8 z-10">
                            <button onClick={() => setActiveVideo(null)} className="p-4 bg-slate-900/80 backdrop-blur rounded-2xl hover:bg-white/10 transition-colors text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="w-full h-full bg-black flex flex-col items-center justify-center relative group">
                            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent absolute pointer-events-none" />
                            <svg className="w-24 h-24 text-emerald-500/20 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                            <p className="text-emerald-500/50 font-bold uppercase tracking-widest text-sm">正在播放教材: {activeVideo.title}</p>

                            {/* Simulated Controls */}
                            <div className="absolute bottom-12 left-12 right-12">
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-6">
                                    <div className="bg-emerald-500 w-1/3 h-full" />
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <div className="flex gap-8">
                                        <div className="w-4 h-4 bg-white/40 rounded-sm" />
                                        <div className="w-4 h-4 bg-white/40 rounded-sm" />
                                        <div className="w-4 h-4 bg-white/40 rounded-sm" />
                                    </div>
                                    <div className="text-[10px] font-mono text-white/40">12:45 / 35:20</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
