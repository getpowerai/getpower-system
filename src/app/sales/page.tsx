"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { mockSalesProjects, mockCustomers, SalesProject } from "@/lib/data/sales";
import { mockMaterials } from "@/lib/data/materials";

const taiwanRegions: Record<string, string[]> = {
    "台北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
    "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "土城區", "蘆洲區", "樹林區", "汐止區", "三峽區", "淡水區", "鶯歌區", "五股區", "泰山區", "林口區", "八里區", "深坑區", "石碇區", "坪林區", "三芝區", "石門區", "金山區", "萬里區", "平溪區", "雙溪區", "貢寮區", "瑞芳區", "烏來區"],
    "桃園市": ["桃園區", "中壢區", "平鎮區", "八德區", "楊梅區", "蘆竹區", "大溪區", "龍潭區", "龜山區", "大園區", "觀音區", "新屋區", "復興區"],
    "台中市": ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "太平區", "大里區", "霧峰區", "烏日區", "豐原區", "后里區", "石岡區", "東勢區", "和平區", "新社區", "潭子區", "大雅區", "神岡區", "大肚區", "沙鹿區", "龍井區", "梧棲區", "清水區", "大甲區", "外埔區", "大安區"],
    "台南市": ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "歸仁區", "新化區", "左鎮區", "玉井區", "楠西區", "南化區", "建業區", "仁德區", "關廟區", "龍崎區", "官田區", "麻豆區", "佳里區", "西港區", "七股區", "將軍區", "學甲區", "北門區", "新營區", "後壁區", "白河區", "東山區", "六甲區", "下營區", "柳營區", "鹽水區", "善化區", "大內區", "山上區", "新市區", "安定區"],
    "高雄市": ["楠梓區", "左營區", "鼓山區", "三民區", "鹽埕區", "前金區", "新興區", "苓雅區", "前鎮區", "旗津區", "小港區", "鳳山區", "林園區", "大寮區", "大樹區", "大社區", "仁武區", "鳥松區", "岡山區", "橋頭區", "燕巢區", "田寮區", "阿蓮區", "路竹區", "湖內區", "茄萣區", "永安區", "彌陀區", "梓官區", "旗山區", "美濃區", "六龜區", "甲仙區", "杉林區", "內門區", "茂林區", "桃源區", "那瑪夏區"],
    "基隆市": ["中正區", "七堵區", "暖暖區", "仁愛區", "中山區", "安樂區", "信義區"],
    "新竹市": ["東區", "北區", "香山區"],
    "新竹縣": ["竹北市", "竹東鎮", "新埔鎮", "關西鎮", "湖口鄉", "新豐鄉", "芎林鄉", "橫山鄉", "北埔鄉", "寶山鄉", "峨眉鄉", "尖石鄉", "五峰鄉"],
    "苗栗縣": ["苗栗市", "苑裡鎮", "通霄鎮", "竹南鎮", "頭份市", "後龍鎮", "卓蘭鎮", "大湖鄉", "公館鄉", "銅鑼鄉", "南庄鄉", "頭屋鄉", "三義鄉", "西湖鄉", "造橋鄉", "三灣鄉", "獅潭鄉", "泰安鄉"],
    "彰化縣": ["彰化市", "鹿港鎮", "和美鎮", "線西鄉", "伸港鄉", "福興鄉", "秀水鄉", "花壇鄉", "芬園鄉", "員林市", "溪湖鎮", "田中鎮", "大村鄉", "埔鹽鄉", "埔心鄉", "永靖鄉", "社頭鄉", "二水鄉", "北斗鎮", "二林鎮", "田尾鄉", "埤頭鄉", "芳苑鄉", "大城鄉", "竹塘鄉", "溪州鄉"],
    "南投縣": ["南投市", "埔里鎮", "草屯鎮", "竹山鎮", "集集鎮", "名間鄉", "鹿谷鄉", "中寮鄉", "魚池鄉", "國姓鄉", "水里鄉", "信義鄉", "仁愛鄉"],
    "雲林縣": ["斗六市", "斗南鎮", "虎尾鎮", "西螺鎮", "土庫鎮", "北港鎮", "古坑鄉", "大埤鄉", "莿桐鄉", "林內鄉", "二崙鄉", "崙背鄉", "麥寮鄉", "東勢鄉", "褒忠鄉", "臺西鄉", "元長鄉", "四湖鄉", "口湖鄉", "水林鄉"],
    "嘉義市": ["東區", "西區"],
    "嘉義縣": ["太保市", "朴子市", "布袋鎮", "大林鎮", "民雄鄉", "溪口鄉", "新港鄉", "六腳鄉", "東石鄉", "義竹鄉", "鹿草鄉", "水上鄉", "中埔鄉", "竹崎鄉", "梅山鄉", "番路鄉", "大埔鄉", "阿里山鄉"],
    "屏東縣": ["屏東市", "潮州鎮", "東港鎮", "恆春鎮", "萬丹鄉", "長治鄉", "麟洛鄉", "九如鄉", "里港鄉", "鹽埔鄉", "高樹鄉", "萬巒鄉", "內埔鄉", "竹田鄉", "新埤鄉", "枋寮鄉", "新園鄉", "崁頂鄉", "林邊鄉", "南州鄉", "佳冬鄉", "琉球鄉", "車城鄉", "滿州鄉", "枋山鄉", "三地門鄉", "霧臺鄉", "瑪家鄉", "泰武鄉", "來義鄉", "春日鄉", "獅子鄉", "牡丹鄉"],
    "宜蘭縣": ["宜蘭市", "羅東鎮", "蘇澳鎮", "頭城鎮", "礁溪鄉", "壯圍鄉", "員山鄉", "冬山鄉", "五結鄉", "三星鄉", "大同鄉", "南澳鄉"],
    "花蓮縣": ["花蓮市", "鳳林鎮", "玉里鎮", "新城鄉", "吉安鄉", "壽豐鄉", "光復鄉", "豐濱鄉", "瑞穗鄉", "富里鄉", "秀林鄉", "萬榮鄉", "卓溪鄉"],
    "台東縣": ["臺東市", "成功鎮", "關山鎮", "卑南鄉", "大武鄉", "太麻里鄉", "東河鄉", "長濱鄉", "鹿野鄉", "池上鄉", "綠島鄉", "延平鄉", "海端鄉", "達仁鄉", "金峰鄉", "蘭嶼鄉"],
    "澎湖縣": ["馬公市", "湖西鄉", "白沙鄉", "西嶼鄉", "望安鄉", "七美鄉"],
    "金門縣": ["金城鎮", "金湖鎮", "金沙鎮", "金寧鄉", "烈嶼鄉", "烏坵鄉"],
    "連江縣": ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"]
};

export default function SalesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [newCustomerName, setNewCustomerName] = useState("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    // Project Location & Name states
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [projectShortName, setProjectShortName] = useState("");
    const [notes, setNotes] = useState("");
    const generatedProjectName = `${selectedCity}${selectedDistrict}${projectShortName}`;

    // Brand and Structure states
    const [selectedModuleBrands, setSelectedModuleBrands] = useState<string[]>([""]);
    const [selectedInverterBrands, setSelectedInverterBrands] = useState<string[]>([""]);
    const [selectedStructureType, setSelectedStructureType] = useState("");
    const [otherStructureDesc, setOtherStructureDesc] = useState("");
    const [contractFileName, setContractFileName] = useState<string | null>(null);
    const [expectedCompletion, setExpectedCompletion] = useState("");

    // Local state for projects to show updates
    const [projects, setProjects] = useState<SalesProject[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("gp_sales_projects");
        if (saved) {
            // eslint-disable-next-line
            setProjects(JSON.parse(saved));
        } else {
            // eslint-disable-next-line
            setProjects(mockSalesProjects);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever projects change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("gp_sales_projects", JSON.stringify(projects));
        }
    }, [projects, isLoaded]);

    // Derive brands from materials data
    const moduleBrands = Array.from(new Set(
        mockMaterials.filter(m => m.categoryCode === "SM").map(m => m.brand).filter(Boolean)
    )) as string[];

    const inverterBrands = Array.from(new Set(
        mockMaterials.filter(m => m.categoryCode === "IV").map(m => m.brand).filter(Boolean)
    )) as string[];

    const structureOptions = ["鋼構", "浪板平鋪", "鋼構新設頂蓋", "防水型鋼構", "其他"];

    const openEditModal = (project: typeof mockSalesProjects[0]) => {
        setEditingProjectId(project.id);

        // Find city and district from projectName
        const cities = Object.keys(taiwanRegions);
        let foundCity = "";
        let foundDist = "";
        let shortName = project.projectName;

        for (const city of cities) {
            if (project.projectName.startsWith(city)) {
                foundCity = city;
                const districts = taiwanRegions[city];
                for (const dist of districts) {
                    if (project.projectName.slice(city.length).startsWith(dist)) {
                        foundDist = dist;
                        shortName = project.projectName.slice(city.length + dist.length);
                        break;
                    }
                }
                break;
            }
        }

        setSelectedCity(foundCity);
        setSelectedDistrict(foundDist);
        setProjectShortName(shortName);
        setSelectedCustomerId(project.customerId);

        // Handle multi-brand split
        const mBrands = project.moduleBrand.split(" / ").filter(Boolean);
        setSelectedModuleBrands(mBrands.length > 0 ? mBrands : [""]);

        const iBrands = project.inverterBrand.split(" / ").filter(Boolean);
        setSelectedInverterBrands(iBrands.length > 0 ? iBrands : [""]);

        setExpectedCompletion(project.expectedCompletion || "");
        setNotes(project.notes || "");

        const isStandardStructure = structureOptions.includes(project.structureType);
        if (isStandardStructure) {
            setSelectedStructureType(project.structureType);
            setOtherStructureDesc("");
        } else {
            setSelectedStructureType("其他");
            setOtherStructureDesc(project.structureType);
        }

        setContractFileName(project.contractFileName || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProjectId(null);
        setSelectedCity("");
        setSelectedDistrict("");
        setProjectShortName("");
        setSelectedModuleBrands([""]);
        setSelectedInverterBrands([""]);
        setSelectedStructureType("");
        setOtherStructureDesc("");
        setSelectedCustomerId("");
        setNewCustomerName("");
        setIsAddingNewCustomer(false);
        setContractFileName(null);
        setExpectedCompletion("");
        setNotes("");
    };

    const handleNewProject = () => {
        handleCloseModal();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation or just proceed
        if (!generatedProjectName.trim()) return;

        if (editingProjectId) {
            setProjects(prev => prev.map(p => {
                if (p.id !== editingProjectId) return p;
                return {
                    ...p,
                    projectName: generatedProjectName,
                    customerId: selectedCustomerId,
                    moduleBrand: selectedModuleBrands.filter(Boolean).join(" / ") || "未指定",
                    inverterBrand: selectedInverterBrands.filter(Boolean).join(" / ") || "未指定",
                    structureType: selectedStructureType === "其他" ? otherStructureDesc : selectedStructureType || "未指定",
                    expectedCompletion: expectedCompletion || p.expectedCompletion,
                    notes: notes,
                    contractFileName: contractFileName || p.contractFileName,
                };
            }));
        } else {
            const newProject = {
                id: `sp-${Date.now()}`,
                projectName: generatedProjectName,
                customerId: selectedCustomerId === "NEW" ? `new-${Date.now()}` : selectedCustomerId,
                moduleBrand: selectedModuleBrands.filter(Boolean).join(" / ") || "未指定",
                inverterBrand: selectedInverterBrands.filter(Boolean).join(" / ") || "未指定",
                expectedCompletion: expectedCompletion || new Date().toISOString().split('T')[0],
                projectType: "Roof" as const,
                structureType: selectedStructureType === "其他" ? otherStructureDesc : selectedStructureType || "未指定",
                status: "Signed" as const,
                contractDate: new Date().toISOString().split('T')[0],
                notes: notes,
                contractFileName: contractFileName || undefined,
            };
            setProjects([newProject, ...projects]);
        }

        setIsModalOpen(false);

        // Reset form
        setSelectedCity("");
        setSelectedDistrict("");
        setProjectShortName("");
        setSelectedModuleBrands([""]);
        setSelectedInverterBrands([""]);
        setSelectedStructureType("");
        setOtherStructureDesc("");
        setSelectedCustomerId("");
        setNewCustomerName("");
        setIsAddingNewCustomer(false);
        setContractFileName(null);
        setNotes("");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回門戶
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">業務進案系統</h1>
                        <p className="text-slate-400 mt-2">客戶管理、專案合約轉換及自動排程通知</p>
                    </div>
                    <button
                        onClick={handleNewProject}
                        className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                    >
                        新簽約案件 +
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main dashboard Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass p-8 rounded-3xl border-white/5">
                            <h2 className="text-xl font-bold mb-6">近期案件狀態</h2>
                            <div className="space-y-4">
                                {projects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => openEditModal(p)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer"
                                    >
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{p.projectName}</h4>
                                            <p className="text-xs text-slate-400">合約日期: {p.contractDate} · {p.projectType === "Roof" ? "屋頂型" : "地面型"}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-end">
                                                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold">
                                                    已通知 PM
                                                </span>
                                                <span className="text-[10px] text-slate-500 mt-1">點擊修改內容</span>
                                            </div>
                                            <button className="text-slate-500 group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Tools */}
                    <div className="space-y-8">
                        <div className="glass p-8 rounded-3xl border-white/5">
                            <h3 className="font-bold mb-4 text-white">客戶管理</h3>
                            <div className="space-y-4">
                                {mockCustomers.map(c => (
                                    <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="font-bold text-sm text-white">{c.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{c.contactPerson} · {c.phone}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                                管理全部客戶
                            </button>
                        </div>

                        <div className="glass p-8 rounded-3xl border-white/5 bg-emerald-500/10">
                            <h3 className="font-bold mb-2 text-white">進案小叮嚀</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                案件送出後，系統會自動通知 **工程部** 與 **專案管理部**。
                                請務必確認模組與變流器品牌是否有誤，這將影響後續採購流程。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Entry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="glass w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10 border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-300 custom-scrollbar">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                {editingProjectId ? "修改專案內容" : "新簽約案件登記"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">客戶全名</label>
                                    {!isAddingNewCustomer ? (
                                        <select
                                            value={selectedCustomerId}
                                            onChange={(e) => {
                                                if (e.target.value === "NEW") {
                                                    setIsAddingNewCustomer(true);
                                                } else {
                                                    setSelectedCustomerId(e.target.value);
                                                }
                                            }}
                                            className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                        >
                                            <option value="">請選擇客戶...</option>
                                            {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            <option value="NEW" className="text-emerald-400 font-bold">+ 新增客戶資料</option>
                                        </select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newCustomerName}
                                                onChange={(e) => setNewCustomerName(e.target.value)}
                                                className="flex-1 bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                                placeholder="例如：吉陽能源科技有限公司"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => setIsAddingNewCustomer(false)}
                                                className="px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white"
                                            >
                                                返回選擇
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">縣市</label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(""); }}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                    >
                                        <option value="">選擇縣市...</option>
                                        {Object.keys(taiwanRegions).map(city => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">區域</label>
                                    <select
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!selectedCity}
                                    >
                                        <option value="">選擇區域...</option>
                                        {selectedCity && taiwanRegions[selectedCity]?.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">專案簡稱</label>
                                    <input
                                        type="text"
                                        value={projectShortName}
                                        onChange={(e) => setProjectShortName(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                        placeholder="例如：兵整岳崗樓"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">專案名稱</label>
                                    <input
                                        type="text"
                                        value={generatedProjectName}
                                        readOnly
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-emerald-400 font-bold focus:outline-none cursor-default"
                                        placeholder="系統自動帶出：縣市＋區域＋專案簡稱"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-400 flex justify-between items-center">
                                        模組品牌
                                        <Link href="/materials" className="text-[10px] text-blue-400 hover:underline">去採購管理新增品牌</Link>
                                    </label>
                                    <div className="space-y-2">
                                        {selectedModuleBrands.map((brand, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <select
                                                    value={brand}
                                                    onChange={(e) => {
                                                        const newBrands = [...selectedModuleBrands];
                                                        newBrands[idx] = e.target.value;
                                                        setSelectedModuleBrands(newBrands);
                                                    }}
                                                    className="flex-1 bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                                >
                                                    <option value="">選擇品牌...</option>
                                                    {moduleBrands.map(b => (
                                                        <option key={b} value={b}>{b}</option>
                                                    ))}
                                                </select>
                                                {selectedModuleBrands.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedModuleBrands(selectedModuleBrands.filter((_, i) => i !== idx))}
                                                        className="p-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors border border-red-500/20"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedModuleBrands([...selectedModuleBrands, ""])}
                                            className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            增加品牌
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-400 flex justify-between items-center">
                                        變流器品牌
                                        <Link href="/materials" className="text-[10px] text-blue-400 hover:underline">去採購管理新增品牌</Link>
                                    </label>
                                    <div className="space-y-2">
                                        {selectedInverterBrands.map((brand, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <select
                                                    value={brand}
                                                    onChange={(e) => {
                                                        const newBrands = [...selectedInverterBrands];
                                                        newBrands[idx] = e.target.value;
                                                        setSelectedInverterBrands(newBrands);
                                                    }}
                                                    className="flex-1 bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                                >
                                                    <option value="">選擇品牌...</option>
                                                    {inverterBrands.map(b => (
                                                        <option key={b} value={b}>{b}</option>
                                                    ))}
                                                </select>
                                                {selectedInverterBrands.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedInverterBrands(selectedInverterBrands.filter((_, i) => i !== idx))}
                                                        className="p-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors border border-red-500/20"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedInverterBrands([...selectedInverterBrands, ""])}
                                            className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            增加品牌
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">預計完工日期</label>
                                    <input
                                        type="date"
                                        value={expectedCompletion}
                                        onChange={(e) => setExpectedCompletion(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white color-scheme-dark"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">案場類型</label>
                                    <div className="flex gap-4">
                                        {["屋頂型", "地面型"].map(type => (
                                            <label key={type} className="flex-1 cursor-pointer">
                                                <input type="radio" name="projectType" className="sr-only peer" />
                                                <div className="text-center py-3 rounded-xl border border-white/20 bg-slate-900 peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500 transition-all text-sm font-medium">
                                                    {type}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">結構類型</label>
                                    {selectedStructureType !== "其他" ? (
                                        <select
                                            value={selectedStructureType}
                                            onChange={(e) => setSelectedStructureType(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="">選擇結構類型...</option>
                                            {structureOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={otherStructureDesc}
                                                onChange={(e) => setOtherStructureDesc(e.target.value)}
                                                className="flex-1 bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                                placeholder="請說明其他類型"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => setSelectedStructureType("")}
                                                className="px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white"
                                            >
                                                重選
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">案件備註</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white resize-none"
                                    placeholder="輸入關於此案場的其他提醒或說明..."
                                />
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-medium text-slate-400 mb-3">合約/附件上傳</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1">
                                        <input
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => setContractFileName(e.target.files?.[0]?.name || null)}
                                        />
                                        <div className="flex items-center justify-center gap-3 py-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all cursor-pointer group">
                                            <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-sm font-bold text-slate-400 group-hover:text-white">
                                                {contractFileName || "點擊或拖曳檔案上傳電子合約 (PDF/JPG)"}
                                            </span>
                                        </div>
                                    </label>
                                    {contractFileName && (
                                        <button
                                            type="button"
                                            onClick={() => setContractFileName(null)}
                                            className="p-3 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all text-slate-400"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all text-white"
                                >
                                    {editingProjectId ? "確認修改內容" : "確認送出開案"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
