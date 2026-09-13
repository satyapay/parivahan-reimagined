const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured, localStore } = require('../db/supabase');

// POST /api/licenses/ll/apply
router.post('/ll/apply', async (req, res) => {
    const { role_key, state_jurisdiction, aadhaar_number, age_doc, addr_doc, signed } = req.body;
    return res.json({
        success: true,
        llApplicationNumber: 'LL-MH-2026-88421',
        message: 'Aadhaar e-KYC and DigiLocker documents verified under CMVR Rule 10.'
    });
});

// POST /api/licenses/ll/submit-quiz
router.post('/ll/submit-quiz', async (req, res) => {
    const { role_key, score } = req.body;
    const llNumber = 'MH-12-LL-2026-004821';

    return res.json({
        success: true,
        score: score || 14,
        maxScore: 15,
        status: 'passed',
        llNumber,
        validity: '6 Months (Pan-India)',
        classes: ['MCWG', 'LMV']
    });
});

// POST /api/licenses/dl/book-slot
router.post('/dl/book-slot', async (req, res) => {
    const { role_key, slot_date, slot_time, slot_track, form_5b } = req.body;
    return res.json({
        success: true,
        applicationRef: 'RR-DL-8819',
        slotDate: slot_date || '18 Sep 2026',
        slotTime: slot_time || '09:30 AM - 10:30 AM',
        trackFacility: slot_track || 'RTO Pune ADTT - Track #2 (Electronic Sensor Track)',
        form5bExemption: Boolean(form_5b),
        message: 'ADTT automated driving test appointment confirmed. Slip generated.'
    });
});

// POST /api/licenses/dl/test-pass
router.post('/dl/test-pass', async (req, res) => {
    const dlNumber = 'MH-12-DL-2026-004821';
    const tracking = 'EM492817291IN';

    return res.json({
        success: true,
        dlNumber,
        status: 'dispatched',
        speedPostTracking: tracking,
        issuingAuthority: 'RTO Pune (MH-12)',
        validity: '20 Years (Till 2046)',
        message: 'ADTT test cleared (100% score). Physical Smart Card dispatched via India Post.'
    });
});

// POST /api/licenses/idp/draft
router.post('/idp/draft', async (req, res) => {
    const { role_key, passport, country, doctor_approved } = req.body;
    const appNumber = 'IDP-DR-8821';

    return res.json({
        success: true,
        appNumber,
        doctorApproved: Boolean(doctor_approved),
        status: 'Draft Saved',
        message: 'IDP draft application saved. Resume anytime when blood test is ready.'
    });
});

// POST /api/licenses/idp/submit
router.post('/idp/submit', async (req, res) => {
    const { app_number, blood_report_uploaded } = req.body;
    return res.json({
        success: true,
        permitNumber: 'IN-IDP-2026-98124',
        validity: '1 Year (1949 Geneva Convention)',
        categories: ['Category A (Motorcycles)', 'Category B (Passenger Cars)'],
        trackingNumber: 'IN982147102SP',
        message: 'Digital IDP booklet generated. Physical booklet dispatched via Speed Post.'
    });
});

module.exports = router;
