"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { mockProcesses, Milestone, ProjectProcess } from "@/lib/data/process";
import { mockSalesProjects, mockCustomers, SalesProject } from "@/lib/data/sales";
import { dispatchGPLineMessage } from "@/lib/utils/gpline";
import { ConstructionLog, TestRunReport } from "@/lib/data/engineering";

const stageColors = {
    Regulatory: "bg-purple-500",
    Utility: "bg-blue-500",
    Permit: "bg-emerald-500",
    Construction: "bg-amber-500",
    Finalization: "bg-rose-500",
};

function MilestoneNode({ milestone, onClick }: { milestone: Milestone, onClick?: () => void }) {
    const isDone = milestone.status === "Completed";
    const isInProgress = milestone.status === "In-Progress";

    const isUnclickable = ["電力施工圖說", "結構施工圖說", "電力進場施工", "結構進場施工", "完工/試運轉", "台電掛表"].includes(milestone.label);
    const effectiveOnClick = isUnclickable ? undefined : onClick;

    return (
        <div
            onClick={effectiveOnClick}
            className={`flex flex-col items-center group shrink-0 w-32 ${effectiveOnClick ? "cursor-pointer" : ""}`}
        >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 z-10 transition-all duration-500 group-hover:scale-110 ${isDone ? "bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                isInProgress ? "bg-slate-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse" :
                    "bg-slate-900 border-white/10"
                }`}>
                {isDone && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {isInProgress && <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />}
            </div>
            <div className="text-center px-2">
                <p className={`text-[11px] font-bold leading-tight transition-colors group-hover:text-white ${isDone ? "text-emerald-400" : isInProgress ? "text-amber-400" : "text-slate-500"}`}>
                    {milestone.label}
                </p>
                <div className="mt-1 flex flex-col items-center gap-0.5 min-h-[24px]">
                    {milestone.submitDate && (
                        <span className="text-[8px] text-slate-500 italic opacity-60">S: {milestone.submitDate}</span>
                    )}
                    {milestone.expectedDate && !isDone && (
                        <span className="text-[8px] text-amber-500 font-mono">E: {milestone.expectedDate}</span>
                    )}
                    {milestone.completeDate && (
                        <span className="text-[8px] text-emerald-500 font-mono">C: {milestone.completeDate}</span>
                    )}
                    {milestone.startDate && (
                        <span className="text-[8px] text-cyan-500 font-mono">Start: {milestone.startDate}</span>
                    )}
                    {milestone.endDate && (
                        <span className="text-[8px] text-cyan-600 font-mono">End: {milestone.endDate}</span>
                    )}
                    {milestone.drawingFile && (
                        <a
                            href="#"
                            onClick={(e) => { e.stopPropagation(); alert(`開始下載: ${milestone.drawingFile}`); }}
                            className="mt-2 text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded cursor-pointer hover:bg-cyan-500 hover:text-white transition-colors block border border-cyan-500/20 shadow-sm shadow-cyan-500/10 truncate max-w-full overflow-hidden whitespace-nowrap"
                            title={milestone.drawingFile}
                        >
                            下載圖面
                        </a>
                    )}
                    {milestone.submissionFile && (
                        <a
                            href="#"
                            onClick={(e) => { e.stopPropagation(); alert(`開始下載: ${milestone.submissionFile}`); }}
                            className="mt-2 text-[9px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded cursor-pointer hover:bg-amber-500 hover:text-white transition-colors block border border-amber-500/20 shadow-sm shadow-amber-500/10 truncate max-w-full overflow-hidden whitespace-nowrap"
                            title={milestone.submissionFile}
                        >
                            下載送件資料
                        </a>
                    )}
                    {milestone.approvalFile && (
                        <a
                            href="#"
                            onClick={(e) => { e.stopPropagation(); alert(`開始下載: ${milestone.approvalFile}`); }}
                            className="mt-2 text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors block border border-emerald-500/20 shadow-sm shadow-emerald-500/10 truncate max-w-full overflow-hidden whitespace-nowrap"
                            title={milestone.approvalFile}
                        >
                            下載核准函/報告
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

function ParallelTrack({ title, milestones, colorClass, onMilestoneClick }: {
    title: string,
    milestones: Milestone[],
    colorClass: string,
    onMilestoneClick: (id: string) => void
}) {
    return (
        <div className="flex flex-col gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 relative mt-3">
            <div className={`absolute top-0 left-6 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 ${colorClass} z-20`}>
                {title}
            </div>
            <div className="flex items-start gap-0 overflow-x-visible relative">
                {milestones.map((m, idx) => (
                    <div key={m.id} className="flex items-start">
                        <MilestoneNode milestone={m} onClick={() => onMilestoneClick(m.id)} />
                        {idx < milestones.length - 1 && (
                            <div className="w-8 h-[2px] bg-white/5 mt-6" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProcessPage() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [projects, setProjects] = useState<ProjectProcess[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [infoModalProjectId, setInfoModalProjectId] = useState<string | null>(null);

    const [activeMilestoneModal, setActiveMilestoneModal] = useState<{ projectId: string, milestoneId: string } | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [expectedDateStr, setExpectedDateStr] = useState("");
    const [uploadFileType, setUploadFileType] = useState<"submission" | "approval">("submission");

    const [viewMode, setViewMode] = useState<"in-progress" | "completed">("in-progress");
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    // Initial load from local memory (can be expanded to localStorage if needed for PM state)
    // but we primarily need the sales data.
    useEffect(() => {
        const saved = localStorage.getItem("gp_process_projects");
        const savedLogs = localStorage.getItem("gp_engineering_logs");
        const logs: ConstructionLog[] = savedLogs ? JSON.parse(savedLogs) : [];

        let baseProjects: ProjectProcess[] = mockProcesses;
        if (saved) {
            try {
                baseProjects = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved projects", e);
            }
        }

        const syncedProjects = baseProjects.map(p => {
            const mockP = mockProcesses.find(mp => mp.id === p.id);
            if (!mockP) return p;

            const projectLogs = logs.filter(l => l.projectId === p.id);

            const syncedMilestones = mockP.milestones.map(mockM => {
                const savedM = p.milestones.find(m => m.id === mockM.id);

                // Automatic sync dates from logs if it's a construction milestone
                let autoStartDate = savedM?.startDate;
                let autoEndDate = savedM?.endDate;
                let autoStatus = savedM?.status || mockM.status;
                let autoCompleteDate = savedM?.completeDate || mockM.completeDate;

                if (mockM.label === "電力進場施工") {
                    const powerLogs = projectLogs.filter(l => l.type === "電力").sort((a, b) => a.date.localeCompare(b.date));
                    if (powerLogs.length > 0) {
                        autoStartDate = powerLogs[0].date;

                        // Check for completion
                        if (powerLogs.some(l => l.isFinalEntry)) {
                            autoStatus = "Completed";
                            autoEndDate = powerLogs.find(l => l.isFinalEntry)?.date || powerLogs[powerLogs.length - 1].date;
                            autoCompleteDate = autoEndDate;
                        } else {
                            autoStatus = "In-Progress";
                            autoEndDate = undefined;
                            autoCompleteDate = undefined;
                        }
                    } else {
                        // Reset if no Power logs found
                        autoStartDate = undefined;
                        autoEndDate = undefined;
                        autoStatus = mockM.status;
                        autoCompleteDate = undefined;
                    }
                } else if (mockM.label === "結構進場施工") {
                    const structLogs = projectLogs.filter(l => l.type === "結構").sort((a, b) => a.date.localeCompare(b.date));
                    if (structLogs.length > 0) {
                        autoStartDate = structLogs[0].date;

                        // Check for completion
                        if (structLogs.some(l => l.isFinalEntry)) {
                            autoStatus = "Completed";
                            autoEndDate = structLogs.find(l => l.isFinalEntry)?.date || structLogs[structLogs.length - 1].date;
                            autoCompleteDate = autoEndDate;
                        } else {
                            autoStatus = "In-Progress";
                            autoEndDate = undefined;
                            autoCompleteDate = undefined;
                        }
                    } else {
                        // Reset if no Structure logs found
                        autoStartDate = undefined;
                        autoEndDate = undefined;
                        autoStatus = mockM.status;
                        autoCompleteDate = undefined;
                    }
                }

                // Keep status and dates from saved, but sync label and stage from mock
                return {
                    ...mockM,
                    status: autoStatus,
                    submitDate: savedM?.submitDate || mockM.submitDate,
                    completeDate: autoCompleteDate,
                    expectedDate: savedM?.expectedDate || mockM.expectedDate,
                    startDate: autoStartDate,
                    endDate: autoEndDate,
                    drawingFile: savedM?.drawingFile || mockM.drawingFile,
                    submissionFile: savedM?.submissionFile || mockM.submissionFile,
                    approvalFile: savedM?.approvalFile || mockM.approvalFile
                };
            });

            return { ...p, milestones: syncedMilestones, projectName: mockP.projectName };
        });

        // Also add any new mock projects
        mockProcesses.forEach(mockP => {
            if (!syncedProjects.find(p => p.id === mockP.id)) {
                syncedProjects.push(mockP);
            }
        });

        setProjects(syncedProjects);
        setIsLoaded(true);
    }, []);

    // Save projects to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("gp_process_projects", JSON.stringify(projects));
        }
    }, [projects, isLoaded]);

    const [salesProjects, setSalesProjects] = useState<SalesProject[]>([]);
    const [engineeringDrawings, setEngineeringDrawings] = useState<any[]>([]);
    const [designDocuments, setDesignDocuments] = useState<any[]>([]);
    const [testRunReports, setTestRunReports] = useState<TestRunReport[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("gp_sales_projects");
        if (saved) {
            // eslint-disable-next-line
            setSalesProjects(JSON.parse(saved));
        } else {
            // eslint-disable-next-line
            setSalesProjects(mockSalesProjects);
        }

        const savedDwg = localStorage.getItem("gp_engineering_drawings");
        if (savedDwg) {
            setEngineeringDrawings(JSON.parse(savedDwg));
        }

        const savedDesign = localStorage.getItem("gp_design_documents");
        if (savedDesign) {
            setDesignDocuments(JSON.parse(savedDesign));
        }

        const savedReports = localStorage.getItem("gp_engineering_reports");
        if (savedReports) {
            setTestRunReports(JSON.parse(savedReports));
        }
    }, [infoModalProjectId, selectedProjectId]); // Refresh when modal opens or project selection changes



    const activeProject = useMemo(() => {
        const p = projects.find(p => p.id === selectedProjectId);
        if (!p) return undefined;

        const syncedMilestones = p.milestones.map(m => {
            if (m.label === "電力施工圖說" || m.label === "結構施工圖說" || m.label === "台電細部協商" || m.label === "建管免雜備查/雜照") {
                let typeKey = "";
                if (m.label === "電力施工圖說") typeKey = "電力";
                else if (m.label === "結構施工圖說") typeKey = "結構";
                else if (m.label === "台電細部協商") typeKey = "台電細部協商";
                else if (m.label === "建管免雜備查/雜照") typeKey = "建管免雜備查";

                const isDesignMilestone = m.label === "台電細部協商" || m.label === "建管免雜備查/雜照";
                const docSource = isDesignMilestone ? designDocuments : engineeringDrawings;

                const relDrawings = docSource.filter(d => d.projectId === p.id && d.type === typeKey);

                if (relDrawings.length > 0) {
                    const completed = relDrawings.filter(d => d.status === "已核可");
                    const submitting = relDrawings.filter(d => d.status === "審核中");

                    if (m.label === "電力施工圖說" || m.label === "結構施工圖說") {
                        const latest = relDrawings[0];
                        return { ...m, status: "Completed" as const, completeDate: latest.date, drawingFile: latest.name };
                    } else {
                        if (completed.length > 0) {
                            const latestCompleted = completed[0];
                            return {
                                ...m,
                                status: "Completed" as const,
                                completeDate: latestCompleted.date,
                                drawingFile: latestCompleted.name,
                                approvalFile: latestCompleted.name,
                                approvalFilesHistory: completed.map(c => c.name),
                                submissionFilesHistory: submitting.map(s => s.name)
                            };
                        } else if (submitting.length > 0) {
                            const latestSubmit = submitting[0];
                            return {
                                ...m,
                                status: "In-Progress" as const,
                                submitDate: latestSubmit.date,
                                drawingFile: latestSubmit.name,
                                submissionFile: latestSubmit.name,
                                submissionFilesHistory: submitting.map(s => s.name)
                            };
                        }
                    }
                }
            }

            if (m.label === "完工/試運轉") {
                const report = testRunReports.find(r => r.projectId === p.id);
                if (report) {
                    return {
                        ...m,
                        status: "Completed" as const,
                        completeDate: report.date,
                        approvalFile: report.name
                    };
                }
            }

            if (m.label === "台電掛表") {
                const parReview = p.milestones.find(mm => mm.label === "台電併聯審查");
                if (parReview && parReview.status === "Completed") {
                    return {
                        ...m,
                        status: "Completed" as const,
                        completeDate: parReview.completeDate
                    };
                }
            }

            return m;
        });

        return { ...p, milestones: syncedMilestones };
    }, [selectedProjectId, projects, engineeringDrawings, designDocuments, testRunReports]);

    const toggleMilestoneStatus = (projectId: string, milestoneId: string) => {
        const project = projects.find(p => p.id === projectId);
        const milestone = project?.milestones.find(m => m.id === milestoneId);

        // Disable toggling for "Signing" milestone
        if (milestone?.label === "簽約") {
            setInfoModalProjectId(projectId);
            return;
        }

        // Disable toggling for Engineering drawings and Construction and Test run
        if (
            milestone?.label === "電力施工圖說" ||
            milestone?.label === "結構施工圖說" ||
            milestone?.label === "電力進場施工" ||
            milestone?.label === "結構進場施工" ||
            milestone?.label === "完工/試運轉" ||
            milestone?.label === "台電掛表"
        ) {
            return;
        }

        const interactiveMilestones = ["台電併聯審查", "同意備案", "購電簽約 (PPA)", "台電細部協商", "建管免雜備查/雜照", "設備登記", "開始躉售"];
        if (interactiveMilestones.includes(milestone?.label || "")) {
            setActiveMilestoneModal({ projectId, milestoneId });
            setExpectedDateStr(milestone?.expectedDate || "");
            setUploadFile(null);
            // Default to approval if already in progress, otherwise submission
            setUploadFileType(milestone?.status === "In-Progress" ? "approval" : "submission");
            return;
        }

        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;

            const updatedMilestones = p.milestones.map(m => {
                if (m.id !== milestoneId) return m;

                const today = new Date().toISOString().split('T')[0];
                let nextStatus: Milestone["status"] = "Pending";
                let update: Partial<Milestone> = {};

                if (m.status === "Pending") {
                    nextStatus = "In-Progress";
                    update = { submitDate: today, completeDate: undefined };
                    dispatchGPLineMessage(projectId, `「${m.label}」狀態已更新為：審查/進行中`);
                } else if (m.status === "In-Progress") {
                    nextStatus = "Completed";
                    update = { completeDate: today };
                    dispatchGPLineMessage(projectId, `「${m.label}」狀態已更新為：已完成`);
                } else { // Currently Completed, cycle back to Pending
                    nextStatus = "Pending";
                    update = { submitDate: undefined, completeDate: undefined };
                    dispatchGPLineMessage(projectId, `「${m.label}」狀態已重新設定為：待處理`);
                }

                return { ...m, status: nextStatus, ...update };
            });

            return { ...p, milestones: updatedMilestones, lastUpdated: new Date().toISOString().split('T')[0] };
        }));
    };

    const handleUpdateMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeMilestoneModal) return;

        setProjects(prev => prev.map(p => {
            if (p.id !== activeMilestoneModal.projectId) return p;

            const updatedMilestones = p.milestones.map(m => {
                if (m.id !== activeMilestoneModal.milestoneId) return m;

                const today = new Date().toISOString().split('T')[0];
                const update: Partial<Milestone> = { expectedDate: expectedDateStr || undefined };
                let nextStatus = m.status;

                // Handle file upload based on label
                if (uploadFile) {
                    if (m.label === "購電簽約 (PPA)") {
                        update.completeDate = today;
                        update.approvalFile = uploadFile.name;
                        update.approvalFilesHistory = [...(m.approvalFilesHistory || []), uploadFile.name];
                        nextStatus = "Completed";
                        dispatchGPLineMessage(activeMilestoneModal.projectId, `已上傳合約檔案 "${uploadFile.name}"，「${m.label}」狀態更新為：已完成`);
                    } else if (m.label === "台電併聯審查" || m.label === "同意備案" || m.label === "設備登記" || m.label === "開始躉售") {
                        if (uploadFileType === "submission") {
                            update.submitDate = today;
                            update.submissionFile = uploadFile.name;
                            update.submissionFilesHistory = [...(m.submissionFilesHistory || []), uploadFile.name];
                            nextStatus = "In-Progress";
                            dispatchGPLineMessage(activeMilestoneModal.projectId, `已上傳申請書 "${uploadFile.name}"，「${m.label}」狀態更新為：進行中`);
                        } else {
                            update.completeDate = today;
                            update.approvalFile = uploadFile.name;
                            update.approvalFilesHistory = [...(m.approvalFilesHistory || []), uploadFile.name];
                            nextStatus = "Completed";
                            dispatchGPLineMessage(activeMilestoneModal.projectId, `已上傳核准函 "${uploadFile.name}"，「${m.label}」狀態更新為：已完成`);
                        }
                    }
                }

                if (expectedDateStr && expectedDateStr !== m.expectedDate) {
                    dispatchGPLineMessage(activeMilestoneModal.projectId, `已設定「${m.label}」預計完成日期為：${expectedDateStr}`);
                }

                if (m.label === "台電細部協商" || m.label === "建管免雜備查/雜照") {
                    // PMs only update expectedDate
                    return { ...m, ...update };
                }

                return { ...m, status: nextStatus, ...update };
            });

            return { ...p, milestones: updatedMilestones, lastUpdated: new Date().toISOString().split('T')[0] };
        }));

        setActiveMilestoneModal(null);
        setUploadFile(null);
        setExpectedDateStr("");
    };

    const activeMilestoneForModal = useMemo(() => {
        if (!activeMilestoneModal) return null;
        // If the modal belongs to the active project, use the synced milestones
        if (activeProject && activeProject.id === activeMilestoneModal.projectId) {
            return activeProject.milestones.find(m => m.id === activeMilestoneModal.milestoneId) || null;
        }
        // Fallback (e.g. if somehow accessed without active project context)
        const p = projects.find(p => p.id === activeMilestoneModal.projectId);
        return p?.milestones.find(m => m.id === activeMilestoneModal.milestoneId) || null;
    }, [activeMilestoneModal, activeProject, projects]);

    const infoProject = useMemo(() => {
        if (!infoModalProjectId) return null;
        const p = projects.find(p => p.id === infoModalProjectId);
        if (!p || !p.salesId) return null;
        // Use the locally hydrated salesProjects state
        const salesData = salesProjects.find(s => s.id === p.salesId);
        const customer = mockCustomers.find(c => c.id === salesData?.customerId);

        return {
            ...p,
            salesData: {
                ...salesData,
                moduleBrand: salesData?.moduleBrand || p.moduleBrand || "未指定",
                inverterBrand: salesData?.inverterBrand || p.inverterBrand || "未指定",
                structureType: salesData?.structureType || p.structureType || "未指定",
                notes: salesData?.notes || p.notes || "",
            },
            customer
        };
    }, [infoModalProjectId, projects, salesProjects]);

    const isProjectCompleted = (p: ProjectProcess) => {
        const saleMilestone = p.milestones.find(m => m.label === "開始躉售");
        return saleMilestone?.status === "Completed";
    };

    const inProgressProjects = projects.filter(p => !isProjectCompleted(p));
    const completedProjects = projects.filter(p => isProjectCompleted(p));

    const getRegion = (projectName: string) => {
        if (/(基隆|新北|台北|桃園|新竹|苗栗)/.test(projectName)) return "北部地區";
        if (/(台中|彰化|南投)/.test(projectName)) return "中彰投地區";
        if (/(雲林|嘉義|台南)/.test(projectName)) return "雲嘉南地區";
        if (/(高雄|屏東)/.test(projectName)) return "高屏地區";
        if (/(宜蘭|花蓮|台東)/.test(projectName)) return "東部地區";
        return "其他地區";
    };

    const getYear = (project: ProjectProcess) => {
        const saleMilestone = project.milestones.find(m => m.label === "開始躉售");
        if (saleMilestone?.completeDate) {
            return saleMilestone.completeDate.split('-')[0];
        }
        if (project.salesId) {
            const salesData = salesProjects.find(s => s.id === project.salesId);
            if (salesData?.expectedCompletion) {
                return salesData.expectedCompletion.split('-')[0];
            }
        }
        return "未知年份";
    };

    if (!selectedProjectId) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-16">
                        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 mb-6 group">
                            <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm uppercase tracking-widest">返回門戶</span>
                        </Link>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 underline decoration-purple-500/50 underline-offset-8">專案管理系統</h1>

                        <div className="mt-8 flex gap-4 border-b border-white/10 pb-4">
                            <button
                                onClick={() => { setViewMode("in-progress"); setSelectedRegion(null); setSelectedYear(null); }}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === "in-progress" ? "bg-purple-500 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
                            >
                                進行中專案
                            </button>
                            <button
                                onClick={() => setViewMode("completed")}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === "completed" ? "bg-emerald-500 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
                            >
                                已完工案場
                            </button>
                        </div>
                    </header>

                    {viewMode === "in-progress" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {inProgressProjects.map((p) => {
                                const completedCount = p.milestones.filter(m => m.status === "Completed").length;
                                const progress = Math.round((completedCount / p.milestones.length) * 100);

                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedProjectId(p.id)}
                                        className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer hover:scale-[1.02] relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-all" />
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center font-black text-purple-400">
                                                {p.projectName.slice(0, 2)}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{p.lastUpdated}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors uppercase">{p.projectName}</h3>

                                        <div className="space-y-4">
                                            {p.notes || (p.salesId && mockSalesProjects.find(s => s.id === p.salesId)?.notes) ? (
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <p className="text-[10px] text-slate-500 font-bold mb-1 tracking-widest uppercase">案場備註</p>
                                                    <p className="text-[11px] text-slate-300 line-clamp-1">{p.notes || mockSalesProjects.find(s => s.id === p.salesId)?.notes}</p>
                                                </div>
                                            ) : null}
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">目前進度</span>
                                                <span className="text-lg font-black text-white">{progress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                                {p.milestones.find(m => m.status === "In-Progress")?.label || "等待開始"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {viewMode === "completed" && !selectedRegion && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {["北部地區", "中彰投地區", "雲嘉南地區", "高屏地區", "東部地區", "其他地區"].map(region => {
                                const count = completedProjects.filter(p => getRegion(p.projectName) === region).length;
                                if (count === 0 && region === "其他地區") return null;
                                return (
                                    <div
                                        key={region}
                                        onClick={() => count > 0 && setSelectedRegion(region)}
                                        className={`glass p-8 rounded-3xl border-white/5 transition-all relative overflow-hidden flex flex-col items-center justify-center ${count > 0 ? "cursor-pointer hover:border-emerald-500/30 hover:bg-white/5 hover:-translate-y-1" : "opacity-50 grayscale"}`}
                                    >
                                        <div className="text-4xl mb-4">📍</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{region}</h3>
                                        <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                                            {count} 個案場
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {viewMode === "completed" && selectedRegion && !selectedYear && (
                        <div>
                            <button onClick={() => setSelectedRegion(null)} className="text-emerald-400 hover:text-emerald-300 mb-6 flex items-center gap-2 font-bold text-sm">
                                &larr; 返回地區總覽
                            </button>
                            <h2 className="text-2xl font-black text-white mb-8 border-l-4 border-emerald-500 pl-4">{selectedRegion}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from(new Set(completedProjects.filter(p => getRegion(p.projectName) === selectedRegion).map(p => getYear(p)))).sort().reverse().map(year => {
                                    const count = completedProjects.filter(p => getRegion(p.projectName) === selectedRegion && getYear(p) === year).length;
                                    return (
                                        <div
                                            key={year}
                                            onClick={() => setSelectedYear(year)}
                                            className="glass p-8 rounded-3xl border-white/5 transition-all relative overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/30 hover:bg-white/5 hover:-translate-y-1"
                                        >
                                            <div className="text-3xl mb-4 font-black text-white/20">{year}</div>
                                            <h3 className="text-xl font-bold text-white mb-2">{year} 年</h3>
                                            <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                                                {count} 個案場
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {viewMode === "completed" && selectedRegion && selectedYear && (
                        <div>
                            <button onClick={() => setSelectedYear(null)} className="text-emerald-400 hover:text-emerald-300 mb-6 flex items-center gap-2 font-bold text-sm">
                                &larr; 返回年份選擇
                            </button>
                            <h2 className="text-2xl font-black text-white mb-8 border-l-4 border-emerald-500 pl-4">{selectedRegion} - {selectedYear} 年</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {completedProjects.filter(p => getRegion(p.projectName) === selectedRegion && getYear(p) === selectedYear).map(p => {
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => setInfoModalProjectId(p.id)}
                                            className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer hover:scale-[1.02] relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all" />
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center font-black text-emerald-400">
                                                    {p.projectName.slice(0, 2)}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{getYear(p)} 完工</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-4 group-hover:text-emerald-400 transition-colors uppercase">{p.projectName}</h3>
                                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                                專案已結案 / 開始躉售
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Detail View
    const p = activeProject!;
    const regulatory = p.milestones.filter(m => m.stage === "Regulatory");
    const utility = p.milestones.filter(m => m.stage === "Utility");
    const permit = p.milestones.filter(m => m.stage === "Permit");
    const finalization = p.milestones.filter(m => m.stage === "Finalization");

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 lg:p-12 font-sans overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <button
                            onClick={() => setSelectedProjectId(null)}
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 mb-6 group"
                        >
                            <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm uppercase tracking-widest">返回專案列表</span>
                        </button>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">{p.projectName}</h1>
                        <p className="text-slate-500 text-lg font-medium">案場詳細進度戰情室 (點選圓圈更新進度)</p>
                    </div>
                </header>

                <div className="glass rounded-[3rem] border-white/5 p-10 md:p-14 relative">
                    <div className="flex flex-col gap-12 overflow-x-auto pb-12 custom-scrollbar">
                        {/* 1. Initial Shared Track */}
                        <div className="flex items-center min-w-[max-content]">
                            <div className="flex items-center pr-12 relative">
                                {regulatory.map((m, idx) => (
                                    <div key={m.id} className="flex items-center">
                                        <MilestoneNode milestone={m} onClick={() => toggleMilestoneStatus(p.id, m.id)} />
                                        {idx < regulatory.length - 1 && (
                                            <div className="w-8 h-[2px] bg-white/5 mt-6" />
                                        )}
                                    </div>
                                ))}
                                {/* Branching indicator */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-32 w-12 border-y-2 border-l-2 border-white/5 rounded-l-2xl" />
                            </div>

                            {/* 2. Parallel Tracks Area (Utility & Permit) */}
                            <div className="flex flex-col gap-8 pl-4">
                                <ParallelTrack
                                    title="電力工程"
                                    milestones={utility}
                                    colorClass="bg-blue-600/20 text-blue-400"
                                    onMilestoneClick={(mId) => toggleMilestoneStatus(p.id, mId)}
                                />
                                <ParallelTrack
                                    title="結構工程"
                                    milestones={permit}
                                    colorClass="bg-emerald-600/20 text-emerald-400"
                                    onMilestoneClick={(mId) => toggleMilestoneStatus(p.id, mId)}
                                />
                            </div>

                            {/* 3. Final Shared track (Finalization) */}
                            {finalization.length > 0 && (
                                <div className="flex items-center pl-12 relative">
                                    {/* Convergence indicator */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-32 w-12 border-y-2 border-l-2 border-white/5 rounded-l-2xl border-l-0 border-r-2 rounded-l-none rounded-r-2xl -translate-x-full" />

                                    <div className="flex items-center">
                                        {finalization.map((m, idx) => (
                                            <div key={m.id} className="flex items-center">
                                                <MilestoneNode milestone={m} onClick={() => toggleMilestoneStatus(p.id, m.id)} />
                                                {idx < finalization.length - 1 && (
                                                    <div className="w-8 h-[2px] bg-white/5 mt-6" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/5 flex flex-wrap gap-6 items-center justify-center">
                        <Link href={`/gpline?projectId=${p.id}`} className="bg-blue-600 shadow-lg shadow-blue-500/20 text-white px-10 py-4 rounded-2xl text-sm font-bold hover:scale-105 transition-all">
                            GP Line 群組
                        </Link>
                        <button className="bg-slate-900 text-slate-300 px-10 py-4 rounded-2xl text-sm font-bold border border-white/5 hover:bg-slate-800 transition-all">
                            施工圖說
                        </button>
                        <button className="bg-emerald-600/10 text-emerald-400 px-10 py-4 rounded-2xl text-sm font-bold border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-all">
                            監工系統
                        </button>
                        <button
                            onClick={() => {
                                if (confirm("確定要重置所有專案數據嗎？這將會清除您目前所有的狀態更新。")) {
                                    localStorage.removeItem("gp_process_projects");
                                    window.location.reload();
                                }
                            }}
                            className="bg-red-600/10 text-red-400 px-6 py-4 rounded-2xl text-xs font-bold border border-red-600/20 hover:bg-red-600 hover:text-white transition-all ml-auto"
                        >
                            重置數據
                        </button>
                    </div>
                </div>

                {/* Basic Info Modal (for Signing Milestone) */}
                {infoProject && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                            onClick={() => setInfoModalProjectId(null)}
                        ></div>
                        <div className="glass w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10 border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-300 custom-scrollbar">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-black flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    案場基本資料
                                </h2>
                                <button
                                    onClick={() => setInfoModalProjectId(null)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">客戶全名</label>
                                        <p className="text-lg font-bold text-white transition-colors hover:text-emerald-400">{infoProject.customer?.name || "未知客戶"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">簽約日期</label>
                                        <p className="text-lg font-bold text-emerald-400">{infoProject.salesData?.contractDate || "系統自動連動"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">案場類型</label>
                                        <p className="text-lg font-bold text-white">
                                            {infoProject.salesData?.projectType === "Roof" ? "屋頂型" :
                                                infoProject.salesData?.projectType === "Ground" ? "地面型" : "屋頂型"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">專案全名</label>
                                    <p className="text-xl font-black text-white uppercase group-hover:text-emerald-400 transition-colors">{infoProject.projectName}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">模組品牌</label>
                                        <p className="text-base font-bold text-white">{infoProject.salesData?.moduleBrand}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">變流器品牌</label>
                                        <p className="text-base font-bold text-white">{infoProject.salesData?.inverterBrand}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">預計完工日期</label>
                                        <div className="flex items-center gap-2">
                                            <p className="text-base font-bold text-amber-400">
                                                {infoProject.salesData?.expectedCompletion || "尚未設定"}
                                            </p>
                                            <div className="p-1 bg-amber-500/10 rounded-md">
                                                <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">結構類型</label>
                                        <p className="text-base font-bold text-white">{infoProject.salesData?.structureType}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 p-5 rounded-2xl bg-slate-900/50 border border-white/5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">案場備註</label>
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {infoProject.salesData?.notes || "無備註事項"}
                                    </p>
                                </div>

                                <div className="pt-6 flex flex-col gap-4">
                                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all text-white flex items-center justify-center gap-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        下載合約附件
                                    </button>

                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-50">
                                            (資料由業務進案系統連動，本畫面僅供檢視)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive Milestone Modal */}
                {activeMilestoneModal && activeMilestoneForModal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                            onClick={() => { setActiveMilestoneModal(null); setUploadFile(null); setExpectedDateStr(""); }}
                        ></div>
                        <div className="glass w-full max-w-lg rounded-[2.5rem] p-10 border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                            <h2 className="text-2xl font-black mb-8 text-white flex items-center gap-3">
                                <div className="p-2 bg-amber-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                {activeMilestoneForModal.label}
                            </h2>

                            <form onSubmit={handleUpdateMilestone} className="space-y-6">
                                {/* Only show Expected Date if it's NOT PPA */}
                                {activeMilestoneForModal.label !== "購電簽約 (PPA)" && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">預計完成日期</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                            value={expectedDateStr}
                                            onChange={(e) => setExpectedDateStr(e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Don't show upload specifically for Engineering ones */}
                                {activeMilestoneForModal.label !== "台電細部協商" && activeMilestoneForModal.label !== "建管免雜備查/雜照" && (
                                    <div className="space-y-4">
                                        {(activeMilestoneForModal.label === "台電併聯審查" || activeMilestoneForModal.label === "同意備案" || activeMilestoneForModal.label === "設備登記" || activeMilestoneForModal.label === "開始躉售") && (
                                            <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadFileType("submission")}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${uploadFileType === "submission" ? "bg-amber-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                                                >
                                                    申請/送件資料
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadFileType("approval")}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${uploadFileType === "approval" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                                                >
                                                    核准函
                                                </button>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                                {activeMilestoneForModal.label === "購電簽約 (PPA)" ? "上傳合約 (PDF)" :
                                                    uploadFileType === "submission" ? "上傳申請書/送件文件 (PDF)" : "上傳核准函 (PDF)"}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="milestoneFileUpload"
                                                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                                    className="sr-only"
                                                />
                                                <label htmlFor="milestoneFileUpload" className="w-full flex items-center justify-center gap-3 px-4 py-6 border-2 border-dashed border-white/20 bg-slate-900 rounded-2xl cursor-pointer hover:border-amber-500 hover:bg-white/5 transition-all group">
                                                    <svg className="w-6 h-6 text-slate-500 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <span className={`text-sm font-bold ${uploadFile ? "text-white" : "text-slate-500 group-hover:text-amber-400"} max-w-[80%] truncate`}>
                                                        {uploadFile ? uploadFile.name : "點擊上傳檔案"}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Display history files if they exist (moved outside of the upload conditional) */}
                                {(activeMilestoneForModal.submissionFilesHistory?.length || activeMilestoneForModal.approvalFilesHistory?.length) ? (
                                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest shadow-none">歷史檔案紀錄</h4>
                                        <ul className="space-y-2">
                                            {activeMilestoneForModal.submissionFilesHistory?.map((f, i) => (
                                                <li key={`sub-${i}`} className="text-xs text-slate-300 flex items-center gap-2">
                                                    <span className="shrink-0 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">送件</span>
                                                    <span className="truncate max-w-[180px] sm:max-w-[250px]">{f}</span>
                                                </li>
                                            ))}
                                            {activeMilestoneForModal.approvalFilesHistory?.map((f, i) => (
                                                <li key={`app-${i}`} className="text-xs text-slate-300 flex items-center gap-2">
                                                    <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">核准</span>
                                                    <span className="truncate max-w-[180px] sm:max-w-[250px]">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setActiveMilestoneModal(null); setUploadFile(null); setExpectedDateStr(""); }}
                                        className="flex-1 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all text-slate-400"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all text-white"
                                    >
                                        儲存設定
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
}
