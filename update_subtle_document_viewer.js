const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Replace downloadDocument to open a subtle, high-fidelity mock document preview modal
const newDownloadDocumentCode = `
window.downloadDocument = function(filename) {
    state.modal = 'document-preview';
    state.previewFilename = filename;
    render();
};

function documentPreviewModal() {
    var fn = state.previewFilename || 'Document.pdf';
    var isReceipt = fn.includes('Receipt') || fn.startsWith('RR-');
    var isLL = fn.includes('Learner') || fn.includes('LL');
    var isDL = fn.includes('Permanent_DL') || fn.includes('Renewed_Driving_License');
    var isSlot = fn.includes('Appointment_Slip') || fn.includes('Slip');
    var isIDP = fn.includes('International') || fn.includes('IDP');
    
    var docTitle = isReceipt ? 'Official Treasury Payment Receipt' :
                   isLL ? 'Form 3: Learner\\'s License Certificate' :
                   isDL ? 'Form 7: Digital Driving License' :
                   isSlot ? 'Form 4: RTO Track Appointment Slip' :
                   isIDP ? 'Form 4A: International Driving Permit' : 'Official Digital Document';

    var docSub = 'Ministry of Road Transport & Highways · Government of India';
    var docMeta = '';
    
    if (isReceipt) {
        var refNo = fn.replace('_Receipt.pdf', '').replace('.pdf', '');
        docMeta = '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-top:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #cbd5e1;padding-bottom:8px;margin-bottom:10px">' +
        '<span style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase">Bharat BillPay (BBPS) Tax Invoice</span>' +
        '<span style="font-size:11px;color:#0f172a;font-family:monospace;font-weight:700">' + refNo + '</span>' +
        '</div>' +
        '<div class="metrics">' +
        '<div class="metric"><span>Payer Name</span><b>' + (state.role === 'rohan' || state.role === 'applicant' ? 'Rohan Shah' : 'Ananya Rao') + '</b></div>' +
        '<div class="metric"><span>Payment Mode</span><b>UPI / NetBanking (BBPS Secured)</b></div>' +
        '<div class="metric"><span>Status</span><b style="color:#0f766e">✓ Success · Treasury Cleared</b></div>' +
        '<div class="metric"><span>Digital Timestamp</span><b>' + new Date().toLocaleDateString('en-GB') + ' · 256-bit SHA-256</b></div>' +
        '</div></div>';
    } else if (isLL) {
        docMeta = '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-top:12px">' +
        '<div class="metrics">' +
        '<div class="metric"><span>License Number</span><b style="color:var(--navy)">MH-12-LL-2026-004821</b></div>' +
        '<div class="metric"><span>Licensee Name</span><b>Rohan Shah</b></div>' +
        '<div class="metric"><span>Authorized Classes</span><b>MCWG (Motorcycle), LMV (Motor Car)</b></div>' +
        '<div class="metric"><span>Validity Period</span><b>6 Months (CMVR Section 8)</b></div>' +
        '</div></div>';
    } else if (isDL) {
        docMeta = '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-top:12px">' +
        '<div class="metrics">' +
        '<div class="metric"><span>Permanent DL No.</span><b style="color:var(--navy)">' + (state.dlNumber || 'MH-12-DL-2026-004821') + '</b></div>' +
        '<div class="metric"><span>Holder Name</span><b>' + (state.role === 'rohan' || state.role === 'applicant' ? 'Rohan Shah' : 'Ananya Rao') + '</b></div>' +
        '<div class="metric"><span>Issuing Authority</span><b>RTO Pune (MH-12) / Bangalore</b></div>' +
        '<div class="metric"><span>Validity</span><b>Valid Pan-India (20 Years)</b></div>' +
        '</div></div>';
    } else {
        docMeta = '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-top:12px">' +
        '<div class="metrics">' +
        '<div class="metric"><span>Document Reference</span><b style="color:var(--navy)">' + fn + '</b></div>' +
        '<div class="metric"><span>Applicant</span><b>' + (state.role === 'rohan' || state.role === 'applicant' ? 'Rohan Shah' : 'Ananya Rao') + '</b></div>' +
        '<div class="metric"><span>Authority</span><b>Parivahan National Transport Registry</b></div>' +
        '</div></div>';
    }

    var body = '<div style="border:1px solid #cbd5e1;border-radius:10px;padding:16px;background:#fff;position:relative;overflow:hidden">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">' +
    '<div style="width:36px;height:36px;border-radius:6px;background:#f1f5f9;display:grid;place-items:center;font-size:18px">📄</div>' +
    '<div>' +
    '<h3 style="margin:0;font-size:15px;color:var(--navy)">' + docTitle + '</h3>' +
    '<p style="margin:2px 0 0;font-size:11px;color:#64748b">' + docSub + '</p>' +
    '</div></div>' +
    docMeta +
    '<div style="margin-top:12px;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;display:flex;align-items:center;justify-content:space-between">' +
    '<span style="font-size:11px;color:#64748b">File: <b>' + fn + '</b></span>' +
    '<span style="font-size:10px;color:#0f766e;font-weight:700">✓ Cryptographically Signed</span>' +
    '</div>' +
    '</div>' +
    // Subtle, muted prototype watermark note
    '<div style="margin-top:12px;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:11px;color:#64748b;line-height:1.4;text-align:center">' +
    'ℹ️ <b>Prototype Preview:</b> In production, this renders and downloads an official cryptographically stamped PDF signed under Section 4 of the Information Technology Act.' +
    '</div>';

    var foot = '<button class="btn secondary" onclick="closeModal()">Close</button><button class="btn primary" onclick="alertToast(\\'Print / Export\\', \\'Simulating browser PDF print dialogue for \\' + state.previewFilename); closeModal()">Print / Save PDF</button>';

    return '<div class="backdrop" role="dialog" aria-modal="true"><section class="modal" style="max-width:480px"><header class="modal-head"><div><h2>Document Preview</h2><p>' + safe(fn) + '</p></div><button class="close" onclick="closeModal()" aria-label="Close">×</button></header><div class="modal-body">' + body + '</div><footer class="modal-foot">' + foot + '</footer></section></div>';
}
`;

// Insert the documentPreviewModal and update modal() router
code = code.replace("if(state.modal==='document')return documentModal();", "if(state.modal==='document')return documentModal();if(state.modal==='document-preview')return documentPreviewModal();");

const dlStart = code.indexOf('window.downloadDocument = function(filename) {');
const dlEnd = code.indexOf('function documentModal(){');
code = code.substring(0, dlStart) + newDownloadDocumentCode + '\n' + code.substring(dlEnd);

fs.writeFileSync('index.html', code);
console.log("Subtle document preview modal successfully implemented!");
