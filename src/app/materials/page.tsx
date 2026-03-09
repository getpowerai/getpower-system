"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { mockMaterials, mockSuppliers } from "@/lib/data/materials";

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [subCode, setSubCode] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [customBrand, setCustomBrand] = useState("");
    const [customSupplier, setCustomSupplier] = useState("");
    const [stockQuantity, setStockQuantity] = useState<string>("0");
    const [materialName, setMaterialName] = useState("");
    const [specification, setSpecification] = useState("");
    const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
    const [isAddingNewSupplier, setIsAddingNewSupplier] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("gp_materials");
        if (saved) {
            setMaterials(JSON.parse(saved));
        } else {
            setMaterials(mockMaterials);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("gp_materials", JSON.stringify(materials));
        }
    }, [materials, isLoaded]);

    // Common units
    const units = ["顆", "支", "米", "個", "組", "箱"];

    // Derive unique brands from mockData, filtered by category if selected
    const existingBrands = Array.from(new Set(
        materials
            .filter(m => !selectedCategoryCode || m.categoryCode === selectedCategoryCode)
            .map(m => m.brand)
            .filter(Boolean)
    )) as string[];

    // Derive unique categories from materials
    const categories = Array.from(new Set(materials.map(m => `${m.categoryCode}|${m.category}`)))
        .map(c => {
            const [code, name] = c.split('|');
            return { code, name };
        });

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCategory = categories.find(c => c.code === selectedCategoryCode);

    // Calculate next subCode when category changes
    const handleCategoryChange = (code: string) => {
        setSelectedCategoryCode(code);
        if (code) {
            const categoryMaterials = materials.filter(m => m.categoryCode === code);
            const codes = categoryMaterials.map(m => {
                const parts = m.code.split('-');
                return parts.length > 1 ? parseInt(parts[1]) : 0;
            }).filter(n => !isNaN(n));

            const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
            setSubCode((maxCode + 1).toString().padStart(2, '0'));
        } else {
            setSubCode("");
        }
    };

    const filteredSuppliers = mockSuppliers.filter(s =>
        !selectedCategoryCode || s.categoryPreferences?.includes(selectedCategoryCode)
    );

    const handleSaveMaterial = () => {
        if (!selectedCategoryCode || !subCode || !materialName) return;

        const newMaterial = {
            id: `m_${Date.now()}`,
            code: `${selectedCategoryCode}-${subCode}`,
            name: materialName,
            category: activeCategory?.name || "",
            categoryCode: selectedCategoryCode,
            specification: specification,
            unit: selectedUnit,
            lastUnitPrice: 0,
            supplierName: isAddingNewSupplier ? customSupplier : selectedSupplier,
            brand: isAddingNewBrand ? customBrand : (selectedBrand === "NONE" ? "" : selectedBrand),
            stockQuantity: parseInt(stockQuantity) || 0
        };

        setMaterials([newMaterial, ...materials]);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回門戶
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">料件及供應商管理</h1>
                        <p className="text-slate-400 mt-2">管理公司所有工程物料、專用編碼及供應商資訊</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsModalOpen(true);
                            setSelectedCategoryCode("");
                            setSubCode("");
                            setSelectedUnit("");
                            setSelectedSupplier("");
                            setSelectedBrand("");
                            setCustomBrand("");
                            setCustomSupplier("");
                            setIsAddingNewBrand(false);
                            setIsAddingNewSupplier(false);
                        }}
                        className="premium-gradient px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
                    >
                        新增料件 +
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Stats */}
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-slate-500 text-sm font-medium mb-1">總計料件</p>
                        <p className="text-3xl font-bold text-blue-400">{materials.length}</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-slate-500 text-sm font-medium mb-1">主要供應商</p>
                        <p className="text-3xl font-bold text-emerald-400">{mockSuppliers.length}</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-slate-500 text-sm font-medium mb-1">庫存預警</p>
                        <p className="text-3xl font-bold text-amber-400">
                            {materials.filter(m => m.stockQuantity < 10).length}
                        </p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-slate-500 text-sm font-medium mb-1">近期出庫</p>
                        <p className="text-3xl font-bold text-rose-400">3</p>
                    </div>
                </div>

                <div className="mt-12 glass overflow-hidden rounded-3xl border-white/5">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold">物料清冊 (已匯入試算表資料)</h2>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="搜尋編碼、品名、分類..."
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 w-full md:w-64"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-slate-400 text-sm">
                                    <th className="px-6 py-4 font-semibold">編碼</th>
                                    <th className="px-6 py-4 font-semibold">品名</th>
                                    <th className="px-6 py-4 font-semibold">分類</th>
                                    <th className="px-6 py-4 font-semibold">規格</th>
                                    <th className="px-6 py-4 font-semibold">單位</th>
                                    <th className="px-6 py-4 font-semibold text-center">庫存數量</th>
                                    <th className="px-6 py-4 font-semibold">供應商</th>
                                    <th className="px-6 py-4 font-semibold">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMaterials.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-mono font-bold">
                                                {item.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{item.name} {item.brand && <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded ml-2">{item.brand}</span>}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.category}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{item.specification}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.unit}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-bold ${item.stockQuantity < 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                                                {item.stockQuantity.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{item.supplierName}</td>
                                        <td className="px-6 py-4 text-slate-400">
                                            <button className="text-slate-400 hover:text-white transition-colors p-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Simplified Add Material Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative glass w-full max-w-2xl p-8 rounded-3xl border-white/10 animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-bold mb-6">新增料件</h3>

                        <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <label className="block text-sm font-medium text-slate-400 mb-2">選擇料件大類</label>
                            <select
                                value={selectedCategoryCode}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 shadow-lg"
                            >
                                <option value="">-- 請選擇大類 (例如: SC 螺絲) --</option>
                                {categories.map(c => (
                                    <option key={c.code} value={c.code}>{c.code} {c.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedCategoryCode && (
                            <div
                                key={selectedCategoryCode}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">大類編碼</label>
                                    <input
                                        type="text"
                                        readOnly
                                        defaultValue={activeCategory?.code || ""}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm text-blue-400 font-mono font-bold opacity-80 outline-none shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">細類流水號 (自動建議)</label>
                                    <input
                                        type="text"
                                        value={subCode}
                                        onChange={(e) => setSubCode(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                                        placeholder="例如: 36"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-slate-200 mb-2">品名</label>
                                    <input
                                        type="text"
                                        value={materialName}
                                        onChange={(e) => setMaterialName(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                        placeholder="輸入品名"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-slate-200 mb-2">初始庫存量</label>
                                    <input
                                        type="number"
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                        placeholder="例如: 100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">品牌</label>
                                    {!isAddingNewBrand ? (
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedBrand}
                                                onChange={(e) => {
                                                    if (e.target.value === "NEW") {
                                                        setIsAddingNewBrand(true);
                                                    } else {
                                                        setSelectedBrand(e.target.value);
                                                    }
                                                }}
                                                className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">選擇品牌...</option>
                                                <option value="NONE" className="text-slate-500 font-bold">--- 無品牌 ---</option>
                                                {existingBrands.map(b => <option key={b} value={b}>{b}</option>)}
                                                <option value="NEW" className="text-blue-400 font-bold">+ 新增品牌...</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={customBrand}
                                                onChange={(e) => setCustomBrand(e.target.value)}
                                                className="w-full bg-slate-900/50 border border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                                                placeholder="輸入新品牌名稱"
                                            />
                                            <button
                                                onClick={() => setIsAddingNewBrand(false)}
                                                className="px-3 text-slate-400 hover:text-white"
                                            >
                                                取消
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-2">單位</label>
                                    <select
                                        value={selectedUnit}
                                        onChange={(e) => setSelectedUnit(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">選擇單位...</option>
                                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-200 mb-2">型號 / 規格描述</label>
                                    <textarea
                                        value={specification}
                                        onChange={(e) => setSpecification(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 h-24"
                                        placeholder="詳細規格或型號描述..."
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-200 mb-2">供應商</label>
                                    {!isAddingNewSupplier ? (
                                        <select
                                            value={selectedSupplier}
                                            onChange={(e) => {
                                                if (e.target.value === "NEW") {
                                                    setIsAddingNewSupplier(true);
                                                } else {
                                                    setSelectedSupplier(e.target.value);
                                                }
                                            }}
                                            className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">選擇供應商 ({selectedCategoryCode} 推薦)...</option>
                                            {filteredSuppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                            <option value="NEW" className="text-emerald-400 font-bold">+ 新增供應商...</option>
                                        </select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={customSupplier}
                                                onChange={(e) => setCustomSupplier(e.target.value)}
                                                className="w-full bg-slate-900/50 border border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                                                placeholder="輸入新供應商名稱"
                                            />
                                            <button
                                                onClick={() => setIsAddingNewSupplier(false)}
                                                className="px-3 text-slate-400 hover:text-white"
                                            >
                                                取消
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSaveMaterial}
                                className={`flex-1 premium-gradient px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 ${!selectedCategoryCode ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                            >
                                儲存新料件
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
