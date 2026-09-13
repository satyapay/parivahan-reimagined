const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Update overview() when dlStatus === 'dispatched' to include the prominent fast-forward card
const dlDispatchedHtml = `if(state.dlStatus === 'dispatched' && !state.hasOwnedVehicles) {
            return '<div class="section"><div class="intro"><div><h1>Welcome, Certified Driver</h1><p>Congratulations! Your Permanent Driving License (DL) is active and your Smart Card is in transit.</p></div></div>' +
            '<div class="grid"><div class="stack">' +
            '<div class="card pad" style="border-top:4px solid #138808;background:linear-gradient(135deg, #ffffff, #f0fdf4)">' +
            '<div class="card-title"><div><span class="tag green" style="margin-bottom:8px;display:inline-block">✓ Permanent License Active</span><h2 style="font-size:20px;color:var(--navy)">Driving License: ' + state.dlNumber + '</h2><p>Official Digital Smart Driving License · Valid Pan-India</p></div></div>' +
            '<div class="metrics" style="margin-top:16px"><div class="metric"><span>License Holder</span><b>Rohan Shah</b></div><div class="metric"><span>Authorized Classes</span><b>MCWG (Motorcycle with Gear), LMV (Car)</b></div><div class="metric"><span>Issuing Authority</span><b>RTO Pune (MH-12), Maharashtra</b></div><div class="metric"><span>Validity Period</span><b>18 Sep 2026 - 17 Sep 2046 (20 Years)</b></div><div class="metric"><span>Practical Test Score</span><b style="color:var(--green)">ADTT Automated Track: 100% Cleared</b></div></div>' +
            '<div class="inline-actions" style="margin-top:20px"><button class="btn primary" onclick="downloadDocument(\\'Permanent_DL_MH12.pdf\\')">⬇ Download Digital DL (PDF)</button><button class="btn secondary" onclick="section(\\'payments\\')">View Payment Receipts</button></div>' +
            '</div>' +
            '<div class="card pad" style="border-left:4px solid #000080">' +
            '<div class="card-title"><div><span class="tag blue" style="margin-bottom:6px;display:inline-block">📮 India Post Speed Post</span><h2 style="font-size:16px">Physical Smart Card Dispatched</h2><p>Consignment Number: <b>' + state.speedPostTracking + '</b></p></div></div>' +
            '<div class="timeline" style="margin-top:14px">' +
            '<div class="timeline-row"><i class="dot done"></i><div><b>Card Printed & Embossed</b><span>Government Security Press · Yesterday</span></div></div>' +
            '<div class="timeline-row"><i class="dot done"></i><div><b>Dispatched via Speed Post</b><span>Pune National Sorting Hub · Today, 09:30 AM</span></div></div>' +
            '<div class="timeline-row"><i class="dot pending"></i><div><b>Out for Delivery</b><span>Expected delivery in 2-3 business days</span></div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="stack">' +
            '<div class="card pad">' +
            '<div class="card-title"><div><h2>Complete Licensing Journey</h2><p>From Zero to Licensed Driver</p></div></div>' +
            '<div class="timeline" style="margin-top:14px">' +
            '<div class="timeline-row"><i class="dot done"></i><div><b>1. Learner\\'s License Issued</b><span>Theory test & e-KYC passed</span></div></div>' +
            '<div class="timeline-row"><i class="dot done"></i><div><b>2. 30-Day Mandatory Practice</b><span>Completed CMVR practice</span></div></div>' +
            '<div class="timeline-row"><i class="dot done"></i><div><b>3. ADTT Practical Track Test</b><span>Passed automated sensor track</span></div></div>' +
            '<div class="timeline-row"><i class="dot done"></i><div><b>4. Permanent DL Issued</b><span>Digital & physical smart card</span></div></div>' +
            '</div>' +
            '</div>' +
            
            // Fast Forward to Vehicle Ownership Card
            '<div class="card pad" style="background:linear-gradient(135deg, #0b1f3a, #000080);color:#fff;border-radius:12px;margin-top:16px;box-shadow:0 8px 24px rgba(0,0,128,0.25)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">' +
            '<div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.18);display:grid;place-items:center;font-size:22px">🚗</div>' +
            '<div><span class="tag amber" style="font-size:10px;margin-bottom:2px">Next Chapter: Vehicle Ownership</span><h3 style="color:#fff;margin:0;font-size:16px">Step Into Vehicle Ownership</h3></div>' +
            '</div>' +
            '<p style="font-size:12px;color:#cbd5e1;line-height:1.5;margin:0 0 16px">Fast-forward 6 months: Rohan has purchased his vehicles! Unlock your registered fleet, RC cards, P2P transfer room, Virtual Traffic Court, and International Driving Permits.</p>' +
            '<button class="btn primary" style="width:100%;background:#ff9933;color:#0b1f3a;font-weight:800;font-size:14px;border:none;box-shadow:0 4px 12px rgba(0,0,0,0.3)" onclick="fastForwardToVehicleOwner()">🚀 Fast-Forward to Vehicle Owner (Full Dashboard) →</button>' +
            '</div>' +

            '</div></div></div>';
        }`;

code = code.replace(/if\(state\.dlStatus === 'dispatched'\) \{[\s\S]*?return '<div class="section"><div class="intro">[\s\S]*?'<\/div><\/div><\/div>';\s*\}/m, dlDispatchedHtml);

// 2. Add fastForwardToVehicleOwner handler on window
const fastForwardHandler = `
window.fastForwardToVehicleOwner = function() {
    state.hasOwnedVehicles = true;
    state.role = 'seller'; // Unlocks full dashboard with Rohan's vehicles
    state.dlNumber = 'MH-12-DL-2026-004821';
    state.dlStatus = 'dispatched';
    state.active = 'overview';
    save();
    render();
    alertToast('🚗 Welcome to Vehicle Ownership!', 'Rohan Shah now owns registered vehicles with full RC management, P2P transfers, and e-Challan tools!');
};
`;

code = code.replace("window.simulateTestPassed = function() {", fastForwardHandler + "\nwindow.simulateTestPassed = function() {");

fs.writeFileSync('index.html', code);
console.log("Full lifecycle fast-forward to vehicle ownership successfully implemented!");
