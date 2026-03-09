import Link from "next/link";

export default function FinancePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto text-center py-24">
                <Link href="/" className="text-rose-400 hover:text-rose-300 transition-colors flex items-center justify-center gap-2 mb-8">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回門戶
                </Link>
                <div className="w-20 h-20 bg-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4">財務系統</h1>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                    整合專案成本核算、未來資金需求規劃及各電廠貸款進度表。
                    <br /><span className="text-rose-400/50 text-sm mt-4 block">系統開發中 (ALPHA)</span>
                </p>
            </div>
        </div>
    );
}
