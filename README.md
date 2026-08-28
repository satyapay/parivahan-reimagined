# Parivahan Sewa - Reimagined 🇮🇳

A modern, user-centric prototype reimagining the **Parivahan Sewa** portal for the **Build What Moves India** competition. This proof-of-concept (POC) demonstrates a frictionless, transparent, and digital-first approach to vehicle services like Ownership Transfers, Challan Management, and Duplicate RCs.

## 🚀 Live Demo
**[Replace with your Vercel Link]**

## 💡 The Problem
The current citizen experience for vehicle administration often involves physical RTO visits, fragmented information, and complex manual workflows. Citizens struggle with:
- Opacity in ownership transfer workflows (buyer vs. seller responsibilities).
- Unclear context regarding traffic challans before payment.
- Heavy reliance on physical document verification.

## ✨ Key Features & Workflows

### 1. Collaborative Ownership Transfer & Video KYC
A shared, state-aware journey that eliminates guessing who must do what next.
- **Role-based Dashboards:** Distinct views and actionable tasks for both Buyers and Sellers.
- **WebRTC Video Verification:** A remote, live webcam-based Video KYC flow confirming consent and liveness, drastically reducing the need for physical RTO visits.
- **Document Pre-checks:** Automated readiness checks (PUC, Insurance, Challans) before a transfer can even be initiated.

### 2. Virtual Traffic Court & Challan Dispute
- **Contextual Challans:** Displays the exact location, time, and mock camera evidence of the traffic violation.
- **Dispute Workflow:** Citizens can officially contest a challan by selecting a reason (e.g., cloned plates, medical emergency), providing a description, and uploading supporting documents.
- **Automated Freezes:** Submitting a dispute routes it to the Virtual Traffic Court and automatically freezes the payment deadline.

### 3. Streamlined Duplicate RC
- **Dynamic Workflows:** Asking the right questions based on context. If an RC is "Lost/Stolen," it requests a Police FIR. If it's "Torn/Mutilated," it opens a file dropzone to upload a picture of the damaged card.

### 4. Digital-First UI/UX
- **Unified Vehicle View:** A single source of truth for your vehicle's documents, transfer status, and alerts.
- **Trust & Branding:** Clean, modern interface utilizing subtle Indian national colors (Ashoka Navy, Saffron, Green) to maintain official Government of India authority while feeling completely modern.

## 🛠️ Technical Stack
This prototype was intentionally built to be lightweight and fast:
- **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript (No heavy frameworks, contained entirely in a single SPA architecture).
- **State Management:** Custom global state object with `localStorage` persistence to simulate a real database across sessions.
- **APIs:** HTML5 `navigator.mediaDevices.getUserMedia` for live Video KYC.

## 💻 Local Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/parivahan-reimagined.git
   ```
2. Open the project folder.
3. Simply open `index.html` in any modern web browser to view the prototype. No `npm install` or build steps required!
