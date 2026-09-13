const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Update IDP Step 2 (Blood Test Upload)
const newIdpStep2Html = `} else if (step === 2) {
            // STEP 3: Mandatory Blood Group & Serology Diagnostic Report Upload
            var isUploaded = state.idpBloodUploaded || false;

            body = '<div class="notice warning"><b>Mandatory Blood Group & Diagnostic Serology Upload</b><br>International licensing conventions require official lab confirmation of blood group marker and vital metabolic baseline before operating vehicles abroad.</div>' +
            '<div style="margin-top:16px">' +
            '<label style="font-size:12px;font-weight:800;color:var(--navy);display:block;margin-bottom:8px">Attach Diagnostic Blood Test Report (Form 1-A Annexure)</label>' +
            '<div style="border: 2px dashed ' + (isUploaded ? '#16a34a' : '#cbd5e1') + '; padding: 20px; text-align: center; border-radius: 10px; background:' + (isUploaded ? '#f0fdf4' : '#f8fafc') + '; cursor: pointer;" onclick="uploadIdpBloodReport()">' +
            (isUploaded 
                ? '<div><span style="font-size:32px">🩸</span><br><b style="color:#166534;font-size:14px;display:block;margin-top:6px">Blood_Report_Serology_O_Positive.pdf</b><span class="tag green" style="margin-top:6px;display:inline-block">✓ Verified NABL Accredited Lab</span><p style="font-size:11px;color:#15803d;margin:6px 0 0">Blood Group: <b>O+ Positive</b> · Fasting Glucose: <b>94 mg/dL (Normal)</b> · Hemoglobin: <b>14.2 g/dL</b></p></div>'
                : '<div><span style="font-size:32px">📁</span><br><b style="color:var(--navy);font-size:14px;display:block;margin-top:6px">Tap / Click to Upload Blood Test Report</b><small style="color:#64748b;font-size:12px">Accepted formats: PDF, JPG, PNG (Max 5MB)</small><br><span class="tag amber" style="margin-top:8px;display:inline-block">Required for International Permit</span></div>') +
            '</div>' +
            '</div>' +
            '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:12px">' +
            '<div><b style="font-size:12px;color:var(--navy);display:block">Don\\'t have the blood report right now?</b><span style="font-size:11px;color:#64748b">Save your progress with Form 1-A intact and upload once you visit the lab.</span></div>' +
            '<button class="btn secondary small" style="white-space:nowrap;font-size:11px;height:32px" onclick="saveIdpDraft()">💾 Save Draft & Exit</button>' +
            '</div>';

            var bloodHint = isUploaded ? '' : '<div style="width:100%;text-align:center;font-size:12px;color:#b45309;font-weight:600;margin-top:6px">👆 Click box above to attach report, or Save Draft to resume later</div>';

            foot = '<div style="display:flex;flex-direction:column;width:100%;gap:6px">' +
            '<div style="display:flex;justify-content:space-between;gap:10px;width:100%">' +
            '<button class="btn secondary" onclick="prevIdp()">← Back</button>' +
            '<div style="display:flex;gap:8px">' +
            '<button class="btn secondary" onclick="saveIdpDraft()">💾 Save Draft</button>' +
            '<button class="btn primary" ' + (isUploaded ? '' : 'disabled') + ' onclick="nextIdp()">Proceed to License Classes →</button>' +
            '</div></div>' +
            bloodHint +
            '</div>';`;

code = code.replace(/\} else if \(step === 2\) \{\s*\/\/ STEP 3: Mandatory Blood Group[\s\S]*?bloodHint \+\s*'<\/div>';/m, newIdpStep2Html);

// 2. Add saveIdpDraft handler and update openIdp
const draftHandlers = `
window.saveIdpDraft = function() {
    state.idpDraft = true;
    state.idpDraftStep = 2;
    state.idpDraftAppNo = 'IDP-DR-8821';
    state.modal = null;
    save();
    render();
    alertToast('IDP Draft Saved', 'Application #IDP-DR-8821 saved. Doctor Form 1-A is preserved. Resume anytime once lab results arrive.');
};

window.openIdp = function() {
    state.modal = 'idp';
    if (state.idpDraft && !state.idpBloodUploaded) {
        state.idpStep = state.idpDraftStep || 2;
    } else {
        state.idpStep = 0;
    }
    render();
};
`;

code = code.replace(/window\.openIdp = function\(\) \{[\s\S]*?render\(\);\s*\};/m, draftHandlers);

// 3. Update overview() alerts to include IDP draft reminder
const oldAlertsLine = "var alerts='<div class=\"attention\">'+pucNotice+challanNotice+'</div>';";
const newAlertsLine = `var idpDraftNotice = (state.idpDraft && !state.idpBloodUploaded) ? '<div class="attention-row"><div class="attention-icon blue" style="font-size:16px">✈️</div><div><b>Draft IDP Application (IDP-DR-8821)</b><span>Doctor Form 1-A approved · Pending Blood Test Upload.</span></div><button class="link" onclick="openIdp()">Resume</button></div>' : '';
    var alerts='<div class="attention">'+idpDraftNotice+pucNotice+challanNotice+'</div>';`;

code = code.replace(oldAlertsLine, newAlertsLine);

fs.writeFileSync('index.html', code);
console.log("Save draft & resume options for IDP blood test upload successfully added!");
