"use client";

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockSalesProjects } from "@/lib/data/sales";
import { initialMessages, GPLineMessage, dispatchGPLineMessage } from "@/lib/utils/gpline";

interface Group {
    id: string;
    name: string;
    initials: string;
    onlineCount: number;
    messages: GPLineMessage[];
}

function GPLineContent() {
    const searchParams = useSearchParams();
    const projectIdParam = searchParams.get("projectId");
    const [projectMessages, setProjectMessages] = useState<Record<string, GPLineMessage[]>>(initialMessages);
    const [activeGroupId, setActiveGroupId] = useState("p1");
    const [inputMsg, setInputMsg] = useState("");

    const loadMessages = () => {
        const saved = localStorage.getItem("gp_line_messages");
        if (saved) {
            setProjectMessages(JSON.parse(saved));
        } else {
            setProjectMessages(initialMessages);
        }
    };

    useEffect(() => {
        loadMessages();

        const handleUpdate = () => {
            loadMessages();
        };

        window.addEventListener("gpline-message-updated", handleUpdate);
        return () => window.removeEventListener("gpline-message-updated", handleUpdate);
    }, []);

    useEffect(() => {
        if (projectIdParam && mockSalesProjects.some(p => p.id === projectIdParam)) {
            setActiveGroupId(projectIdParam);
        }
    }, [projectIdParam]);

    // Dynamically derive groups from Sales Projects
    const groups: Group[] = mockSalesProjects.map(p => {
        // Generate initials from project name (e.g., "台南永康" -> "YK", "吉陽台中" -> "JY")
        // Simple logic: first character and first character of second word or third character
        const name = p.projectName.replace("市", "").replace("區", "");
        const initials = name.slice(0, 2);

        return {
            id: p.id,
            name: p.projectName,
            initials: initials,
            onlineCount: Math.floor(Math.random() * 10) + 5,
            messages: projectMessages[p.id] || []
        };
    });

    const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeGroup.messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputMsg.trim()) return;

        const newMessage: GPLineMessage = {
            id: `msg-${Date.now()}`,
            sender: "我",
            role: "監工部",
            content: inputMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: true
        };

        const updatedMessages = {
            ...projectMessages,
            [activeGroupId]: [...(projectMessages[activeGroupId] || []), newMessage]
        };

        setProjectMessages(updatedMessages);
        localStorage.setItem("gp_line_messages", JSON.stringify(updatedMessages));
        setInputMsg("");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans max-h-screen overflow-hidden">
            {/* Sidebar: Groups */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-white/5 flex flex-col h-full shrink-0">
                <div className="p-6 border-b border-white/5 flex items-center gap-4">
                    <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors bg-white/5 p-2 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h2 className="text-lg font-bold">GP Line</h2>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {groups.map(g => (
                        <div
                            key={g.id}
                            onClick={() => setActiveGroupId(g.id)}
                            className={`p-6 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${activeGroupId === g.id ? 'bg-white/5 border-l-4 border-l-blue-600' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1 text-white">
                                <h3 className={`font-bold text-sm group-hover:text-blue-400 transition-colors uppercase tracking-tight ${activeGroupId === g.id ? 'text-blue-400' : ''}`}>
                                    {g.name}
                                </h3>
                                <span className="text-[10px] text-slate-500">
                                    {g.messages[g.messages.length - 1]?.time || "新群組"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                                {g.messages[g.messages.length - 1]?.content || "尚未有訊息"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-950 relative h-full">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between z-10 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                            {activeGroup.initials}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{activeGroup.name}</h3>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                {activeGroup.onlineCount} 人在線上
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>
                </div>

                {/* Message List */}
                <div ref={scrollRef} className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    <div className="flex flex-col items-center mb-8">
                        <span className="bg-white/5 text-slate-500 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-white/5 font-bold">今天</span>
                    </div>

                    {activeGroup.messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-lg ${msg.isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-lg ${msg.isSelf ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                {msg.sender[0]}
                            </div>
                            <div className={`space-y-1 flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    {!msg.isSelf && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{msg.role}</span>}
                                    {!msg.isSelf && <span className="text-slate-600 text-[10px]">•</span>}
                                    <span className="text-[10px] text-slate-500 font-medium">{msg.sender} ‧ {msg.time}</span>
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xl border ${msg.isSelf
                                    ? 'bg-blue-600 text-white rounded-tr-none border-blue-500/50'
                                    : 'bg-slate-900 text-slate-200 rounded-tl-none border-white/10'
                                    }`}>
                                    {msg.content}
                                </div>
                                {msg.photo && (
                                    <div className="w-64 h-48 bg-slate-900 rounded-2xl border border-white/10 mt-3 flex items-center justify-center overflow-hidden relative group shadow-2xl cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                                        <svg className="w-12 h-12 text-white/5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                        <div className="absolute bottom-4 left-4">
                                            <p className="text-[10px] text-white font-bold uppercase tracking-widest">{msg.photo}</p>
                                            <p className="text-[8px] text-emerald-400 font-bold">已同步至雲端盤點</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-slate-900/80 border-t border-white/5 backdrop-blur-xl">
                    <form className="flex gap-4 items-center max-w-5xl mx-auto" onSubmit={handleSendMessage}>
                        <button type="button" className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all shadow-lg active:scale-95">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                placeholder="輸入訊息並按 Enter 送出..."
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 shadow-inner text-white placeholder:text-slate-600"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 shadow-lg shadow-blue-500/30 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-500 active:scale-90 transition-all">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function GPLinePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">載入中...</div>}>
            <GPLineContent />
        </Suspense>
    );
}
