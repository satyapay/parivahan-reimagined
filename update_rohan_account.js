const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Define vehicle pools and dynamic getVehicles()
const vehicleDefinitions = `
    var ananyaVehicles = [
      {id:'ka01',icon:'🚙',name:'Hyundai Creta',reg:'KA 01 MT 4582',year:'2021',fuel:'Petrol',state:'Karnataka',puc:'Expires 04 Sep',risk:'PUC due soon',challanReg:'KA 01 MT 4582',challanLoc:'Outer Ring Road, Bellandur',challanAmt:500,challanSpeed:'82 km/h in 60 km/h zone',challanId:'KA-EC-72831'},
      {id:'ka05',icon:'🛵',name:'TVS Ntorq 125',reg:'KA 05 QV 1180',year:'2022',fuel:'Petrol',state:'Karnataka',puc:'Valid until 16 Jan 2027',risk:'All clear'},
      {id:'tn09',icon:'🚗',name:'Honda City',reg:'TN 09 BK 2921',year:'2018',fuel:'Petrol',state:'Tamil Nadu',puc:'Valid until 09 Nov 2026',risk:'All clear'},
      {id:'mh02',icon:'🚙',name:'Maruti Swift',reg:'MH 02 AB 1234',year:'2020',fuel:'Petrol',state:'Maharashtra',puc:'Valid until 12 Dec 2026',risk:'All clear'}
    ];

    var rohanVehicles = [
      {id:'mh12_1',icon:'⚡',name:'Tata Nexon EV Max',reg:'MH 12 AB 9981',year:'2023',fuel:'Electric',state:'Maharashtra',puc:'Exempt (Zero Emission Electric)',risk:'All clear'},
      {id:'mh12_2',icon:'🏍️',name:'Royal Enfield Hunter 350',reg:'MH 12 RT 4582',year:'2024',fuel:'Petrol',state:'Maharashtra',puc:'Expires in 5 days (02 Sep)',risk:'PUC due soon'},
      {id:'mh12_3',icon:'🏎️',name:'Hyundai Verna 1.5 Turbo',reg:'MH 12 QP 7721',year:'2022',fuel:'Petrol',state:'Maharashtra',puc:'Valid until 18 Nov 2026',risk:'Challan pending',challanReg:'MH 12 QP 7721',challanLoc:'Mumbai-Pune Expressway, Urse Toll',challanAmt:1000,challanSpeed:'104 km/h in 80 km/h zone',challanId:'MH-EXP-88912'},
      {id:'mh12_4',icon:'🛵',name:'Ather 450X Gen 3',reg:'MH 12 EV 3310',year:'2023',fuel:'Electric',state:'Maharashtra',puc:'Exempt (Zero Emission Electric)',risk:'All clear'}
    ];

    function getVehicles() {
        return (state.role === 'rohan' || (state.role === 'applicant' && state.hasOwnedVehicles)) ? rohanVehicles : ananyaVehicles;
    }

    var vehicles = ananyaVehicles;
`;

code = code.replace(/var vehicles=\[[\s\S]*?\];\s*function load/m, vehicleDefinitions + '\n    function load');

// 2. Update car() and vehicles references to dynamically resolve based on role
code = code.replace(
    'function car(){return vehicles.filter(function(v){return v.id===state.selected})[0]||vehicles[0]}',
    'function car(){var vList=getVehicles();return vList.filter(function(v){return v.id===state.selected})[0]||vList[0]}'
);

// 3. Update header() topbar dropdown and name/avatar resolution
const newHeaderStr = `function header(){
    var isRohan = state.role === 'rohan';
    var isApp = state.role === 'applicant';
    var buyer = state.role === 'buyer';
    
    var avatarStr = (isRohan || isApp || buyer) ? 'RS' : 'AR';
    var nameStr = (isRohan || (isApp && state.llComplete)) ? 'Rohan Shah' : (isApp ? 'New Applicant' : (buyer ? 'Rohan Shah' : 'Ananya Rao'));
    
    return '<header class="topbar">'+brand()+'<div class="top-actions"><span class="chip"><i></i>Mock data only</span>' +
    '<select class="input" style="height:32px;padding:0 24px 0 10px;font-size:12px;background:#f1f5f9;border:none;border-radius:6px;font-weight:700;color:var(--navy);cursor:pointer" onchange="switchCitizenRole(this.value)">' +
    '<option value="rohan" '+(state.role==='rohan'?'selected':'')+'>Rohan Shah (Owner · 4 Vehicles)</option>' +
    '<option value="seller" '+(state.role==='seller'||!state.role?'selected':'')+'>Ananya Rao (Owner · 4 Vehicles)</option>' +
    '<option value="applicant" '+(state.role==='applicant'?'selected':'')+'>New LL Applicant</option>' +
    '</select>' +
    '<div class="user" style="cursor:pointer" onclick="section(\\'profile\\')"><span class="avatar">'+avatarStr+'</span><span>'+nameStr+'</span><button class="btn quiet small" style="white-space:nowrap;padding:0 8px" onclick="logout()">Log out</button></div></div></header>';
}`;

code = code.replace(/function header\(\)\{[\s\S]*?<\/header>';\s*\}/m, newHeaderStr);

// 4. Update cars() to iterate over getVehicles()
code = code.replace(
    'return \'<div class="section"><div class="intro"><div><h1>My vehicles</h1><p>Every document, due date and service in the right vehicle context.</p></div><button class="btn secondary small" onclick="alertToast(\\\'Vehicle added\\\',\\\'A mock add-vehicle journey would begin here.\\\')">+ Add vehicle</button></div><div class="vehicle-list">\'+vehicles.map',
    'var vList = getVehicles(); return \'<div class="section"><div class="intro"><div><h1>My vehicles (\' + vList.length + \')</h1><p>Every document, due date and service in the right vehicle context.</p></div><button class="btn secondary small" onclick="alertToast(\\\'Vehicle added\\\',\\\'A mock add-vehicle journey would begin here.\\\')">+ Add vehicle</button></div><div class="vehicle-list">\'+vList.map'
);

// 5. Update overview() alerts based on persona (Rohan vs Ananya)
const newOverviewAlerts = `
    var isRohan = (state.role === 'rohan');
    var curCar = isRohan ? rohanVehicles[2] : ananyaVehicles[0]; // Verna for Rohan, Creta for Ananya
    var pucCar = isRohan ? rohanVehicles[1] : ananyaVehicles[0]; // Hunter for Rohan, Creta for Ananya
    var chAmt = isRohan ? 1000 : 500;
    var chId = isRohan ? 'MH-EXP-88912' : 'KA-EC-72831';
    var chLoc = isRohan ? 'Mumbai-Pune Expressway, Urse' : 'Outer Ring Road, Bellandur';

    var challanNotice=state.challanStatus==='paid'?'':(state.challanStatus==='disputed'?'<div class="attention-row"><div class="attention-icon amber" style="font-size:16px">⚖</div><div><b>Challan under dispute ('+chId+')</b><span>'+curCar.reg+' ('+curCar.name+') · Virtual Court review pending.</span></div><button class="link" onclick="openChallan()">View</button></div>':'<div class="attention-row"><div class="attention-icon red">₹</div><div><b>₹'+chAmt+' challan needs attention</b><span>'+curCar.reg+' ('+curCar.name+') · Over-speeding on '+chLoc+'</span></div><button class="link" onclick="openChallan()">View action</button></div>');
    var pucNotice='<div class="attention-row"><div class="attention-icon amber">◷</div><div><b>PUC expires in '+(isRohan?'5':'7')+' days</b><span>'+pucCar.reg+' ('+pucCar.name+') · Renew before '+(isRohan?'02 Sep':'04 Sep')+' to stay compliant.</span></div><button class="link" onclick="alertToast(\\'PUC reminder enabled\\',\\'Email and SMS reminders are set for 7 and 1 day before expiry.\\')">Set reminder</button></div>';
    var idpDraftNotice = (state.idpDraft && !state.idpBloodUploaded) ? '<div class="attention-row"><div class="attention-icon blue" style="font-size:16px">✈️</div><div><b>Draft IDP Application (IDP-DR-8821)</b><span>Doctor Form 1-A approved · Pending Blood Test Upload.</span></div><button class="link" onclick="openIdp()">Resume</button></div>' : '';
    var alerts='<div class="attention">'+idpDraftNotice+pucNotice+challanNotice+'</div>';
`;

code = code.replace(/var challanNotice=state\.challanStatus==='paid'[\s\S]*?var alerts='<div class="attention">\'\+idpDraftNotice\+pucNotice\+challanNotice\+'<\/div>';/m, newOverviewAlerts);

// 6. Update challanModal to show vehicle-specific evidence based on active role
const newChallanModal = `function challanModal(){
        var step=state.challanStep||0,body='',foot='';
        var isRohan = (state.role === 'rohan');
        var chReg = isRohan ? 'MH 12 QP 7721' : 'KA 01 MT 4582';
        var chCar = isRohan ? 'Hyundai Verna 1.5 Turbo' : 'Hyundai Creta';
        var chAmt = isRohan ? 1000 : 500;
        var chId = isRohan ? 'MH-EXP-88912' : 'KA-EC-72831';
        var chLoc = isRohan ? 'Mumbai-Pune Expressway, Urse Toll Plaza' : 'Outer Ring Road, Bellandur';
        var chSpeed = isRohan ? '104 km/h · Speed Limit 80 km/h' : '82 km/h · Speed Limit 60 km/h';
        var chAuth = isRohan ? 'Maharashtra Highway Police (HSP)' : 'Bengaluru Traffic Police';

        if(step===0){
            body='<div style="background:#e2e8f0;height:140px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b;margin-bottom:15px;position:relative;overflow:hidden;"><i style="font-size:32px;z-index:2;font-style:normal">📷</i><div style="position:absolute;bottom:8px;left:8px;background:rgba(0,0,0,0.6);color:white;padding:2px 6px;font-size:11px;border-radius:4px;z-index:2">'+chReg+' · '+chSpeed+'</div><div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,0.03) 10px,rgba(0,0,0,0.03) 20px);"></div></div>' +
            '<div class="notice '+(state.challanStatus==='disputed'?'info':'warning')+'"><b>Speed-Limit Radar Violation</b><br>'+chId+' · Issued 18 Aug 2026 · '+chAuth+'</div>' +
            '<div class="metrics" style="margin-top:18px">' +
            '<div class="metric"><span>Vehicle</span><b>'+chReg+' ('+chCar+')</b></div>' +
            '<div class="metric"><span>Location</span><b>'+chLoc+'</b></div>' +
            '<div class="metric"><span>Recorded Speed</span><b style="color:#e11d48">'+chSpeed+'</b></div>' +
            '<div class="metric"><span>Amount due</span><b>₹'+chAmt+'</b></div>' +
            '<div class="metric"><span>Status</span><b style="color:'+(state.challanStatus==='disputed'?'#b45309':'#e11d48')+'">'+(state.challanStatus==='disputed'?'Under Dispute in Virtual Court':'Unpaid Violation')+'</b></div>' +
            '</div>';
            foot=state.challanStatus==='disputed'?'<button class="btn secondary" onclick="closeModal()">Close</button>':'<button class="btn secondary" onclick="contestChallan()">Contest in Virtual Court</button><button class="btn primary" onclick="payChallan()">Pay ₹'+chAmt+' Securely</button>';
        } else {
            body='<div class="notice info"><b>Contest Violation before Virtual Traffic Court</b><br>Submit your legal dispute. As per Motor Vehicles (Amendment) Act 2019, payment deadlines are frozen while under magistrate review.</div>' +
            '<div class="field" style="margin-top:15px"><label>Grounds for Contest</label><select class="input"><option>Speed radar calibration / defective camera</option><option>Emergency medical transportation</option><option>Cloned license plate / vehicle mismatch</option><option>I was not driving (driver transfer)</option><option>Other statutory grounds</option></select></div>' +
            '<div class="field"><label>Factual Explanation</label><textarea class="input" rows="3" placeholder="Provide details for the virtual court magistrate..."></textarea></div>' +
            '<div class="field"><label>Supporting Document (Dashcam / GPS Telematics)</label><div style="border: 2px dashed #cbd5e1; padding: 12px; text-align: center; border-radius: 8px; color: #64748b; cursor: pointer;" onclick="alertToast(\\'Upload dialog\\',\\'Dashcam video / GPS log attached.\\')"><i style="font-style:normal">📎</i> Tap to attach proof (e.g. dashcam video, GPS log)</div></div>';
            foot='<button class="btn secondary" onclick="openChallan()">Back</button><button class="btn primary" onclick="submitContest()">Submit to Virtual Court</button>';
        }
        return '<div class="backdrop" role="dialog" aria-modal="true"><section class="modal"><header class="modal-head"><div><h2>e-Challan details</h2><p>'+chId+' · '+chReg+'</p></div><button class="close" onclick="closeModal()" aria-label="Close">×</button></header><div class="modal-body">'+body+'</div><footer class="modal-foot">'+foot+'</footer></section></div>';
    }`;

code = code.replace(/function challanModal\(\)\{[\s\S]*?<\/footer><\/section><\/div>';\s*\}/m, newChallanModal);

// 7. Update fastForwardToVehicleOwner to switch to Rohan's account with Rohan's vehicles
const newFastForwardHandler = `
window.switchCitizenRole = function(role) {
    state.role = role;
    state.active = 'overview';
    if(role === 'rohan') {
        state.selected = 'mh12_1';
        state.dlNumber = 'MH-12-DL-2026-004821';
        state.dlStatus = 'dispatched';
        state.hasOwnedVehicles = true;
    } else if(role === 'seller') {
        state.selected = 'ka01';
        state.dlNumber = 'KA-01-2015-004821';
    }
    save();
    render();
};

window.fastForwardToVehicleOwner = function() {
    state.hasOwnedVehicles = true;
    state.role = 'rohan'; // Switches directly to Rohan's dedicated vehicle owner account
    state.selected = 'mh12_1';
    state.dlNumber = 'MH-12-DL-2026-004821';
    state.dlStatus = 'dispatched';
    state.active = 'overview';
    save();
    render();
    alertToast('🚗 Welcome, Rohan Shah!', 'You are now logged into your full vehicle owner dashboard with 4 registered vehicles in Pune!');
};
`;

code = code.replace(/window\.fastForwardToVehicleOwner\s*=\s*function\(\)\s*\{[\s\S]*?alertToast\([^)]+\);\s*\};/m, newFastForwardHandler);

fs.writeFileSync('index.html', code);
console.log("Rohan's dedicated vehicle owner account successfully integrated!");
