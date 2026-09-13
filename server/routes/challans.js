const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured, localStore } = require('../db/supabase');

// GET /api/challans
router.get('/', async (req, res) => {
    const role = req.query.role || 'rohan';
    const challans = role === 'rohan'
        ? [localStore.challans[0]]
        : [localStore.challans[1]];

    return res.json({ success: true, challans });
});

// POST /api/challans/:id/pay
router.post('/:id/pay', async (req, res) => {
    const { id } = req.params;
    const c = localStore.challans.find(item => item.id === id) || localStore.challans[0];
    c.status = 'paid';

    return res.json({
        success: true,
        receiptId: `RR-CH-${Math.floor(Math.random() * 9000 + 1000)}`,
        message: `₹${c.amount} paid securely via Bharat BillPay (BBPS). Violation record cleared in Virtual Court.`
    });
});

// POST /api/challans/:id/contest
router.post('/:id/contest', async (req, res) => {
    const { id } = req.params;
    const { reason, description } = req.body;
    const c = localStore.challans.find(item => item.id === id) || localStore.challans[0];
    c.status = 'disputed';
    c.dispute_reason = reason;

    return res.json({
        success: true,
        courtCaseNumber: `VTC-MH-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
        message: 'Dispute submitted to Virtual Traffic Court Magistrate. Statutory payment deadline is frozen pending hearing.'
    });
});

module.exports = router;
