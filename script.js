 let epAttempts = 0;
let jcAttempts = 0;

    // PAGE NAVIGATION LOGIC
    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        window.scrollTo(0,0);
    }

    // DEPARTMENT POPUP LOGIC
    function openDept(name, doctors, info) {
        const newWindow = window.open("", "_blank");
        newWindow.document.write(`
            <html>
            <head><title>${name} - APS Boys Hospital</title></head>
            <style>
                body { font-family: 'Segoe UI', sans-serif; padding: 50px; line-height: 1.6; background: #f4f4f4; }
                .box { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
                h1 { color: #1a73e8; }
                .dr-list { color: #063d15; font-weight: bold; font-size: 1.2rem; }
                .btn-appoint { 
                    background: #1a73e8; color: white; padding: 12px 24px; border: none; 
                    border-radius: 5px; font-weight: bold; cursor: pointer; margin-top: 20px; 
                }
            </style>
            <body>
                <div class="box">
                    <h1>Department of ${name}</h1>
                    <p>${info}</p>
                    <hr>
                    <h3>Consultant Doctors:</h3>
                    <p class="dr-list">${doctors}</p>
                    
                    <button class="btn-appoint" onclick="window.opener.openAppointmentForm('${name}', '${doctors}')">
                        Open Appointment Form
                    </button>
                    
                    <p style="margin-top:20px;"><i>Please click the button above to book your visit.</i></p>
                </div>
            </body>
            </html>
        `);
    }

   // UPDATED FUNCTION: APPOINTMENT FORM WITH RECEIPT & PRINTING
    function openAppointmentForm(deptName, doctors) {
        const appointWin = window.open("", "_blank");
        appointWin.document.write(`
            <html>
            <head><title>Appointment Booking - APS Boys Hospital</title></head>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #eef2f7; padding: 40px; display: flex; justify-content: center; }
                .form-container, .receipt-container { 
                    max-width: 500px; width: 100%; background: white; padding: 30px; 
                    border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
                }
                h2 { color: #1a73e8; text-align: center; margin-top: 0; }
                label { display: block; margin-top: 15px; font-weight: 500; }
                input, select, textarea { width: 100%; padding: 12px; margin-top: 5px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
                .submit-btn { background: #34a853; color: white; border: none; width: 100%; padding: 15px; margin-top: 25px; border-radius: 6px; font-size: 1.1rem; cursor: pointer; transition: 0.3s; }
                .submit-btn:hover { background: #2d8e47; }
                
                /* Receipt Specific Styling */
                .receipt-container { border: 2px solid #1a73e8; display: none; }
                .receipt-header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 20px; }
                .receipt-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .receipt-footer { text-align: center; font-size: 0.8rem; color: #777; margin-top: 20px; }
                .print-btn { background: #202124; color: white; border: none; width: 100%; padding: 12px; margin-top: 20px; border-radius: 6px; cursor: pointer; }
                
                @media print {
                    .print-btn { display: none; }
                    body { background: white; padding: 0; }
                    .receipt-container { box-shadow: none; border: 1px solid #000; }
                }
            </style>
            <body>
                <div id="bookingForm" class="form-container">
                    <h2>Book Appointment</h2>
                    <p style="text-align:center; color:#666;">Department: <strong>${deptName}</strong></p>
                    <form id="mainAppointForm">
                        <label>Patient Full Name</label>
                        <input type="text" id="name" required placeholder="Enter your name">
                        
                        <label>Select Doctor</label>
                        <select id="docSelect"></select>
                        
                        <label>Preferred Date</label>
                        <input type="date" id="date" required>

                        <label>Phone Number</label>
                        <input type="tel" id="phone" required placeholder="03xx-xxxxxxx">
                        
                        <button type="button" class="submit-btn" onclick="generateReceipt()">Confirm & Generate Receipt</button>
                    </form>
                </div>

                <div id="receiptArea" class="receipt-container">
                    <div class="receipt-header">
                        <h3 style="margin:0; color:#1a73e8;">APS BOYS HOSPITAL</h3>
                        <small>Official Appointment Slip</small>
                    </div>
                    
                    <div class="receipt-row"><span>Token No:</span> <strong id="rToken"></strong></div>
                    <div class="receipt-row"><span>Patient:</span> <strong id="rName"></strong></div>
                    <div class="receipt-row"><span>Department:</span> <strong>${deptName}</strong></div>
                    <div class="receipt-row"><span>Doctor:</span> <strong id="rDoc"></strong></div>
                    <div class="receipt-row"><span>Date:</span> <strong id="rDate"></strong></div>
                    <div class="receipt-row"><span>Status:</span> <span style="color:green; font-weight:bold;">CONFIRMED</span></div>

                    <div class="receipt-footer">
                        <p>Please arrive 15 minutes before your time slot.<br>Show this digital slip at the reception.</p>
                        <hr>
                        <p>Warsak Road, Peshawar | Emergency: 1122</p>
                    </div>

                    <button class="print-btn" onclick="window.print()">Download PDF / Print Slip</button>
                </div>

                <script>
                    // Populate Doctors
                    const docArr = "${doctors}".split(',');
                    const select = document.getElementById('docSelect');
                    docArr.forEach(d => {
                        let opt = document.createElement('option');
                        opt.value = d.trim();
                        opt.innerText = d.trim();
                        select.appendChild(opt);
                    });

                    // Logic to switch from Form to Receipt
                    function generateReceipt() {
                        const name = document.getElementById('name').value;
                        const date = document.getElementById('date').value;
                        const phone = document.getElementById('phone').value;
                        const doc = document.getElementById('docSelect').value;

                        if(!name || !date || !phone) {
                            alert("Please fill all fields");
                            return;
                        }

                        // Set values in receipt
                        document.getElementById('rName').innerText = name;
                        document.getElementById('rDate').innerText = date;
                        document.getElementById('rDoc').innerText = doc;
                        document.getElementById('rToken').innerText = "APS-" + Math.floor(1000 + Math.random() * 9000);

                        // Toggle visibility
                        document.getElementById('bookingForm').style.display = 'none';
                        document.getElementById('receiptArea').style.display = 'block';
                    }
                <\/script>
            </body>
            </html>
        `);
    }
    // MEDICAL AI DATABASE
    const medicalAI = {
        flu: { disease: "Viral Influenza (Flu)", meds: "Tab. Panadol 500mg + Arinac Forte", cost: 450, dose: "1 tablet 3 times a day" },
        cough: { disease: "Acute Bronchitis", meds: "Cofsys Syrup + Augmentin 625mg", cost: 1200, dose: "Syrup 2tsp x3, Tab 1x2" },
        sore_throat: { disease: "Pharyngitis / Strep Throat", meds: "Strepsils Lozenges + Tab. Azomax 500mg", cost: 850, dose: "1 tab daily for 3 days" },
        congestion: { disease: "Allergic Rhinitis", meds: "Sinu-P + Softin Tab", cost: 300, dose: "1 tab at night" },
        wheezing: { disease: "Bronchial Asthma Flare-up", meds: "Ventolin Inhaler + Tab. Monas-10", cost: 1500, dose: "2 puffs when needed, 1 tab daily" },
        sneezing: { disease: "Seasonal Allergy", meds: "Tab. Rigix + Nasal Spray", cost: 600, dose: "1 tab daily" },
        stomach: { disease: "Gastroenteritis", meds: "Tab. Flagyl 400mg + ORS", cost: 300, dose: "1 tab twice daily + fluids" },
        diarrhea: { disease: "Food Poisoning", meds: "Tab. Entamizole + Imodium", cost: 400, dose: "1 tab after every loose motion" },
        constipation: { disease: "Chronic Constipation", meds: "Syp. Duphalac", cost: 700, dose: "2 tbsp at bedtime" },
        heartburn: { disease: "GERD / Acid Reflux", meds: "Cap. Risek 400mg + Syp. Gaviscon", cost: 1100, dose: "1 cap before breakfast" },
        bloating: { disease: "Dyspepsia", meds: "Tab. Enzyne + Ganaton", cost: 500, dose: "1 tab before meals" },
        vomiting: { disease: "Nausea / Motion Sickness", meds: "Tab. Gravinate", cost: 150, dose: "1 tab as needed" },
        migraine: { disease: "Migraine / Tension Headache", meds: "Tab. Cafergot + Nuberol Forte", cost: 800, dose: "1 tab at onset of pain" },
        dizziness: { disease: "Vertigo / Inner Ear Issue", meds: "Tab. Serc 16mg", cost: 900, dose: "1 tab twice daily" },
        back_pain: { disease: "Muscular Strain", meds: "Tab. Diclofenac + Muscoril", cost: 650, dose: "1 tab after food" },
        joint_pain: { disease: "Possible Arthritis / Inflammation", meds: "Tab. Naproxen 500mg", cost: 550, dose: "1 tab twice daily" },
        insomnia: { disease: "Sleep Disorder", meds: "Melatonin 3mg (Consult Doctor)", cost: 1200, dose: "1 tab 30 mins before bed" },
        numbness: { disease: "Vitamin B12 Deficiency", meds: "Tab. Methycobal 500mcg", cost: 1000, dose: "1 tab daily for 1 month" },
        skin: { disease: "Contact Dermatitis", meds: "Betnovate-N Cream + Tab. Softin", cost: 550, dose: "Apply cream locally, 1 tab at night" },
        acne: { disease: "Acne Vulgaris", meds: "Adapalene Gel + Facewash", cost: 1300, dose: "Apply gel at night" },
        hair_loss: { disease: "Alopecia / Nutrient Deficiency", meds: "Tab. Perfectil", cost: 2500, dose: "1 tab daily with meal" },
        fatigue: { disease: "General Debility / Anemia", meds: "Surbex-Z + Sangobion", cost: 950, dose: "1 tab daily" },
        anxiety: { disease: "Mild Anxiety / Stress", meds: "Tab. Inderal 10mg (Consult Doctor)", cost: 200, dose: "1 tab when feeling anxious" }
    };

    function runAIDiagnosis() {
        const name = document.getElementById('pName').value;
        const symp = document.getElementById('pSymptom').value;
        if (name === "" || symp === "none") {
            alert("Please provide your name and select a symptom.");
            return;
        }
        const data = medicalAI[symp];
        const consultFee = 2000;
        const total = data.cost + consultFee;
        document.getElementById('ai-result').style.display = 'block';
        document.getElementById('diagnosisDetail').innerHTML = `
            <p><strong>Patient Name:</strong> ${name}</p>
            <p><strong>Identified Condition:</strong> ${data.disease}</p>
            <p><strong>Recommended Medicine:</strong> ${data.meds}</p>
        `;
        document.getElementById('finalPrint').innerHTML = `
            <h4 style="text-align:center">OFFICIAL MEDICAL PRESCRIPTION</h4>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Rx: <strong>${data.meds}</strong></p>
            <p>Dosage: ${data.dose}</p>
            <hr>
            <h4 style="text-align:center">PAYMENT RECEIPT</h4>
            <div style="display:flex; justify-content:space-between"><span>AI Consultation Fee:</span> <span>Rs. ${consultFee.toLocaleString()}</span></div>
            <div style="display:flex; justify-content:space-between"><span>Medicine Estimated Cost:</span> <span>Rs. ${data.cost.toLocaleString()}</span></div>
            <hr>
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem"><span>TOTAL AMOUNT:</span> <span>PKR ${total.toLocaleString()}</span></div>
        `;
    }

    function handleFileUpload() {
        const fileInput = document.getElementById('reportFile');
        const display = document.getElementById('file-name-display');
        const btn = document.getElementById('analyzeBtn');
        if (fileInput.files.length > 0) {
            display.innerHTML = "Selected: " + fileInput.files[0].name;
            btn.style.display = "block";
        }
    }

    function analyzeReport() {
        const fileInput = document.getElementById('reportFile');
        const loader = document.getElementById('analysis-loading');
        const result = document.getElementById('report-result');
        const btn = document.getElementById('analyzeBtn');
        if (!fileInput.files[0]) return;
        const fileName = fileInput.files[0].name.toLowerCase();
        btn.style.display = "none";
        loader.style.display = "block";
        result.style.display = "none";

        setTimeout(() => {
            loader.style.display = "none";
            result.style.display = "block";
            let observation = "";
            let recommendation = "";
            let severityColor = "#ffc107";

            if (fileName.includes("xray") || fileName.includes("bone")) {
                observation = "<strong>Potential Fracture Detected:</strong> Structural discontinuity visible.";
                recommendation = "<strong>EMERGENCY:</strong> Visit Orthopedics immediately.";
                severityColor = "#ea4335";
            } else if (fileName.includes("blood") || fileName.includes("cbc")) {
                observation = "<strong>Hematology Scan:</strong> Markers indicate possible minor infection.";
                recommendation = "<strong>Action Required:</strong> Consult General Physician.";
                severityColor = "#1a73e8";
            } else {
                observation = "<strong>General Observation:</strong> No immediate life-threatening emergency visible.";
                recommendation = "<strong>Recommendation:</strong> Present report to a specialist.";
            }

            document.getElementById('reportContent').innerHTML = `
                <p><strong>Status:</strong> Verified</p>
                <p>${observation}</p>
                <div style="background: #fff; padding: 15px; border-left: 8px solid ${severityColor}; margin-top:15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">${recommendation}</div>
                <hr style="margin-top:20px;"><small>DISCLAIMER: AI-simulated analysis only.</small>
            `;
        }, 2500);
    }
    function updateFileName() {
        const file = document.getElementById('prescriptionFile').files[0];
        if (file) {
            document.getElementById('file-status').innerText = "Selected: " + file.name;
            document.getElementById('file-status').style.color = "var(--primary)";
        }
    }

    function placeOrder() {
    // 1. Get Input Values
    const name = document.getElementById('dName').value;
    const phone = document.getElementById('dPhone').value;
    const address = document.getElementById('dAddress').value;
    const fileInput = document.getElementById('prescriptionFile');
    const fileName = fileInput.files[0] ? fileInput.files[0].name : "Attached Digital Record";

    // 2. Validation
    if (!name || !phone || !address) {
        alert("Please fill in all delivery details.");
        return;
    }

    // 3. Generate Order ID
    const orderID = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    
    // --- NEW: SMS NOTIFICATION LOGIC ---
    // Defined below to prevent "ReferenceError"
    sendOrderSMS(orderID, name, phone, address);

    const adminNumber = "923255103443"; 

    // 4. Create Notification Message
    const message = encodeURIComponent(`*APS HOSPITAL - NEW ORDER*\n` +
                    `----------------------------\n` +
                    `*Order ID:* ${orderID}\n` +
                    `*Customer:* ${name}\n` +
                    `*Phone:* ${phone}\n` +
                    `*Address:* ${address}\n` +
                    `*Prescription:* ${fileName}`);

    // 5. Trigger Notification
    window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');

    // 6. Update UI
    const resultDiv = document.getElementById('delivery-result');
    resultDiv.style.display = 'block';
    
    document.getElementById('deliveryReceipt').innerHTML = `
        <div style="text-align:center;">
            <h3 style="margin:0; color:#34a853;">APS PHARMACY DELIVERY</h3>
            <p>Order Confirmed & SMS Sent to Admin</p>
            <p style="font-size:0.9rem; color:#666;">Order details sent to Admin: 0325 5103 443</p>
        </div>
        <hr>
        <div style="line-height: 1.6;">
            <p><strong>Order ID:</strong> ${orderID}</p>
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Prescription:</strong> ${fileName}</p>
        </div>
        
        <h4 style="text-align:center; margin-top:20px; border-top: 1px solid #eee; padding-top:20px;">SELECT PAYMENT METHOD</h4>
        <div style="margin-top:10px;">
            <button class="btn-submit" onclick="openEasypaisa()">Pay with Easypaisa</button>
            <button class="btn-submit" style="margin-top:10px; background:#e11d48;" onclick="openJazzCash()">Pay with JazzCash</button>
        </div>

        <p id="paymentStatus" style="text-align:center; font-weight:bold; margin-top:15px;"></p>
        <hr>
        <div style="display:flex; justify-content:space-between">
            <span>Delivery Status:</span> 
            <span style="color:#1a73e8; font-weight:bold;">AWAITING PAYMENT</span>
        </div>
        <div style="display:flex; justify-content:space-between">
            <span>Est. Arrival:</span> 
            <strong>Within 2 Hours</strong>
        </div>
    `;

    // Smooth scroll to the receipt
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// 7. Helper Function (Prevents Errors)
function sendOrderSMS(id, name, ph, addr) {
    console.log(`SMS Logic Triggered for ${id}`);
    // You would typically use an API like Twilio here. 
    // For a static site, the WhatsApp redirect (Step 5) is your primary notification.
}
// Function to trigger the notification
function sendOrderSMS(orderID, customer, phone, address) {
    const adminNumber = "923255103443"; // Your number in international format
    const message = `New Order: ${orderID}\nCustomer: ${customer}\nPhone: ${phone}\nAddress: ${address}`;
    
    console.log("Notifying Admin at " + adminNumber + ": " + message);
    
    // Note: For real automated SMS, you would fetch a Twilio or CallMeBot API here:
    // fetch(`https://api.example.com/send?to=${adminNumber}&msg=${encodeURIComponent(message)}`);
}
</div>

<p id="paymentStatus" style="text-align:center; font-weight:bold; margin-top:15px;"></p>

            <hr>
            <div style="display:flex; justify-content:space-between">
                <span>Delivery Status:</span> 
                <span style="color:#34a853; font-weight:bold;">OUT FOR DELIVERY</span>
            </div>
            <div style="display:flex; justify-content:space-between">
                <span>Est. Arrival:</span> 
                <strong>Within 2 Hours</strong>
            </div>
            <hr>
            <p style="font-size:0.8rem; text-align:center; color:#666;">
                Please keep PKR 200 ready for delivery charges + medicine bill.<br>
                Thank you for choosing APS Boys Hospital.
            </p>
        `;
        
        // Scroll to the receipt
        document.getElementById('delivery-result').scrollIntoView({ behavior: 'smooth' });
    }
    function payEasyPaisa() {
    processPayment("EasyPaisa");
}

function payJazzCash() {
    processPayment("JazzCash");
}

function processPayment(method) {
    const status = document.getElementById("paymentStatus");
    status.style.color = "#1a73e8";
    status.innerText = "Connecting to " + method + "...";

    setTimeout(() => {
        const txnId = method + "-" + Math.floor(100000 + Math.random() * 900000);
        status.style.color = "#34a853";
        status.innerHTML = `
            ✅ Payment Successful<br>
            Method: ${method}<br>
            Transaction ID: ${txnId}
        `;

        // OPTIONAL: unlock delivery page
        alert("Payment confirmed. You can now place delivery order.");
    }, 2000);
}
function openEasypaisa() {
    epAttempts = 0;
    document.getElementById("easypaisaModal").style.display = "flex";
    document.getElementById("ep-step-1").style.display = "block";
    document.getElementById("ep-loading").style.display = "none";
    document.getElementById("ep-success").style.display = "none";
    document.getElementById("epError").style.display = "none";
    document.getElementById("epPin").disabled = false;
}


function closeEasypaisa() {
    document.getElementById("easypaisaModal").style.display = "none";
}

function processEasypaisa() {
    const number = document.getElementById("epNumber").value;
    const pin = document.getElementById("epPin").value;
    const error = document.getElementById("epError");

    error.style.display = "none";

    if (!number || pin.length < 4) {
        epAttempts++;

        if (epAttempts >= 3) {
            error.innerText = "❌ Too many attempts. Payment locked.";
            error.style.display = "block";
            document.getElementById("epPin").disabled = true;
            return;
        }

        error.innerText = `❌ Invalid PIN. Attempts left: ${3 - epAttempts}`;
        error.style.display = "block";
        return;
    }

    // SUCCESS → reset attempts
    epAttempts = 0;

    document.getElementById("ep-step-1").style.display = "none";
    document.getElementById("ep-loading").style.display = "block";

    setTimeout(() => {
        document.getElementById("ep-loading").style.display = "none";
        document.getElementById("ep-success").style.display = "block";
        document.getElementById("epTxn").innerText =
            "Transaction ID: EP-" + Math.floor(100000 + Math.random() * 900000);
    }, 2000);
}

function openJazzCash() {
    jcAttempts = 0;
    document.getElementById("jazzcashModal").style.display = "flex";
    document.getElementById("jc-step-1").style.display = "block";
    document.getElementById("jc-loading").style.display = "none";
    document.getElementById("jc-success").style.display = "none";
    document.getElementById("jcError").style.display = "none";
    document.getElementById("jcPin").disabled = false;
}


function closeJazzCash() {
    document.getElementById("jazzcashModal").style.display = "none";
}

function processJazzCash() {
    const number = document.getElementById("jcNumber").value;
    const pin = document.getElementById("jcPin").value;
    const error = document.getElementById("jcError");

    error.style.display = "none";

    if (!number || pin.length < 4) {
        jcAttempts++;

        if (jcAttempts >= 3) {
            error.innerText = "❌ Too many attempts. Payment locked.";
            error.style.display = "block";
            document.getElementById("jcPin").disabled = true;
            return;
        }

        error.innerText = `❌ Invalid MPIN. Attempts left: ${3 - jcAttempts}`;
        error.style.display = "block";
        return;
    }

    // SUCCESS → reset attempts
    jcAttempts = 0;

    document.getElementById("jc-step-1").style.display = "none";
    document.getElementById("jc-loading").style.display = "block";

    setTimeout(() => {
        document.getElementById("jc-loading").style.display = "none";
        document.getElementById("jc-success").style.display = "block";
        document.getElementById("jcTxn").innerText =
            "Transaction ID: JC-" + Math.floor(100000 + Math.random() * 900000);
    }, 2000);
}
