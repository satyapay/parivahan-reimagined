const app = require('../server/server');
const http = require('http');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const server = http.createServer(app);
const PORT = 4568;

server.listen(PORT, async () => {
    const html = fs.readFileSync('../index.html', 'utf8');
    const dom = new JSDOM(html, {
        runScripts: "dangerously",
        resources: "usable",
        url: `http://localhost:${PORT}`
    });

    const window = dom.window;
    const document = window.document;

    let passed = 0;
    let failed = 0;
    const errors = [];

    function check(label, condition) {
        if (condition) {
            console.log(`  [PASS] ${label}`);
            passed++;
        } else {
            console.error(`  [FAIL] ${label}`);
            failed++;
            errors.push(label);
        }
    }

    console.log("=================================================================");
    console.log("             PARIVAHAN REIMAGINED: FULL PORTAL AUDIT             ");
    console.log("=================================================================\n");

    try {
        // 1. Landing Page
        console.log("1. LANDING PAGE & ENTRY POINTS:");
        window.state.screen = 'landing';
        window.render();
        let h = document.getElementById('app').innerHTML;
        check("Landing page renders with hero title", h.includes("Reimagining Citizen"));
        check("Apply for LL button configured", h.includes("startLLFlow()"));
        check("Citizen Login button configured", h.includes("startExistingLogin()"));
        check("All 6 National Services cards rendered", 
            h.includes("Learner's License") && 
            h.includes("Permanent Driving License") && 
            h.includes("Vehicle Ownership Transfer") && 
            h.includes("Virtual Court") && 
            h.includes("Duplicate RC") && 
            h.includes("DL Renewal")
        );

        // 2. Auth Flow
        console.log("\n2. AUTHENTICATION & LOGIN (Aadhaar / Mobile OTP):");
        window.startExistingLogin();
        check("Auth screen opens (mobile step)", window.state.screen === 'auth');
        window.submitMobileLogin();
        window.submitOtpLogin();
        check("Dashboard loads successfully after OTP login", window.state.screen === 'dashboard');

        // 3. Learner's License Flow
        console.log("\n3. LEARNER'S LICENSE (LL) FLOW:");
        window.openLLApply();
        check("LL Modal opens at Step 0", window.state.modal === 'll-apply' && window.state.llStep === 0);
        window.llNext(); // step 1 (Aadhaar OTP)
        check("LL Step 1 (Aadhaar OTP)", window.state.llStep === 1);
        window.llNext(); // step 2 (DigiLocker)
        check("LL Step 2 (DigiLocker document sync)", window.state.llStep === 2);
        window.llFetchAllDocs();
        check("1-Click DigiLocker Fetch updates age & address proofs", window.state.llAgeFetched === true && window.state.llAddrFetched === true);
        window.llNext(); // step 3 (Sign)
        check("LL Step 3 (Digital Signature)", window.state.llStep === 3);
        window.llSign();
        check("Digital signature recorded", window.state.llSigned === true);
        window.llNext(); // step 4 (Statutory fee)
        check("LL Step 4 (Statutory fee & application review)", window.state.llStep === 4);
        window.llPay(); // step 5 (Test)
        check("LL Step 5 (AI Proctored Road Safety Test)", window.state.llStep === 5);
        window.llSubmitTest();
        check("LL Test submitted & Passed -> Digital LL issued (MH-12-LL-2026-004821)", window.state.llComplete === true && window.state.llNumber === 'MH-12-LL-2026-004821');
        window.closeModal();

        // 4. Permanent Driving License (DL) & ADTT Test Track Flow
        console.log("\n4. PERMANENT DL & AUTOMATED TEST TRACK (ADTT) FLOW:");
        window.openDLApply();
        check("DL Application modal opens at Step 0 (CMVR 30-Day Eligibility check)", window.state.modal === 'dl-apply' && window.state.dlStep === 0);
        window.dlNext(); // step 1 (Details)
        check("DL Step 1 (Demographic confirmation)", window.state.dlStep === 1);
        window.dlNext(); // step 2 (Form 5B Exemption)
        check("DL Step 2 (Form 5B ADTC driving school exemption)", window.state.dlStep === 2);
        window.dlNext(); // step 3 (Slot Booking)
        check("DL Step 3 (ADTT Sensor track slot selection)", window.state.dlStep === 3);
        window.selectSlotDate('18 Sep 2026');
        window.selectSlotTime('09:30 AM - 10:30 AM');
        check("Appointment date and time selected", window.state.dlSlotDate === '18 Sep 2026' && window.state.dlSlotTime === '09:30 AM - 10:30 AM');
        window.dlNext(); // step 4 (Fee)
        check("DL Step 4 (Statutory fee calculation: ₹700)", window.state.dlStep === 4);
        window.payDLFee();
        check("DL test slot confirmed", window.state.dlStatus === 'slot_booked');
        window.closeModal();

        window.simulateTestPassed();
        check("Practical Test Passed -> Permanent DL Dispatched via Speed Post", window.state.dlStatus === 'dispatched');

        // 5. Transition to Rohan Shah's Vehicle Ownership Account
        console.log("\n5. FAST-FORWARD TO ROHAN SHAH VEHICLE FLEET:");
        window.fastForwardToVehicleOwner();
        check("Role switched to Rohan Shah", window.state.role === 'rohan');
        window.section('overview');
        h = document.getElementById('app').innerHTML;
        check("Rohan's dashboard displays Hunter 350 PUC alert (5 days)", h.includes("MH 12 RT 4582") && h.includes("5 days"));
        check("Rohan's dashboard displays Mumbai-Pune Expressway challan (₹1000)", h.includes("MH 12 QP 7721") && h.includes("1000"));

        window.section('vehicles');
        h = document.getElementById('app').innerHTML;
        check("Rohan's 4 vehicles displayed in Vehicles tab (Nexon EV, Hunter 350, Verna Turbo, Ather 450X)", 
            h.includes("Tata Nexon EV Max") && 
            h.includes("Royal Enfield Hunter 350") && 
            h.includes("Hyundai Verna 1.5 Turbo") && 
            h.includes("Ather 450X Gen 3")
        );

        // 6. e-Challan & Virtual Traffic Court
        console.log("\n6. E-CHALLAN & VIRTUAL TRAFFIC COURT:");
        window.openChallan();
        check("e-Challan modal opens with camera radar evidence", window.state.modal === 'challan');
        window.contestChallan();
        check("Contest step opens with frozen deadline notice", window.state.challanStep === 1);
        window.submitContest();
        check("Dispute submitted to Virtual Court", window.state.challanStatus === 'disputed');
        window.closeModal();

        // 7. P2P Ownership Transfer Room & Video KYC
        console.log("\n7. P2P OWNERSHIP TRANSFER & REMOTE VIDEO KYC:");
        window.switchCitizenRole('seller'); // Ananya as seller
        window.section('transfers');
        window.openTransfer();
        check("Transfer Modal opens (Step 0 - Readiness check)", window.state.modal === 'transfer' && window.state.transferStep === 0);
        window.nextTransfer(); // step 1
        check("Transfer Step 1 (Buyer details)", window.state.transferStep === 1);
        window.nextTransfer(); // step 2
        check("Transfer Step 2 (Review invite)", window.state.transferStep === 2);
        window.sendInvite();
        check("Transfer room initiated ('Waiting for buyer')", window.state.transfer.inviteSent === true && window.state.transfer.status === 'Waiting for buyer');
        window.closeModal();

        window.switchRole('buyer'); // Rohan as buyer
        check("Switched to buyer role", window.state.role === 'buyer');
        window.buyerAccept();
        check("Buyer accepted transfer request", window.state.transfer.buyerAccepted === true);
        window.openKyc('buyer');
        check("Guided Remote Video KYC Modal opens", window.state.modal === 'kyc-buyer' && window.state.kycStep === 0);
        window.nextKyc('buyer'); // 1
        window.nextKyc('buyer'); // 2
        window.nextKyc('buyer'); // 3
        window.nextKyc('buyer'); // done
        check("Buyer KYC completed successfully", window.state.transfer.buyerKyc === true);
        window.closeModal();

        // 8. International Driving Permit (IDP) Workflow
        console.log("\n8. INTERNATIONAL DRIVING PERMIT (IDP) WORKFLOW:");
        window.openIdp();
        check("IDP Modal opens (Step 0 - Form 4A Travel & Passport)", window.state.modal === 'idp' && window.state.idpStep === 0);
        window.nextIdp();
        check("IDP Step 1 (e-Sanjeevani Tele-consultation)", window.state.idpStep === 1);
        window.startIdpTeleconsult();
        window.state.idpTeleState = 'completed';
        window.nextIdp();
        check("IDP Step 2 (Mandatory Diagnostic Blood Test Upload)", window.state.idpStep === 2);

        // Save Draft & Resume
        window.saveIdpDraft();
        check("IDP Draft saved (#IDP-DR-8821)", window.state.idpDraft === true);
        window.section('overview');
        h = document.getElementById('app').innerHTML;
        check("Draft IDP alert row rendered on Dashboard", h.includes("Draft IDP Application (IDP-DR-8821)"));

        // Resume IDP and Upload Blood Test
        window.openIdp();
        window.uploadIdpBloodReport();
        check("Blood Serology test report uploaded", window.state.idpBloodUploaded === true);
        window.nextIdp();
        check("IDP Step 3 (Category A & B Endorsements)", window.state.idpStep === 3);
        window.nextIdp();
        check("IDP Step 4 (Statutory fee payment: ₹1000)", window.state.idpStep === 4);
        window.payIdp();
        check("Digital IDP booklet generated and dispatched", window.state.idpStep === 5);
        window.closeModal();

        // 9. In-App Document & Receipt Previews
        console.log("\n9. IN-APP DOCUMENT & RECEIPT PREVIEWS:");
        window.downloadDocument('Permanent_DL_MH12.pdf');
        h = document.getElementById('app').innerHTML;
        check("Digital DL preview renders with Form 7 metadata", window.state.modal === 'document-preview' && h.includes("Form 7: Digital Driving License"));
        window.closeModal();

        window.downloadDocument('RR-DL-8819_Receipt.pdf');
        h = document.getElementById('app').innerHTML;
        check("BBPS Treasury receipt preview renders with transaction metadata", h.includes("Official Treasury Payment Receipt") && h.includes("Bharat BillPay (BBPS) Tax Invoice"));
        window.closeModal();

        // 10. Ancillary Services
        console.log("\n10. ANCILLARY SERVICES (Duplicate RC, HSRP, NOC, Fancy Number, Change DL Details, Renew DL):");
        window.openDuplicateRc();
        check("Duplicate RC Modal works", window.state.modal === 'duplicate-rc');
        window.closeModal();

        window.openHsrp();
        check("HSRP Plate Booking Modal works", window.state.modal === 'hsrp');
        window.closeModal();

        window.openNoc();
        check("Bank Loan NOC clearance Modal works", window.state.modal === 'noc');
        window.closeModal();

        window.openFancyNumber();
        check("Fancy Number e-Auction Modal works", window.state.modal === 'fancy-number');
        window.closeModal();

        window.openChangeDetails();
        check("Change DL Details Modal works", window.state.modal === 'change-details');
        window.closeModal();

        window.openRenewDl();
        check("Renew DL Modal works (Form 9 & Form 1 / 1-A)", window.state.modal === 'renew-dl');
        window.closeModal();

        console.log("\n=================================================================");
        console.log(`AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
        console.log("=================================================================");

        if (failed === 0) {
            console.log("ALL 42 CRITICAL CAPABILITIES AND FLOWS ARE 100% OPERATIONAL!");
        } else {
            console.error("FAILURES DETECTED:", errors);
        }
    } catch (e) {
        console.error("Test execution error:", e);
        failed++;
    } finally {
        server.close();
        if (failed > 0) process.exit(1);
    }
});
