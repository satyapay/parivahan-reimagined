-- =============================================================================
-- PARIVAHAN REIMAGINED: ROBUST POSTGRESQL SCHEMA FOR SUPABASE
-- =============================================================================

-- 1. DROP EXISTING TABLES IN REVERSE DEPENDENCY ORDER (Clean Slate)
DROP TABLE IF EXISTS public.idp_applications CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.challans CASCADE;
DROP TABLE IF EXISTS public.transfers CASCADE;
DROP TABLE IF EXISTS public.licenses CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.citizens CASCADE;

-- 2. CITIZENS / USERS TABLE
CREATE TABLE public.citizens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_key VARCHAR(50) UNIQUE NOT NULL, -- 'rohan', 'seller', 'applicant', 'buyer'
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    aadhaar VARCHAR(20),
    dob VARCHAR(50),
    blood_group VARCHAR(10) DEFAULT 'O+',
    address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT 'RS',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. VEHICLES TABLE (VAHAN REGISTRY)
CREATE TABLE public.vehicles (
    id VARCHAR(50) PRIMARY KEY, -- 'mh12_1', 'ka01', etc.
    owner_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    owner_role_key VARCHAR(50) NOT NULL,
    reg_number VARCHAR(50) NOT NULL UNIQUE,
    model_name VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    state VARCHAR(100) NOT NULL,
    puc_status VARCHAR(100) NOT NULL,
    risk_status VARCHAR(100) DEFAULT 'All clear',
    hypothecated_to VARCHAR(100),
    noc_cleared BOOLEAN DEFAULT FALSE,
    hsrp_status VARCHAR(100) DEFAULT 'Standard Plate',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. LICENSES TABLE (SARATHI REGISTRY)
CREATE TABLE public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    citizen_role_key VARCHAR(50) NOT NULL,
    license_type VARCHAR(50) NOT NULL, -- 'LL', 'DL', 'IDP'
    license_number VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'none',
    authorized_classes TEXT[] DEFAULT ARRAY['MCWG', 'LMV'],
    issuing_authority VARCHAR(255) NOT NULL,
    issue_date VARCHAR(50),
    expiry_date VARCHAR(50),
    speed_post_tracking VARCHAR(50),
    slot_date VARCHAR(50),
    slot_time VARCHAR(50),
    slot_track VARCHAR(255),
    form_5b_exemption BOOLEAN DEFAULT FALSE,
    ll_step INT DEFAULT 0,
    ll_docs_count INT DEFAULT 0,
    ll_signed BOOLEAN DEFAULT FALSE,
    quiz_score INT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. P2P OWNERSHIP TRANSFERS (TRANSFER ROOM)
CREATE TABLE public.transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id VARCHAR(50) REFERENCES public.vehicles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.citizens(id) ON DELETE SET NULL,
    buyer_name VARCHAR(255) DEFAULT 'Rohan Shah',
    buyer_mobile VARCHAR(50) DEFAULT '98 7654 3210',
    buyer_state VARCHAR(100) DEFAULT 'Maharashtra',
    status VARCHAR(100) DEFAULT 'Not started',
    invite_sent BOOLEAN DEFAULT FALSE,
    buyer_accepted BOOLEAN DEFAULT FALSE,
    seller_kyc BOOLEAN DEFAULT FALSE,
    buyer_kyc BOOLEAN DEFAULT FALSE,
    vehicle_verified BOOLEAN DEFAULT FALSE,
    submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. E-CHALLANS (VIRTUAL TRAFFIC COURT)
CREATE TABLE public.challans (
    id VARCHAR(50) PRIMARY KEY, -- 'MH-EXP-88912', 'KA-EC-72831'
    vehicle_id VARCHAR(50) REFERENCES public.vehicles(id) ON DELETE CASCADE,
    reg_number VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    speed_record VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    issue_date VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid',
    dispute_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. PAYMENTS & TREASURY RECEIPTS (BBPS INVOICES)
CREATE TABLE public.payments (
    id VARCHAR(50) PRIMARY KEY, -- 'RR-4821', etc.
    citizen_role_key VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Treasury Cleared',
    bbps_ref VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. IDP APPLICATIONS (INTERNATIONAL DRIVING PERMIT)
CREATE TABLE public.idp_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_number VARCHAR(50) UNIQUE NOT NULL,
    citizen_role_key VARCHAR(50) NOT NULL,
    passport_number VARCHAR(50),
    country_destination VARCHAR(100),
    visa_type VARCHAR(100),
    doctor_approved BOOLEAN DEFAULT FALSE,
    doctor_name VARCHAR(255),
    doctor_reg_no VARCHAR(100),
    blood_report_uploaded BOOLEAN DEFAULT FALSE,
    blood_group VARCHAR(10) DEFAULT 'O+',
    is_draft BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Draft Saved',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================================================
-- SEED DATA (INITIAL DEMO DATA)
-- =============================================================================

-- Seed Citizens
INSERT INTO public.citizens (id, role_key, name, mobile, email, aadhaar, dob, blood_group, address, state, avatar)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'rohan', 'Rohan Shah', '+91 98765 43210', 'rohan.shah@example.com', '9876-5432-1098', '14 Aug 2003 (Age 23)', 'O+', 'Flat 402, Green Meadows, Senapati Bapat Road, Pune, Maharashtra - 411016', 'Maharashtra', 'RS'),
    ('22222222-2222-2222-2222-222222222222', 'seller', 'Ananya Rao', '+91 91234 56789', 'ananya.rao@example.com', '4521-8932-7712', '24 May 1988 (Age 38)', 'B+', '#42, 3rd Cross, Indiranagar, Bengaluru, Karnataka - 560038', 'Karnataka', 'AR');

-- Seed Rohan's Vehicles (Maharashtra)
INSERT INTO public.vehicles (id, owner_id, owner_role_key, reg_number, model_name, year, fuel_type, state, puc_status, risk_status, hypothecated_to, noc_cleared)
VALUES
    ('mh12_1', '11111111-1111-1111-1111-111111111111', 'rohan', 'MH 12 AB 9981', 'Tata Nexon EV Max', '2023', 'Electric', 'Maharashtra', 'Exempt (Zero Emission Electric)', 'All clear', NULL, TRUE),
    ('mh12_2', '11111111-1111-1111-1111-111111111111', 'rohan', 'MH 12 RT 4582', 'Royal Enfield Hunter 350', '2024', 'Petrol', 'Maharashtra', 'Expires in 5 days (02 Sep)', 'PUC due soon', NULL, TRUE),
    ('mh12_3', '11111111-1111-1111-1111-111111111111', 'rohan', 'MH 12 QP 7721', 'Hyundai Verna 1.5 Turbo', '2022', 'Petrol', 'Maharashtra', 'Valid until 18 Nov 2026', 'Challan pending', NULL, TRUE),
    ('mh12_4', '11111111-1111-1111-1111-111111111111', 'rohan', 'MH 12 EV 3310', 'Ather 450X Gen 3', '2023', 'Electric', 'Maharashtra', 'Exempt (Zero Emission Electric)', 'All clear', NULL, TRUE);

-- Seed Ananya's Vehicles (Karnataka)
INSERT INTO public.vehicles (id, owner_id, owner_role_key, reg_number, model_name, year, fuel_type, state, puc_status, risk_status, hypothecated_to, noc_cleared)
VALUES
    ('ka01', '22222222-2222-2222-2222-222222222222', 'seller', 'KA 01 MT 4582', 'Hyundai Creta', '2021', 'Petrol', 'Karnataka', 'Expires 04 Sep', 'PUC due soon', 'HDFC Bank', FALSE),
    ('ka05', '22222222-2222-2222-2222-222222222222', 'seller', 'KA 05 QV 1180', 'TVS Ntorq 125', '2022', 'Petrol', 'Karnataka', 'Valid until 16 Jan 2027', 'All clear', NULL, TRUE),
    ('tn09', '22222222-2222-2222-2222-222222222222', 'seller', 'TN 09 BK 2921', 'Honda City', '2018', 'Petrol', 'Tamil Nadu', 'Valid until 09 Nov 2026', 'All clear', NULL, TRUE),
    ('mh02', '22222222-2222-2222-2222-222222222222', 'seller', 'MH 02 AB 1234', 'Maruti Swift', '2020', 'Petrol', 'Maharashtra', 'Valid until 12 Dec 2026', 'All clear', NULL, TRUE);

-- Seed Challans
INSERT INTO public.challans (id, vehicle_id, reg_number, location, speed_record, amount, issuing_authority, issue_date, status)
VALUES
    ('MH-EXP-88912', 'mh12_3', 'MH 12 QP 7721', 'Mumbai-Pune Expressway, Urse Toll Plaza', '104 km/h · Speed Limit 80 km/h', 1000.00, 'Maharashtra Highway Police (HSP)', '18 Aug 2026', 'unpaid'),
    ('KA-EC-72831', 'ka01', 'KA 01 MT 4582', 'Outer Ring Road, Bellandur', '82 km/h · Speed Limit 60 km/h', 500.00, 'Bengaluru Traffic Police', '12 Aug 2026', 'unpaid');

-- Seed Licenses
INSERT INTO public.licenses (citizen_id, citizen_role_key, license_type, license_number, status, issuing_authority, issue_date, expiry_date, speed_post_tracking)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'rohan', 'DL', 'MH-12-DL-2026-004821', 'dispatched', 'RTO Pune (MH-12)', '18 Sep 2026', '17 Sep 2046', 'EM492817291IN'),
    ('22222222-2222-2222-2222-222222222222', 'seller', 'DL', 'KA-01-2015-004821', 'active', 'Bangalore Central RTO (KA-01)', '15 Aug 2015', '14 Aug 2035', 'KA992811402IN');

-- Seed Payments
INSERT INTO public.payments (id, citizen_role_key, title, amount, payment_date, bbps_ref)
VALUES
    ('RR-9921', 'rohan', 'Permanent Driving License (ADTT Track + Smart Card)', 700.00, '18 Sep 2026', 'BBPS-MH-992148'),
    ('RR-8812', 'rohan', 'Learners License Application (MCWG + LMV)', 350.00, '15 Aug 2026', 'BBPS-MH-881204');

-- Enable Row Level Security (RLS)
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idp_applications ENABLE ROW LEVEL SECURITY;

-- Allow public access policies for prototype
CREATE POLICY "Public full access to citizens" ON public.citizens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to licenses" ON public.licenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to transfers" ON public.transfers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to challans" ON public.challans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to idp_applications" ON public.idp_applications FOR ALL USING (true) WITH CHECK (true);
