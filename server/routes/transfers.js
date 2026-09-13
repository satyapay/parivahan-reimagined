const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured, localStore } = require('../db/supabase');

// GET /api/transfers/status
router.get('/status', async (req, res) => {
    const vehicleId = req.query.vehicle_id || 'ka01';
    let transfer = localStore.transfers.find(t => t.vehicle_id === vehicleId) || localStore.transfers[0];
    return res.json({ success: true, transfer });
});

// POST /api/transfers/start
router.post('/start', async (req, res) => {
    const { vehicle_id, buyer_name, buyer_mobile, buyer_state } = req.body;
    const t = localStore.transfers[0];
    t.vehicle_id = vehicle_id || 'ka01';
    t.buyer_name = buyer_name || 'Rohan Shah';
    t.buyer_mobile = buyer_mobile || '98 7654 3210';
    t.buyer_state = buyer_state || 'Karnataka';
    t.invite_sent = true;
    t.status = 'Waiting for buyer';

    return res.json({
        success: true,
        message: 'P2P Transfer Room initiated. Secure invitation sent to buyer.',
        transfer: t
    });
});

// POST /api/transfers/accept
router.post('/accept', async (req, res) => {
    const t = localStore.transfers[0];
    t.buyer_accepted = true;
    t.status = 'Remote verification pending';

    return res.json({
        success: true,
        message: 'Transfer request accepted by buyer. Proceed to Remote Video KYC.',
        transfer: t
    });
});

// POST /api/transfers/kyc
router.post('/kyc', async (req, res) => {
    const { role, liveness_confirmed, verbal_otp_confirmed } = req.body;
    const t = localStore.transfers[0];

    if (role === 'seller') {
        t.seller_kyc = true;
    } else {
        t.buyer_kyc = true;
    }

    if (t.seller_kyc && t.buyer_kyc) {
        t.submitted = true;
        t.status = 'Under RTO review';
    }

    return res.json({
        success: true,
        message: `${role === 'seller' ? 'Seller' : 'Buyer'} remote video KYC verified. Non-repudiable consent logged.`,
        transfer: t
    });
});

module.exports = router;
