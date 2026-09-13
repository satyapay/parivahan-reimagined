const app = require('./server/server');
const http = require('http');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const server = http.createServer(app);
const PORT = 4567;

server.listen(PORT, async () => {
    console.log(`Live Integration Test Server running on port ${PORT}`);

    const html = fs.readFileSync('index.html', 'utf8');
    const dom = new JSDOM(html, {
        runScripts: "dangerously",
        resources: "usable",
        url: `http://localhost:${PORT}`
    });

    const window = dom.window;
    const document = window.document;

    let passed = 0;
    let failed = 0;

    function check(label, condition) {
        if (condition) {
            console.log(`  [PASS] ${label}`);
            passed++;
        } else {
            console.error(`  [FAIL] ${label}`);
            failed++;
        }
    }

    try {
        console.log("\n=== TESTING FULL SYSTEM (FRONTEND + EXPRESS REST BACKEND) ===");

        // 1. Health Endpoint
        const hRes = await fetch(`http://localhost:${PORT}/api/health`);
        const hData = await hRes.json();
        check("Backend Health endpoint responds 200 OK", hData.status === 'healthy');

        // 2. Auth & Login
        window.startExistingLogin();
        check("Auth UI rendered", window.state.screen === 'auth');
        window.verifyOtp();
        check("OTP verification and login successful", window.state.screen === 'dashboard');

        // 3. Vehicles API
        const vRes = await fetch(`http://localhost:${PORT}/api/vehicles?role=rohan`);
        const vData = await vRes.json();
        check("Vehicles API returns Rohan's 4 vehicles", vData.success && vData.count === 4);

        // 4. Transfers API
        const trRes = await fetch(`http://localhost:${PORT}/api/transfers/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicle_id: 'ka01', buyer_name: 'Rohan Shah' })
        });
        const trData = await trRes.json();
        check("P2P Transfer Room API initiates transfer", trData.success && trData.transfer.status === 'Waiting for buyer');

        // 5. Challan API
        const chRes = await fetch(`http://localhost:${PORT}/api/challans?role=rohan`);
        const chData = await chRes.json();
        check("Challans API returns traffic violations", chData.success && chData.challans.length > 0);

        console.log(`\n=======================================================`);
        console.log(`INTEGRATION AUDIT RESULT: ${passed} PASSED, ${failed} FAILED`);
        console.log(`=======================================================`);

    } catch (e) {
        console.error("Test error:", e);
        failed++;
    } finally {
        server.close();
        if (failed > 0) process.exit(1);
    }
});
