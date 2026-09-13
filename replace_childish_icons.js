const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Define clean, reusable SVG icons
const SVG_ICONS = {
    car: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5l1.5-3h8l1.5 3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0"/></svg>`,
    bike: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-3l-3 7h6.5l2-3.5H19M5.5 17.5l3.5-7"/></svg>`,
    ev: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5l1.5-3h8l1.5 3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0"/><path d="M12 2v4M10 4h4"/></svg>`,
    card: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    cloud: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    doctor: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5h19s-.5-3.74-2-5c-2.5-2.1-4-2.5-4-5V9a5 5 0 0 0-10 0v2.5c0 2.5-1.5 2.9-4 5z"/><rect x="10.5" y="8" width="3" height="5" rx="1"/><path d="M9.5 9.5h5"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    license: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/></svg>`,
    transfer: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4"/></svg>`,
    scale: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10M12 3v18M3 7h18"/></svg>`,
    file: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    blood: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    bank: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 2L2 7h20z"/></svg>`,
    tag: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M18 12h.01M10 10h4v4h-4z"/></svg>`
};

// 1. Replace vehicle list icons with clean vector icons
code = code.replace(/icon:'🚙'/g, "icon:'" + SVG_ICONS.car + "'");
code = code.replace(/icon:'🚗'/g, "icon:'" + SVG_ICONS.car + "'");
code = code.replace(/icon:'🏎️'/g, "icon:'" + SVG_ICONS.car + "'");
code = code.replace(/icon:'🛵'/g, "icon:'" + SVG_ICONS.bike + "'");
code = code.replace(/icon:'🏍️'/g, "icon:'" + SVG_ICONS.bike + "'");
code = code.replace(/icon:'⚡'/g, "icon:'" + SVG_ICONS.ev + "'");

// 2. Replace Rocket in Fast-Forward card
code = code.replace(/<div style="width:40px;height:40px;border-radius:10px;background:rgba\(255,255,255,0\.18\);display:grid;place-items:center;font-size:22px">🚗<\/div>/g, '<div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.18);display:grid;place-items:center;color:#fff">' + SVG_ICONS.car + '</div>');
code = code.replace(/🚀 Fast-Forward to Vehicle Owner \(Full Dashboard\) →/g, "Proceed to Vehicle Owner Portal →");

// 3. Replace Chatbot FAB emoji
code = code.replace(/<div style="position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:var\(--blue\);color:white;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 8px 24px rgba\(0,0,128,0\.3\);cursor:pointer;z-index:99" onclick="toggleChat\(\)">💬<\/div>/g, '<div style="position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:var(--blue);color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,128,0.3);cursor:pointer;z-index:99" onclick="toggleChat()">' + SVG_ICONS.chat + '</div>');

// 4. Replace childish landing page & service cards icons
code = code.replace(/<span style="font-size:28px">🔰<\/span>/g, '<div style="width:36px;height:36px;border-radius:8px;background:#e6f4ea;color:#137333;display:grid;place-items:center">' + SVG_ICONS.license + '</div>');
code = code.replace(/<span style="font-size:28px">🪪<\/span>/g, '<div style="width:36px;height:36px;border-radius:8px;background:#e8f0fe;color:#1a73e8;display:grid;place-items:center">' + SVG_ICONS.card + '</div>');
code = code.replace(/<span style="font-size:28px">⇄<\/span>/g, '<div style="width:36px;height:36px;border-radius:8px;background:#fef7e0;color:#b06000;display:grid;place-items:center">' + SVG_ICONS.transfer + '</div>');
code = code.replace(/<span style="font-size:28px">⚖<\/span>/g, '<div style="width:36px;height:36px;border-radius:8px;background:#fce8e6;color:#c5221f;display:grid;place-items:center">' + SVG_ICONS.scale + '</div>');
code = code.replace(/<span style="font-size:28px">🚙<\/span>/g, '<div style="width:36px;height:36px;border-radius:8px;background:#e8f0fe;color:#1a73e8;display:grid;place-items:center">' + SVG_ICONS.car + '</div>');
code = code.replace(/<span style="font-size:28px">✈️<\/span>/g, '<div style="width:36px;height:36px;border-radius:8px;background:#f3e8fd;color:#7627bb;display:grid;place-items:center">' + SVG_ICONS.globe + '</div>');

// 5. Replace childish emojis in Quick Services buttons
code = code.replace(/<i>👤<\/i><b>My License<\/b>/g, '<i style="color:var(--navy)">' + SVG_ICONS.card + '</i><b>My License</b>');
code = code.replace(/<i>🚙<\/i><b>My Vehicles<\/b>/g, '<i style="color:var(--navy)">' + SVG_ICONS.car + '</i><b>My Vehicles</b>');
code = code.replace(/<i>▤<\/i><b>Duplicate RC<\/b>/g, '<i style="color:var(--navy)">' + SVG_ICONS.file + '</i><b>Duplicate RC</b>');
code = code.replace(/<i>⇄<\/i><b>Transfer Ownership<\/b>/g, '<i style="color:var(--navy)">' + SVG_ICONS.transfer + '</i><b>Transfer Ownership</b>');
code = code.replace(/<i>🎟️<\/i><b>Fancy Number<\/b>/g, '<i style="color:var(--navy)">' + SVG_ICONS.tag + '</i><b>Fancy Number</b>');

// 6. Replace childish emojis in modal and health screens
code = code.replace(/<div style="font-size:40px;margin-bottom:12px">🚙<\/div>/g, '<div style="margin-bottom:12px;color:#64748b">' + SVG_ICONS.car + '</div>');
code = code.replace(/<div style="font-size:40px;margin-bottom:12px">⇄<\/div>/g, '<div style="margin-bottom:12px;color:#64748b">' + SVG_ICONS.transfer + '</div>');
code = code.replace(/<span style="font-size:32px">🩸<\/span>/g, '<div style="margin-bottom:8px;color:#dc2626">' + SVG_ICONS.blood + '</div>');
code = code.replace(/<span style="font-size:32px">📁<\/span>/g, '<div style="margin-bottom:8px;color:#64748b">' + SVG_ICONS.file + '</div>');
code = code.replace(/<div style="width:52px;height:52px;background:#e0e7ff;color:#3730a3;border-radius:50%;display:grid;place-items:center;font-size:26px;margin:0 auto 12px">🩺<\/div>/g, '<div style="width:52px;height:52px;background:#f1f5f9;color:var(--navy);border-radius:50%;display:grid;place-items:center;margin:0 auto 12px">' + SVG_ICONS.doctor + '</div>');
code = code.replace(/<div style="width:64px;height:64px;border:3px solid #38bdf8;border-radius:50%;margin:0 auto 14px;overflow:hidden;background:#334155;display:grid;place-items:center;font-size:30px">👨‍⚕️<\/div>/g, '<div style="width:64px;height:64px;border:2px solid #94a3b8;border-radius:50%;margin:0 auto 14px;background:#f8fafc;color:var(--navy);display:grid;place-items:center">' + SVG_ICONS.doctor + '</div>');
code = code.replace(/<div style="width:36px;height:36px;border-radius:8px;background:rgba\(255,255,255,0\.2\);display:grid;place-items:center;font-size:20px;flex-shrink:0">☁️<\/div>/g, '<div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,0.2);display:grid;place-items:center;flex-shrink:0;color:#fff">' + SVG_ICONS.cloud + '</div>');
code = code.replace(/<i style="background:#dcfce7;color:#15803d;font-size:26px;display:grid;place-items:center;width:50px;height:50px;margin:0 auto 12px;border-radius:50%;font-style:normal">🎉<\/i>/g, '<div style="background:#dcfce7;color:#15803d;display:grid;place-items:center;width:50px;height:50px;margin:0 auto 12px;border-radius:50%;font-weight:900;font-size:20px">✓</div>');
code = code.replace(/<i style="background:#dcfce7;color:#15803d;font-size:26px;display:grid;place-items:center;width:50px;height:50px;margin:0 auto 12px;border-radius:50%;font-style:normal">✈️<\/i>/g, '<div style="background:#dcfce7;color:#15803d;display:grid;place-items:center;width:50px;height:50px;margin:0 auto 12px;border-radius:50%">' + SVG_ICONS.globe + '</div>');
code = code.replace(/<i style="font-size:32px;z-index:2;font-style:normal">📷<\/i>/g, '<div style="z-index:2;color:#64748b">' + SVG_ICONS.camera + '</div>');

fs.writeFileSync('index.html', code);
console.log("All childish emojis replaced with clean, minimalist, professional SVGs!");
