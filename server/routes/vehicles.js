const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured, localStore } = require('../db/supabase');

// GET /api/vehicles - get fleet for active role
router.get('/', async (req, res) => {
    const role = req.query.role || 'rohan';
    let vehicles = [];

    if (isSupabaseConfigured) {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('owner_role_key', role);
        if (data && data.length > 0) vehicles = data;
    }

    if (!vehicles.length) {
        vehicles = localStore.vehicles.filter(v => v.owner_role_key === role);
    }

    return res.json({ success: true, count: vehicles.length, vehicles });
});

// GET /api/vehicles/:id - get single vehicle details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let vehicle = null;

    if (isSupabaseConfigured) {
        const { data } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (data) vehicle = data;
    }

    if (!vehicle) {
        vehicle = localStore.vehicles.find(v => v.id === id);
    }

    if (!vehicle) {
        return res.status(404).json({ success: false, error: 'Vehicle not found in national registry' });
    }

    return res.json({ success: true, vehicle });
});

// POST /api/vehicles/noc - clear loan hypothecation
router.post('/noc', async (req, res) => {
    const { vehicle_id } = req.body;
    const targetId = vehicle_id || 'ka01';

    if (isSupabaseConfigured) {
        await supabase
            .from('vehicles')
            .update({ noc_cleared: true, hypothecated_to: null, risk_status: 'All clear' })
            .eq('id', targetId);
    }

    const v = localStore.vehicles.find(item => item.id === targetId);
    if (v) {
        v.noc_cleared = true;
        v.hypothecated_to = null;
    }

    return res.json({
        success: true,
        nocReference: 'NOC-HDFC-2026-9912',
        message: 'Digital NOC issued by HDFC Bank via Account Aggregator. Lien removed from VAHAN database.'
    });
});

module.exports = router;
