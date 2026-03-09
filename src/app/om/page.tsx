import Link from "next/link";

export default function OMPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/" className="text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回門戶
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">維運系統</h1>
                        <p className="text-slate-400 mt-2">電廠運作監控、定期維護出工記錄及零件損耗成本分析</p>
                    </div>
                    <button className="bg-teal-600 hover:bg-teal-500 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform">
                        新增維運派工 +
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-slate-500 text-sm mb-1">本月出工人次</p>
                        <p className="text-3xl font-bold text-teal-400">24</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-slate-500 text-sm mb-1">平均維護成本/kW</p>
                        <p className="text-3xl font-bold text-teal-400">$12.5</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-slate-500 text-sm mb-1">異常告警</p>
                        <p className="text-3xl font-bold text-rose-400">0</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/10 bg-teal-500/10">
                        <p className="text-slate-500 text-sm mb-1 text-white">正常運行電廠</p>
                        <p className="text-3xl font-bold text-white">100%</p>
                    </div>
                </div>

                <div className="mt-12 glass p-8 rounded-3xl border-white/5">
                    <h2 className="text-xl font-bold mb-6">近期出工記錄</h2>
                    <div className="space-y-4">
                        {[
                            { site: "台南永康一期", date: "2024-03-04", tech: "李小龍", task: "定期逆變器檢查", material: "無" },
                            { site: "彰化和美太陽能", date: "2024-03-02", tech: "陳真", task: "模組清洗", material: "零件 SC-01 (10個)" },
                        ].map((log, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-500/30 transition-all">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">案場名稱</p>
                                        <p className="font-bold text-sm">{log.site}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">日期</p>
                                        <p className="text-sm">{log.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">技術員 / 任務</p>
                                        <p className="text-sm font-medium">{log.tech} · {log.task}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">耗用材料</p>
                                        <p className="text-sm text-teal-400">{log.material}</p>
                                    </div>
                                </div>
                                <button className="ml-4 text-slate-500 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
