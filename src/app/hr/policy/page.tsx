"use client";

import Link from "next/link";

const policies = [
    {
        title: "員工福利手冊",
        category: "福利",
        description: "包含三節禮金、生日禮券、旅遊補助及健檢規範。",
        date: "2024-01-15"
    },
    {
        title: "考勤管理辦法",
        category: "規章",
        description: "上下班打卡規定、遲到早退處理及加班申請流程。",
        date: "2023-12-20"
    },
    {
        title: "資訊安全守則",
        category: "資安",
        description: "公司電腦使用規範、資料保密協定及帳號管理要點。",
        date: "2024-02-01"
    },
    {
        title: "差旅報支規定",
        category: "財務",
        description: "國內外差旅補助標準、交通費實報實銷與住宿津貼。",
        date: "2023-11-10"
    }
];

export default function PolicyPage() {
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
                    <h1 className="text-3xl font-bold tracking-tight text-white">公司政策與福利</h1>
                    <p className="text-slate-400 mt-2">查詢最新的公司規章、員工福利與作業守則</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {policies.map((policy, idx) => (
                        <div key={idx} className="glass p-8 rounded-[2rem] border-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${policy.category === '福利' ? 'text-pink-400 border-pink-500/20 bg-pink-500/10' :
                                        policy.category === '規章' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                                            policy.category === '資安' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                                                'text-amber-400 border-amber-500/20 bg-amber-500/10'
                                    }`}>
                                    {policy.category}
                                </span>
                                <span className="text-xs text-slate-500">{policy.date} 更新</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                                {policy.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                {policy.description}
                            </p>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                點擊查看詳情
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 glass rounded-[2.5rem] border-white/5 bg-emerald-500/5">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">對公司政策有疑問？</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                如果清單中找不到您需要的規章說明，或對福利制度有任何疑義，請隨時聯繫人資部王大同（分機 123）。
                            </p>
                        </div>
                        <button className="md:ml-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all whitespace-nowrap">
                            聯絡人資專員
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
