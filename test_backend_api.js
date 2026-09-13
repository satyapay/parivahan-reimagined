const app = require('./server/server');
const http = require('http');

const server = http.createServer(app);
const PORT = 3456;

server.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    let passed = 0;
    let failed = 0;

    async function req(path, options = {}) {
        const url = `http://localhost:${PORT}${path}`;
        const res = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
        });
        const data = await res.json();
        return { status: res.status, data };
    }

    try {
        console.log("\n=== TESTING BACKEND REST ENDPOINTS ===");

        // 1. Health
        const h = await req('/api/health');
        if (h.data.status === 'healthy') { console.log('  [PASS] GET /api/health'); passed++; }
        else { console.error('  [FAIL] GET /api/health'); failed++; }

        // 2. Auth Send OTP
        const otp = await req('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ identifier: '9876543210' }) });
        if (otp.data.success && otp.data.demoOtp === '123456') { console.log('  [PASS] POST /api/auth/send-otp'); passed++; }
        else { console.error('  [FAIL] POST /api/auth/send-otp'); failed++; }

        // 3. Auth Verify OTP
        const vOtp = await req('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ otp: '123456', role_key: 'rohan' }) });
        if (vOtp.data.success && vOtp.data.citizen.name === 'Rohan Shah') { console.log('  [PASS] POST /api/auth/verify-otp'); passed++; }
        else { console.error('  [FAIL] POST /api/auth/verify-otp'); failed++; }

        // 4. Vehicles (Rohan)
        const vRohan = await req('/api/vehicles?role=rohan');
        if (vRohan.data.success && vRohan.data.count === 4) { console.log('  [PASS] GET /api/vehicles (Rohan fleet - 4 vehicles)'); passed++; }
        else { console.error('  [FAIL] GET /api/vehicles (Rohan)'); failed++; }

        // 5. Vehicles (Ananya)
        const vAnanya = await req('/api/vehicles?role=seller');
        if (vAnanya.data.success && vAnanya.data.count === 4) { console.log('  [PASS] GET /api/vehicles (Ananya fleet - 4 vehicles)'); passed++; }
        else { console.error('  [FAIL] GET /api/vehicles (Ananya)'); failed++; }

        // 6. Vehicles Bank NOC
        const noc = await req('/api/vehicles/noc', { method: 'POST', body: JSON.stringify({ vehicle_id: 'ka01' }) });
        if (noc.data.success && noc.data.nocReference) { console.log('  [PASS] POST /api/vehicles/noc'); passed++; }
        else { console.error('  [FAIL] POST /api/vehicles/noc'); failed++; }

        // 7. Licensing LL Quiz
        const quiz = await req('/api/licenses/ll/submit-quiz', { method: 'POST', body: JSON.stringify({ role_key: 'applicant', score: 14 }) });
        if (quiz.data.success && quiz.data.llNumber === 'MH-12-LL-2026-004821') { console.log('  [PASS] POST /api/licenses/ll/submit-quiz'); passed++; }
        else { console.error('  [FAIL] POST /api/licenses/ll/submit-quiz'); failed++; }

        // 8. Licensing DL Slot Booking
        const dlSlot = await req('/api/licenses/dl/book-slot', { method: 'POST', body: JSON.stringify({ role_key: 'applicant', slot_date: '18 Sep 2026' }) });
        if (dlSlot.data.success && dlSlot.data.applicationRef === 'RR-DL-8819') { console.log('  [PASS] POST /api/licenses/dl/book-slot'); passed++; }
        else { console.error('  [FAIL] POST /api/licenses/dl/book-slot'); failed++; }

        // 9. P2P Transfer Start
        const trStart = await req('/api/transfers/start', { method: 'POST', body: JSON.stringify({ vehicle_id: 'ka01', buyer_name: 'Rohan Shah' }) });
        if (trStart.data.success && trStart.data.transfer.status === 'Waiting for buyer') { console.log('  [PASS] POST /api/transfers/start'); passed++; }
        else { console.error('  [FAIL] POST /api/transfers/start'); failed++; }

        // 10. P2P Video KYC
        const kyc = await req('/api/transfers/kyc', { method: 'POST', body: JSON.stringify({ role: 'seller', liveness_confirmed: true }) });
        if (kyc.data.success && kyc.data.transfer.seller_kyc) { console.log('  [PASS] POST /api/transfers/kyc'); passed++; }
        else { console.error('  [FAIL] POST /api/transfers/kyc'); failed++; }

        // 11. Challans
        const ch = await req('/api/challans?role=rohan');
        if (ch.data.success && ch.data.challans.length > 0) { console.log('  [PASS] GET /api/challans'); passed++; }
        else { console.error('  [FAIL] GET /api/challans'); failed++; }

        // 12. Challan Contest in Virtual Court
        const contest = await req('/api/challans/MH-EXP-88912/contest', { method: 'POST', body: JSON.stringify({ reason: 'Speed radar calibration' }) });
        if (contest.data.success && contest.data.courtCaseNumber) { console.log('  [PASS] POST /api/challans/:id/contest'); passed++; }
        else { console.error('  [FAIL] POST /api/challans/:id/contest'); failed++; }

        // 13. AI Chat Proxy
        const chat = await req('/api/chat', { method: 'POST', body: JSON.stringify({ message: 'What are the rules for RC transfer?' }) });
        if (chat.data.success && chat.data.reply) { console.log('  [PASS] POST /api/chat'); passed++; }
        else { console.error('  [FAIL] POST /api/chat'); failed++; }

        console.log(`\n=======================================================`);
        console.log(`BACKEND AUDIT RESULT: ${passed} PASSED, ${failed} FAILED`);
        console.log(`=======================================================`);

    } catch (e) {
        console.error("Test error:", e);
        failed++;
    } finally {
        server.close();
        if (failed > 0) process.exit(1);
    }
});
