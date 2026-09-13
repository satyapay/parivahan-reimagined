const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured, localStore } = require('../db/supabase');

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
    const { identifier, type } = req.body; // mobile or aadhaar
    return res.json({
        success: true,
        message: '6-digit OTP sent successfully to linked mobile',
        demoOtp: '123456',
        expiresInSeconds: 300
    });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { otp, role_key } = req.body;
    if (otp !== '123456') {
        return res.status(400).json({ success: false, error: 'Invalid OTP. Enter demo OTP 123456.' });
    }

    const targetRole = role_key || 'rohan';
    let citizen = null;

    if (isSupabaseConfigured) {
        const { data, error } = await supabase
            .from('citizens')
            .select('*')
            .eq('role_key', targetRole)
            .maybeSingle();
        if (data) citizen = data;
    }

    if (!citizen) {
        citizen = localStore.citizens.find(c => c.role_key === targetRole) || localStore.citizens[0];
    }

    return res.json({
        success: true,
        token: `mock_jwt_token_${citizen.role_key}_${Date.now()}`,
        citizen
    });
});

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
    const roleKey = req.query.role || 'rohan';
    let citizen = null;

    if (isSupabaseConfigured) {
        const { data } = await supabase
            .from('citizens')
            .select('*')
            .eq('role_key', roleKey)
            .maybeSingle();
        if (data) citizen = data;
    }

    if (!citizen) {
        citizen = localStore.citizens.find(c => c.role_key === roleKey) || localStore.citizens[0];
    }

    return res.json({ success: true, citizen });
});

// PUT /api/auth/profile
router.put('/profile', async (req, res) => {
    const { role_key, address, mobile, name } = req.body;
    const role = role_key || 'rohan';

    if (isSupabaseConfigured) {
        await supabase
            .from('citizens')
            .update({ address, mobile, name })
            .eq('role_key', role);
    }

    const c = localStore.citizens.find(item => item.role_key === role);
    if (c) {
        if (address) c.address = address;
        if (mobile) c.mobile = mobile;
        if (name) c.name = name;
    }

    return res.json({ success: true, message: 'Profile updated successfully via Aadhaar e-KYC sync', citizen: c });
});

module.exports = router;
