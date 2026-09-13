const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { message, context, apiKey } = req.body;
    const geminiKey = process.env.GEMINI_API_KEY || apiKey || '';

    if (!geminiKey) {
        return res.json({
            success: true,
            reply: `**Parivahan Sahayak (AI Assistant)**<br>Hello! Under Indian Motor Vehicle Rules (MVA 2019 & CMVR), all license and vehicle services are faceless. For vehicle transfers, both parties complete remote Video KYC. How can I assist you further?`
        });
    }

    try {
        const systemPrompt = `You are Parivahan Sahayak, the official AI guide for the Ministry of Road Transport & Highways (MoRTH), Government of India. Keep responses concise, helpful, and authoritative using markdown. Context: ${context || 'General transport query'}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I am ready to help you with transport queries.';
        return res.json({ success: true, reply });
    } catch (err) {
        return res.json({
            success: true,
            reply: `**Parivahan Sahayak**: I am available to answer questions regarding RC transfer rules, e-Challan disputes, or Learner's License tests.`
        });
    }
});

module.exports = router;
