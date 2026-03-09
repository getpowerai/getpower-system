import Image from "next/image";
import Link from "next/link";

const modules = [
  {
    id: "materials",
    name: "料件及供應商管理",
    description: "材料編碼、供應商資料及報價追蹤",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    color: "bg-blue-600",
    href: "/materials",
  },
  {
    id: "sales",
    name: "業務進案系統",
    description: "客戶管理、案件登錄及進度通知",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: "bg-emerald-600",
    href: "/sales",
  },
  {
    id: "process",
    name: "專案管理系統",
    description: "全案場進度戰情室：同步電力、行政、施工、完工之完整生命週期",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: "bg-purple-600",
    href: "/process",
  },
  {
    id: "design-audit",
    name: "設計系統 (送審)",
    description: "電力、結構設計圖面及台電建管送審",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "bg-amber-600",
    href: "/design",
  },
  {
    id: "engineering",
    name: "工程設計監造系統",
    description: "施工圖說管理、監造現場追蹤與物料需求自動計算",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: "bg-cyan-600",
    href: "/engineering",
  },
  {
    id: "om",
    name: "維運系統",
    description: "電廠維運、出工紀錄與料件損耗分析",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "bg-teal-600",
    href: "/om",
  },
  {
    id: "finance",
    name: "財務系統",
    description: "專案成本、資金規劃、貸款進度",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-rose-600",
    href: "/finance",
  },
  {
    id: "gpline",
    name: "GP Line (內部通訊)",
    description: "專案即時通訊、照片與表單回傳",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    color: "bg-indigo-600",
    href: "/gpline",
  },
  {
    id: "hr",
    name: "人力資源系統",
    description: "教育訓練、規章制度與人力需求管理",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: "bg-pink-600",
    href: "/hr",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24 font-sans">
        <header className="mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-bold text-xl text-white">GP</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Getpower System</h1>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight text-white">
            公司內部數位化 <span className="text-transparent bg-clip-text premium-gradient">入口門戶</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            整合業務、工程、材料與財務的高效協作平台。請選擇欲登錄的子系統以開始作業。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => (
            <Link
              key={module.id}
              href={module.href}
              className="group relative glass p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 border-white/5 hover:border-white/20 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`w-14 h-14 ${module.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                <div className="text-white">
                  {module.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors text-white">
                {module.name}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {module.description}
              </p>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-24 pt-12 border-t border-white/5 text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2024 Getpower Energy. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">系統說明</Link>
            <Link href="#" className="hover:text-white transition-colors">技術支援</Link>
            <Link href="#" className="hover:text-white transition-colors">安全規範</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
