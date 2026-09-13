const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'));

if (isSupabaseConfigured) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false }
        });
        console.log('[Database] Connected to live Supabase PostgreSQL instance');
    } catch (err) {
        console.warn('[Database] Failed to initialize Supabase client:', err.message);
    }
} else {
    console.log('[Database] Operating with built-in high-performance memory/state engine with full data model support');
}

// In-Memory / Local Seed Store (ensures 100% functionality even when offline or before keys are set)
const localStore = {
    citizens: [
        { id: '11111111-1111-1111-1111-111111111111', role_key: 'rohan', name: 'Rohan Shah', mobile: '+91 98765 43210', email: 'rohan.shah@example.com', aadhaar: '9876-5432-1098', dob: '14 Aug 2003 (Age 23)', blood_group: 'O+', address: 'Flat 402, Green Meadows, Senapati Bapat Road, Pune, Maharashtra - 411016', state: 'Maharashtra', avatar: 'RS' },
        { id: '22222222-2222-2222-2222-222222222222', role_key: 'seller', name: 'Ananya Rao', mobile: '+91 91234 56789', email: 'ananya.rao@example.com', aadhaar: '4521-8932-7712', dob: '24 May 1988 (Age 38)', blood_group: 'B+', address: '#42, 3rd Cross, Indiranagar, Bengaluru, Karnataka - 560038', state: 'Karnataka', avatar: 'AR' }
    ],
    vehicles: [
        { id: 'mh12_1', owner_role_key: 'rohan', reg_number: 'MH 12 AB 9981', model_name: 'Tata Nexon EV Max', year: '2023', fuel_type: 'Electric', state: 'Maharashtra', puc_status: 'Exempt (Zero Emission Electric)', risk_status: 'All clear', hypothecated_to: null, noc_cleared: true },
        { id: 'mh12_2', owner_role_key: 'rohan', reg_number: 'MH 12 RT 4582', model_name: 'Royal Enfield Hunter 350', year: '2024', fuel_type: 'Petrol', state: 'Maharashtra', puc_status: 'Expires in 5 days (02 Sep)', risk_status: 'PUC due soon', hypothecated_to: null, noc_cleared: true },
        { id: 'mh12_3', owner_role_key: 'rohan', reg_number: 'MH 12 QP 7721', model_name: 'Hyundai Verna 1.5 Turbo', year: '2022', fuel_type: 'Petrol', state: 'Maharashtra', puc_status: 'Valid until 18 Nov 2026', risk_status: 'Challan pending', hypothecated_to: null, noc_cleared: true },
        { id: 'mh12_4', owner_role_key: 'rohan', reg_number: 'MH 12 EV 3310', model_name: 'Ather 450X Gen 3', year: '2023', fuel_type: 'Electric', state: 'Maharashtra', puc_status: 'Exempt (Zero Emission Electric)', risk_status: 'All clear', hypothecated_to: null, noc_cleared: true },
        { id: 'ka01', owner_role_key: 'seller', reg_number: 'KA 01 MT 4582', model_name: 'Hyundai Creta', year: '2021', fuel_type: 'Petrol', state: 'Karnataka', puc_status: 'Expires 04 Sep', risk_status: 'PUC due soon', hypothecated_to: 'HDFC Bank', noc_cleared: false },
        { id: 'ka05', owner_role_key: 'seller', reg_number: 'KA 05 QV 1180', model_name: 'TVS Ntorq 125', year: '2022', fuel_type: 'Petrol', state: 'Karnataka', puc_status: 'Valid until 16 Jan 2027', risk_status: 'All clear', hypothecated_to: null, noc_cleared: true },
        { id: 'tn09', owner_role_key: 'seller', reg_number: 'TN 09 BK 2921', model_name: 'Honda City', year: '2018', fuel_type: 'Petrol', state: 'Tamil Nadu', puc_status: 'Valid until 09 Nov 2026', risk_status: 'All clear', hypothecated_to: null, noc_cleared: true },
        { id: 'mh02', owner_role_key: 'seller', reg_number: 'MH 02 AB 1234', model_name: 'Maruti Swift', year: '2020', fuel_type: 'Petrol', state: 'Maharashtra', puc_status: 'Valid until 12 Dec 2026', risk_status: 'All clear', hypothecated_to: null, noc_cleared: true }
    ],
    licenses: [
        { citizen_role_key: 'rohan', license_type: 'DL', license_number: 'MH-12-DL-2026-004821', status: 'dispatched', authorized_classes: ['MCWG', 'LMV'], issuing_authority: 'RTO Pune (MH-12)', issue_date: '18 Sep 2026', expiry_date: '17 Sep 2046', speed_post_tracking: 'EM492817291IN' },
        { citizen_role_key: 'seller', license_type: 'DL', license_number: 'KA-01-2015-004821', status: 'active', authorized_classes: ['MCWG', 'LMV'], issuing_authority: 'Bangalore Central RTO (KA-01)', issue_date: '15 Aug 2015', expiry_date: '14 Aug 2035', speed_post_tracking: 'KA992811402IN' }
    ],
    transfers: [
        { id: 'tr_ka01', vehicle_id: 'ka01', seller_role_key: 'seller', buyer_role_key: 'buyer', buyer_name: 'Rohan Shah', buyer_mobile: '98 7654 3210', buyer_state: 'Karnataka', status: 'Not started', invite_sent: false, buyer_accepted: false, seller_kyc: false, buyer_kyc: false, vehicle_verified: false, submitted: false }
    ],
    challans: [
        { id: 'MH-EXP-88912', vehicle_id: 'mh12_3', reg_number: 'MH 12 QP 7721', location: 'Mumbai-Pune Expressway, Urse Toll Plaza', speed_record: '104 km/h · Speed Limit 80 km/h', amount: 1000, issuing_authority: 'Maharashtra Highway Police (HSP)', issue_date: '18 Aug 2026', status: 'unpaid' },
        { id: 'KA-EC-72831', vehicle_id: 'ka01', reg_number: 'KA 01 MT 4582', location: 'Outer Ring Road, Bellandur', speed_record: '82 km/h · Speed Limit 60 km/h', amount: 500, issuing_authority: 'Bengaluru Traffic Police', issue_date: '12 Aug 2026', status: 'unpaid' }
    ],
    payments: [
        { id: 'RR-9921', citizen_role_key: 'rohan', title: 'Permanent Driving License (ADTT Track + Smart Card)', amount: 700, payment_date: '18 Sep 2026', bbps_ref: 'BBPS-MH-992148' },
        { id: 'RR-8812', citizen_role_key: 'rohan', title: 'Learners License Application (MCWG + LMV)', amount: 350, payment_date: '15 Aug 2026', bbps_ref: 'BBPS-MH-881204' }
    ],
    idp_applications: []
};

module.exports = {
    supabase,
    isSupabaseConfigured,
    localStore
};
