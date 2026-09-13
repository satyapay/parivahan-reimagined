const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newQuickServicesHtml = `
    var svcFilter = state.overviewServiceFilter || 'all';

    var dlServices = [
        { icon: '🔰', title: 'Apply for LL', desc: 'Faceless Aadhaar e-KYC & AI test', fn: 'openLLApply()' },
        { icon: '🪪', title: 'Permanent DL', desc: 'Book RTO ADTT driving track test', fn: 'openDLApply()' },
        { icon: '✎', title: 'Change DL Details', desc: 'Update address, mobile, or name', fn: 'openChangeDetails()' },
        { icon: '▤', title: 'Duplicate DL', desc: 'Order replacement DL smart card', fn: 'openDuplicateDl()' },
        { icon: '✈️', title: 'International Permit', desc: 'Form 4A IDP for driving abroad', fn: 'openIdp()' },
        { icon: '↻', title: 'Renew Driving License', desc: 'Form 9 online renewal with 10-yr validity', fn: 'openRenewDl()' }
    ];

    var vehServices = [
        { icon: '⇄', title: 'Transfer Ownership', desc: 'P2P transfer room & remote video KYC', fn: 'openTransfer()' },
        { icon: '📄', title: 'Duplicate RC', desc: 'Order physical replacement RC card', fn: 'openDuplicateRc()' },
        { icon: '🛡️', title: 'Book HSRP Plate', desc: 'High Security Plate & color sticker', fn: 'openHsrp()' },
        { icon: '🏦', title: 'Bank Loan NOC', desc: 'Instant bank API loan clearance', fn: 'openNoc()' },
        { icon: '🎟️', title: 'Fancy Number', desc: 'e-Auction for VIP & choice numbers', fn: 'openFancyNumber()' },
        { icon: '⚖️', title: 'e-Challan Court', desc: 'View photo evidence & contest fines', fn: 'openChallan()' }
    ];

    var renderServiceGrid = function(list) {
        return '<div class="services" style="grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:10px">' +
        list.map(function(s) {
            return '<button class="service" onclick="' + s.fn + '" style="min-height:95px;padding:12px;display:flex;flex-direction:column;justify-content:center;transition:all 0.2s">' +
            '<i style="font-size:22px;margin-bottom:6px">' + s.icon + '</i>' +
            '<b style="font-size:13px;color:var(--navy)">' + s.title + '</b>' +
            '<span style="font-size:11px;color:#64748b;margin-top:2px;line-height:1.3">' + s.desc + '</span>' +
            '</button>';
        }).join('') + '</div>';
    };

    var servicesContent = '';
    if (svcFilter === 'dl') {
        servicesContent = '<div style="margin-top:12px">' + renderServiceGrid(dlServices) + '</div>';
    } else if (svcFilter === 'veh') {
        servicesContent = '<div style="margin-top:12px">' + renderServiceGrid(vehServices) + '</div>';
    } else {
        servicesContent = '<div style="margin-top:14px">' +
        '<div style="font-size:11px;font-weight:800;color:#1e40af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;display:flex;align-items:center;gap:6px"><span>🪪</span> Driving License & Learner Services (Sarathi)</div>' +
        renderServiceGrid(dlServices) +
        '<div style="font-size:11px;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:0.5px;margin:18px 0 8px;display:flex;align-items:center;gap:6px"><span>🚗</span> Vehicle & Registration Services (Vahan)</div>' +
        renderServiceGrid(vehServices) +
        '</div>';
    }

    var filterPills = '<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">' +
    '<button class="btn ' + (svcFilter === 'all' ? 'primary' : 'secondary') + ' small" style="height:30px;font-size:11px;padding:0 12px;border-radius:20px" onclick="state.overviewServiceFilter=\\'all\\';render()">All Services (12)</button>' +
    '<button class="btn ' + (svcFilter === 'dl' ? 'primary' : 'secondary') + ' small" style="height:30px;font-size:11px;padding:0 12px;border-radius:20px" onclick="state.overviewServiceFilter=\\'dl\\';render()">🪪 DL Services (6)</button>' +
    '<button class="btn ' + (svcFilter === 'veh' ? 'primary' : 'secondary') + ' small" style="height:30px;font-size:11px;padding:0 12px;border-radius:20px" onclick="state.overviewServiceFilter=\\'veh\\';render()">🚗 Vehicle Services (6)</button>' +
    '</div>';

    var quickServicesSection = '<section class="card pad" style="margin-top:20px"><div class="card-title" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px"><div><h2>Quick Services Directory</h2><p>All national transport services categorized by Driver & Vehicle.</p></div>' + filterPills + '</div>' + servicesContent + '</section>';
`;

// Replace the old quick services section in overview()
const oldQuickRegex = /<section class="card pad"><div class="card-title"><div><h2>Quick services<\/h2>[\s\S]*?<\/section>/;
code = code.replace(oldQuickRegex, '` + quickServicesSection + `');

// Insert newQuickServicesHtml before the return statement of overview()
const retIdx = code.indexOf('return \'<div class="intro"><div><h1>Welcome, \'');
code = code.substring(0, retIdx) + newQuickServicesHtml + '\n    ' + code.substring(retIdx);

fs.writeFileSync('index.html', code);
console.log("Quick Services organized into vehicle-related and DL-related categories!");
