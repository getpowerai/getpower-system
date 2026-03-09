export interface GPLineMessage {
    id: string;
    sender: string;
    role: string;
    content: string;
    time: string;
    isSelf: boolean;
    photo?: string;
}

export const initialMessages: Record<string, GPLineMessage[]> = {
    "p1": [
        { id: "m1", sender: "陳大文", role: "專案經理", content: "工程部注意，台電端已收到掛表通知，預計下周二會勘。", time: "10:30", isSelf: false },
        { id: "m2", sender: "我", role: "監工部", content: "收到了。結構安裝已接近 90%，這是剛上傳的現場照片。", time: "10:35", isSelf: true, photo: "site_photo_v1.jpg" },
    ],
    "p2": [
        { id: "m3", sender: "系統通知", role: "系統", content: "專案已簽約，群組自動成立。請相關人員開始對接。", time: "09:00", isSelf: false },
    ]
};

export const dispatchGPLineMessage = (projectId: string, content: string, sender: string = "系統通知", role: string = "系統助理") => {
    // We must run safely on the client side only
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("gp_line_messages");
    let messages: Record<string, GPLineMessage[]> = saved ? JSON.parse(saved) : initialMessages;

    const newMessage: GPLineMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sender,
        role,
        content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false // System messages or other user messages are not 'self'
    };

    if (!messages[projectId]) {
        messages[projectId] = [];
    }

    messages[projectId].push(newMessage);
    localStorage.setItem("gp_line_messages", JSON.stringify(messages));

    // Dispatch a custom event so listeners (like the active GP Line page) know about the update immediately
    window.dispatchEvent(new Event("gpline-message-updated"));
};
