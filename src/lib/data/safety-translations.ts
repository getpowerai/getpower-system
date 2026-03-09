export type Language = "ZH" | "EN" | "VI" | "TH" | "ID";

export interface SafetyTranslations {
    title: string;
    form: {
        contractor: string;
        location: string;
        personnel: string;
        workContent: string;
    };
    ppeTitle: string;
    ppeItems: {
        helmet: string;
        shoes: string;
        belt: string;
        rope: string;
        breathing: string;
        gloves: string;
        boots: string;
        insulatingGloves: string;
        fallArrester: string;
        ventilation: string;
        toolBag: string;
        extinguisher: string;
        blanket: string;
        gasDetector: string;
        goggles: string;
    };
    hazardTitle: string;
    hazards: {
        hotWork: { title: string; desc: string };
        heightWork: { title: string; desc: string };
        lifting: { title: string; desc: string };
        confinedSpace: { title: string; desc: string };
        demolition: { title: string; desc: string };
        electrical: { title: string; desc: string };
        machinery: { title: string; desc: string };
    };
    legalNote: string;
    signOff: string;
    signedStatus: string;
    timestampLabel: string;
    copyLine: string;
}

export const safetyTranslations: Record<Language, SafetyTranslations> = {
    ZH: {
        title: "承攬商每日危害宣導告知單",
        form: {
            contractor: "承商名稱",
            location: "施工區域/地點",
            personnel: "施工日期/人數",
            workContent: "作業內容"
        },
        ppeTitle: "作業時配戴防護具/裝備",
        ppeItems: {
            helmet: "安全帽",
            shoes: "安全鞋",
            belt: "背負式/雙掛鉤安全帶",
            rope: "安全索",
            breathing: "呼吸鋼瓶",
            gloves: "橡膠手套",
            boots: "膠鞋",
            insulatingGloves: "高壓電氣絕緣手套",
            fallArrester: "捲揚式防墜器",
            ventilation: "通風設備",
            toolBag: "工具袋",
            extinguisher: "滅火器",
            blanket: "防火毯",
            gasDetector: "氣體偵測器",
            goggles: "護具鏡/太陽眼鏡"
        },
        hazardTitle: "作業項目與危害防止對策",
        hazards: {
            hotWork: { title: "動火作業", desc: "著個人防護用具、設置消防設備、電焊機接地、高壓瓶固定、清空易燃物。" },
            heightWork: { title: "高架作業", desc: "佩戴雙掛鉤安全帶、檢查梯架穩固、2m以上設防墜設施、架體固定、設90cm護欄。" },
            lifting: { title: "吊掛作業", desc: "安裝防墜網、吊車防滑舌片、使用安全帶、腳架全開、人員禁止進入下方。" },
            confinedSpace: { title: "局限空間", desc: "測定有害氣體、連續機械通風、佩戴呼吸防護具、每2小時測定一次。" },
            demolition: { title: "拆除作業", desc: "設置圍籬、噴水防塵、固定不穩定處、嚴禁上下同時作業、按序由上而下拆除。" },
            electrical: { title: "感電作業", desc: "裝設漏電斷路器、嚴禁活線作業、禁止使用破損電線、電線墊高保護。" },
            machinery: { title: "車輛/大型機具", desc: "指派交通引導員、機具檢查合格、惡劣氣候停止工作、嚴禁超載。" }
        },
        legalNote: "依職安法第26條告知危害。勞基法限制: 每日8hr/每週40hr，每4hr休30分。嚴禁連續工作超過6日。",
        signOff: "數位簽閱確認 (Digital Sign-off)",
        signedStatus: "已完成簽署 (Signed)",
        timestampLabel: "簽署時間",
        copyLine: "複製 LINE 簽核訊息"
    },
    EN: {
        title: "Daily Hazard Promotion Notice",
        form: {
            contractor: "Contractor Name",
            location: "Work Area/Location",
            personnel: "Date/Personnel Count",
            workContent: "Work Content"
        },
        ppeTitle: "Required PPE/Equipment",
        ppeItems: {
            helmet: "Safety Helmet",
            shoes: "Safety Shoes",
            belt: "Full-body Safety Belt",
            rope: "Safety Rope",
            breathing: "Breathing Cylinder",
            gloves: "Rubber Gloves",
            boots: "Rubber Boots",
            insulatingGloves: "Insulating Gloves",
            fallArrester: "Fall Arrester",
            ventilation: "Ventilation",
            toolBag: "Tool Bag",
            extinguisher: "Fire Extinguisher",
            blanket: "Fire Blanket",
            gasDetector: "Gas Detector",
            goggles: "Safety Goggles"
        },
        hazardTitle: "Hazard Prevention Measures",
        hazards: {
            hotWork: { title: "Hot Work", desc: "Wear PPE, provide fire equipment, ground welders, fix gas cylinders, clear flammables." },
            heightWork: { title: "Height Work", desc: "Wear double-hook belt, check stability, install fall prevention for >2m, 90cm rails." },
            lifting: { title: "Lifting", desc: "Install safety nets, anti-slip clips, use belts, extend outriggers fully, clear area underneath." },
            confinedSpace: { title: "Confined Space", desc: "Test gas, continuous ventilation, wear respiratory PPE, re-test every 2 hours." },
            demolition: { title: "Demolition", desc: "Set fencing, water for dust, fix unstable structures, no concurrent upper/lower work." },
            electrical: { title: "Electrical", desc: "Install breakers, no live work, no damaged cables, elevate cables from ground." },
            machinery: { title: "Machinery", desc: "Assign guides, inspect machinery, stop in bad weather, no overloading." }
        },
        legalNote: "Hazards informed per Safety Act Art. 26. Labor Law: Max 8hr/day, 40hr/wk. 30min rest every 4hr.",
        signOff: "Digital Sign-off",
        signedStatus: "Signed",
        timestampLabel: "Signed at",
        copyLine: "Copy LINE Message"
    },
    VI: {
        title: "Thông báo Nguy hiểm Hàng ngày",
        form: {
            contractor: "Tên nhà thầu",
            location: "Khu vực/Địa điểm",
            personnel: "Ngày/Số lượng nhân sự",
            workContent: "Nội dung công việc"
        },
        ppeTitle: "Thiết bị bảo hộ bắt buộc (PPE)",
        ppeItems: {
            helmet: "Mũ bảo hiểm",
            shoes: "Giày bảo hộ",
            belt: "Dây an toàn toàn thân",
            rope: "Dây thoát hiểm",
            breathing: "Bình dưỡng khí",
            gloves: "Găng tay cao su",
            boots: "Ủng cao su",
            insulatingGloves: "Găng tay cách điện",
            fallArrester: "Thiết bị chống rơi",
            ventilation: "Thông gió",
            toolBag: "Túi dụng cụ",
            extinguisher: "Bình chữa cháy",
            blanket: "Chăn chống cháy",
            gasDetector: "Máy dò khí",
            goggles: "Kính bảo hộ"
        },
        hazardTitle: "Biện pháp phòng ngừa nguy hiểm",
        hazards: {
            hotWork: { title: "Công việc sinh nhiệt", desc: "Mặc PPE, thiết bị chữa cháy, tiếp địa máy hàn, cố định bình gas, dọn chất cháy." },
            heightWork: { title: "Làm việc trên cao", desc: "Dây an toàn 2 móc, kiểm tra thang, lắp chống rơi khi >2m, lan can 90cm." },
            lifting: { title: "Nâng hạ", desc: "Lưới an toàn, chốt chống trượt, dùng dây đeo, chân chống mở hết, cấm người bên dưới." },
            confinedSpace: { title: "Không gian hạn chế", desc: "Đo khí độc, thông gió liên tục, đeo mặt nạ dưỡng khí, đo lại mỗi 2 giờ." },
            demolition: { title: "Phá dỡ", desc: "Lắp rào chắn, phun nước bụi, cố định kết cấu yếu, cấm làm việc tầng trên/dưới." },
            electrical: { title: "Điện giật", desc: "Lắp aptomat chống giật, cấm làm điện sống, cấm dây hỏng, kê cao dây điện." },
            machinery: { title: "Máy móc hạng nặng", desc: "Người điều phối, kiểm định máy, dừng khi thời tiết xấu, cấm quá tải." }
        },
        legalNote: "Thông báo theo Luật ATVSLĐ Art 26. Luật Lao động: Tối đa 8h/ngày, 40h/tuần. Nghỉ 30p mỗi 4h.",
        signOff: "Ký tên kỹ thuật số",
        signedStatus: "Đã ký",
        timestampLabel: "Thời gian ký",
        copyLine: "Sao chép tin nhắn LINE"
    },
    TH: {
        title: "ประกาศแจ้งเตือนอันตรายรายวัน",
        form: {
            contractor: "ชื่อผู้รับเหมา",
            location: "พื้นที่/สถานที่ทำงาน",
            personnel: "วันที่/จำนวนคน",
            workContent: "ลักษณะงาน"
        },
        ppeTitle: "อุปกรณ์ป้องกันส่วนบุคคล (PPE)",
        ppeItems: {
            helmet: "หมวกนิรภัย",
            shoes: "รองเท้านิรภัย",
            belt: "เข็มขัดนิรภัยเต็มตัว",
            rope: "เชือกช่วยชีวิต",
            breathing: "ถังอากาศ",
            gloves: "ถุงมือยาง",
            boots: "รองเท้าบูท",
            insulatingGloves: "ถุงมือฉนวนไฟฟ้า",
            fallArrester: "อุปกรณ์กันตก",
            ventilation: "พัดลมระบายอากาศ",
            toolBag: "กระเป๋าเครื่องมือ",
            extinguisher: "ถังดับเพลิง",
            blanket: "ผ้าห่มกันไฟ",
            gasDetector: "เครื่องตรวจจับก๊าซ",
            goggles: "แว่นตานิรภัย"
        },
        hazardTitle: "มาตรการป้องกันอันตราย",
        hazards: {
            hotWork: { title: "งานที่มีความร้อน", desc: "สวม PPE, เตรียมอุปกรณ์ดับเพลิง, ต่อสายดินเครื่องเชื่อม, ยึดถังแก๊ส, เคลียร์เชื้อเพลิง" },
            heightWork: { title: "งานบนที่สูง", desc: "เข็มขัดนิรภัย 2 ตะขอ, ตรวจสอบบันได, ติดตั้งระบบกันตกเมื่อเกิน 2ม, ราวกั้น 90ซม" },
            lifting: { title: "งานยกของ", desc: "ติดตั้งตาข่าย, เขี้ยวกันเลื่อน, ใช้เข็มขัด, กางขาเครนสุด, ห้ามคนเข้าใต้ของที่ยก" },
            confinedSpace: { title: "ที่อับอากาศ", desc: "ตรวจก๊าซพิษ, ระบายอากาศต่อเนื่อง, สวมหน้ากากกันก๊าซ, ตรวจซ้ำทุก 2 ชม." },
            demolition: { title: "งานรื้อถอน", desc: "กั้นพื้นที่, ฉีดน้ำกันฝุ่น, ยึดโครงสร้างที่ไม่มั่นคง, ห้ามทำงานซ้อนชั้นบน/ล่าง" },
            electrical: { title: "อันตรายจากไฟฟ้า", desc: "ติดตั้งเซฟตี้คัท, ห้ามทำงานกับสายที่มีไฟ, ห้ามใช้สายชำรุด, ยกสายไฟให้สูง" },
            machinery: { title: "เครื่องจักรหนัก", desc: "จัดคนโบก, ตรวจสภาพเครื่องจักร, หยุดเมื่ออากาศแย่, ห้ามบรรทุกเกิน" }
        },
        legalNote: "แจ้งอันตรายตาม กม. ความปลอดภัย ม.26 กฎหมายแรงงาน: ไม่เกิน 8ชม/วัน, 40ชม/สัปดาห์ พัก 30นาที ทุก 4ชม.",
        signOff: "ลงชื่อดิจิทัล",
        signedStatus: "ลงชื่อแล้ว",
        timestampLabel: "ลงชื่อเมื่อ",
        copyLine: "คัดลอกข้อความ LINE"
    },
    ID: {
        title: "Pemberitahuan Bahaya Harian",
        form: {
            contractor: "Nama Kontraktor",
            location: "Area/Lokasi Kerja",
            personnel: "Tanggal/Jumlah Orang",
            workContent: "Rencana Kerja"
        },
        ppeTitle: "Alat Pelindung Diri (APD)",
        ppeItems: {
            helmet: "Helm Keselamatan",
            shoes: "Sepatu Safety",
            belt: "Sabuk Pengaman Full Body",
            rope: "Tali Pengaman",
            breathing: "Tabung Oksigen",
            gloves: "Sarung Tangan Karet",
            boots: "Sepatu Boots",
            insulatingGloves: "Sarung Tangan Isolasi",
            fallArrester: "Penahan Jatuh",
            ventilation: "Ventilasi",
            toolBag: "Tas Peralatan",
            extinguisher: "Alat Pemadam Api",
            blanket: "Selimut Api",
            gasDetector: "Detektor Gas",
            goggles: "Kacamata Pelindung"
        },
        hazardTitle: "Tindakan Pencegahan Bahaya",
        hazards: {
            hotWork: { title: "Pekerjaan Panas", desc: "Pakai APD, siapkan alat pemadam, arde mesin las, ikat tabung gas, bersihkan bahan mudah terbakar." },
            heightWork: { title: "Kerja Ketinggian", desc: "Sabuk pengaman 2 pengait, cek tangga, pasang penahan jatuh >2m, pagar 90cm." },
            lifting: { title: "Pengangkatan", desc: "Pasang jaring, pengait anti slip, pakai sabuk, buka kaki derek penuh, area bawah steril." },
            confinedSpace: { title: "Ruang Terbatas", desc: "Cek gas beracun, ventilasi terus menerus, pakai APD pernapasan, cek ulang tiap 2 jam." },
            demolition: { title: "Pembongkaran", desc: "Pasang pagar, siram air debu, ikat struktur tidak stabil, dilarang kerja bertumpuk." },
            electrical: { title: "Bahaya Listrik", desc: "Pasang pemutus arus, dilarang kerja arus hidup, dilarang kabel rusak, angkat kabel ke atas." },
            machinery: { title: "Alat Berat", desc: "Tunjuk pemandu, cek mesin layak, stop saat cuaca buruk, dilarang beban berlebih." }
        },
        legalNote: "Bahaya diinfokan sesaui UU K3 Art 26. UU Tenaga Kerja: Max 8jam/hari, 40jam/minggu. Istirahat 30mnt tiap 4jam.",
        signOff: "Tanda Tangan Digital",
        signedStatus: "Tanda Tangan Selesai",
        timestampLabel: "Ditandatangani pada",
        copyLine: "Salin Pesan LINE"
    }
};
