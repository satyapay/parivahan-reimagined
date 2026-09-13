const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Update Transfers dashboard text
code = code.replace(
  "Verify physical vehicle details using our AI fraud-detection scanner.<br><button class=\"btn primary small\" style=\"margin-top:9px\" onclick=\"openVehicleVerify()\">Start AI Scanner</button>",
  "Upload current photos of the physical vehicle and chassis number.<br><button class=\"btn primary small\" style=\"margin-top:9px\" onclick=\"openVehicleVerify()\">Verify Vehicle</button>"
);

// Update Modal title and text
code = code.replace(
  "<h2>Vehicle AI Verification</h2>",
  "<h2>Vehicle Verification</h2>"
);

code = code.replace(
  "<b>AI Vehicle Verification</b><br>Upload photos of your physical vehicle and its chassis number. Our AI will analyze them for authenticity, deepfakes, and EXIF manipulation.",
  "<b>Upload Current Photos</b><br>Upload photos of your physical vehicle and its chassis number. They will be submitted for verification."
);

code = code.replace(
  "<button class=\"btn primary\" onclick=\"runVehicleAI()\">Run AI Analysis →</button>",
  "<button class=\"btn primary\" onclick=\"runVehicleAI()\">Submit for Verification →</button>"
);

fs.writeFileSync('index.html', code);
