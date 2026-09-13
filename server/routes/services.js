const express = require('express');
const router = express.Router();
const { localStore } = require('../db/supabase');

// POST /api/services/duplicate-rc
router.post('/duplicate-rc', (req, res) => {
    const { reg_number, reason, fir_number } = req.body;
    return res.json({
        success: true,
        receiptNumber: `RR-DRC-${Math.floor(Math.random() * 9000 + 1000)}`,
        message: 'Duplicate Smart RC Card order placed. Digital duplicate active immediately in DigiLocker.'
    });
});

// POST /api/services/hsrp
router.post('/hsrp', (req, res) => {
    const { reg_number, fitment_type, appointment_date } = req.body;
    return res.json({
        success: true,
        orderId: `HSRP-IN-${Math.floor(Math.random() * 90000 + 10000)}`,
        message: 'High Security Registration Plate booked with color-coded laser fuel sticker.'
    });
});

// POST /api/services/fancy-number
router.post('/fancy-number', (req, res) => {
    const { desired_number } = req.body;
    return res.json({
        success: true,
        number: desired_number || '0007',
        category: 'Elite Choice',
        basePrice: 100000,
        status: 'Available in Ongoing e-Auction'
    });
});

// GET /api/payments
router.get('/payments', (req, res) => {
    const role = req.query.role || 'rohan';
    const payments = localStore.payments.filter(p => p.citizen_role_key === role);
    return res.json({ success: true, payments });
});

module.exports = router;
