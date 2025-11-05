// Enhanced Vehicle Vacancy Vault - Smart Parking System JavaScript

// Vehicle data structure
let parkingData = [];
let holidayData = [];
let currentSelectedReservedSlot = null;

// Auto Mode variables
let autoModeActive = false;
let detectionInProgress = false;

// Theme management
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light');
        showNotification('☀️ Switched to Light Mode', 'success');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark');
        showNotification('🌙 Switched to Dark Mode', 'success');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
    }
}

// Initialize parking data
function initializeParkingData() {
    for (let i = 1; i <= 20; i++) {
        parkingData.push({
            slot: i,
            vehicleType: null,
            vehicleNumber: null,
            arrivalDate: null,
            arrivalTime: null,
            expectedPickupDate: null,
            expectedPickupTime: null,
            weekday: null,
            charge: 0,
            isReserved: false,
            reservationData: null
        });
    }

    // Sample initial data
    const initialData = [
        {slot: 2, vehicleType: "Bike", vehicleNumber: "WB02B5678", arrivalDate: "01-02-25", arrivalTime: "09:30", expectedPickupDate: "01-02-25", expectedPickupTime: "12:00", weekday: "Mon", charge: 450.0},
        {slot: 4, vehicleType: "Car", vehicleNumber: "WB01A1234", arrivalDate: "01-02-25", arrivalTime: "10:00", expectedPickupDate: "01-02-25", expectedPickupTime: "14:00", weekday: "Mon", charge: 800.0},
        {slot: 6, vehicleType: "Truck", vehicleNumber: "WB03C9101", arrivalDate: "01-02-25", arrivalTime: "08:00", expectedPickupDate: "01-02-25", expectedPickupTime: "16:00", weekday: "Mon", charge: 2400.0}
    ];

    initialData.forEach(data => {
        parkingData[data.slot - 1] = { ...parkingData[data.slot - 1], ...data };
    });

    // Holiday data
     holidayData = [
                {date: "01-01-2025", name: "New Year's Day", rushFrom: "00:00", rushTo: "23:59"},
                {date: "26-01-2025", name: "Republic Day", rushFrom: "08:00", rushTo: "14:00"},
                {date: "02-02-2025", name: "Vasant Panchami", rushFrom: "09:00", rushTo: "17:00"},
                {date: "26-02-2025", name: "Maha Shivaratri", rushFrom: "09:00", rushTo: "17:00"},
                {date: "13-03-2025", name: "Holika Dahana", rushFrom: "09:00", rushTo: "22:00"},
                {date: "14-03-2025", name: "Holi", rushFrom: "09:00", rushTo: "20:00"},
                {date: "28-03-2025", name: "Jamat Ul-Vida", rushFrom: "09:00", rushTo: "17:00"},
                {date: "30-03-2025", name: "Chaitra Sukhladi / Ugadi / Gudi Padwa", rushFrom: "09:00", rushTo: "17:00"},
                {date: "31-03-2025", name: "Eid-ul-Fitr", rushFrom: "08:00", rushTo: "21:00"},
                {date: "06-04-2025", name: "Rama Navami", rushFrom: "09:00", rushTo: "17:00"},
                {date: "10-04-2025", name: "Mahavir Jayanti", rushFrom: "09:00", rushTo: "17:00"},
                {date: "18-04-2025", name: "Good Friday", rushFrom: "08:00", rushTo: "16:00"},
                {date: "12-05-2025", name: "Buddha Purnima", rushFrom: "09:00", rushTo: "18:00"},
                {date: "07-06-2025", name: "Eid ul-Adha (Bakrid)", rushFrom: "08:00", rushTo: "21:00"},
                {date: "06-07-2025", name: "Muharram", rushFrom: "07:00", rushTo: "19:00"},
                {date: "09-08-2025", name: "Raksha Bandhan", rushFrom: "10:00", rushTo: "18:00"},
                {date: "15-08-2025", name: "Independence Day", rushFrom: "08:00", rushTo: "14:00"},
                {date: "16-08-2025", name: "Janmashtami", rushFrom: "08:00", rushTo: "23:00"},
                {date: "27-08-2025", name: "Ganesh Chaturthi", rushFrom: "08:00", rushTo: "21:00"},
                {date: "05-09-2025", name: "Milad-un-Nabi / Onam", rushFrom: "09:00", rushTo: "17:00"},
                {date: "29-09-2025", name: "Maha Saptami", rushFrom: "06:00", rushTo: "23:59"},
                {date: "30-09-2025", name: "Maha Ashtami", rushFrom: "06:00", rushTo: "23:59"},
                {date: "01-10-2025", name: "Maha Navami", rushFrom: "06:00", rushTo: "23:59"},
                {date: "02-10-2025", name: "Mahatma Gandhi Jayanti / Dussehra", rushFrom: "08:00", rushTo: "17:00"},
                {date: "07-10-2025", name: "Maharishi Valmiki Jayanti", rushFrom: "09:00", rushTo: "17:00"},
                {date: "20-10-2025", name: "Diwali", rushFrom: "10:00", rushTo: "23:59"},
                {date: "22-10-2025", name: "Govardhan Puja", rushFrom: "09:00", rushTo: "18:00"},
                {date: "23-10-2025", name: "Bhai Duj", rushFrom: "10:00", rushTo: "18:00"},
                {date: "05-11-2025", name: "Guru Nanak Jayanti", rushFrom: "09:00", rushTo: "19:00"},
                {date: "24-11-2025", name: "Guru Tegh Bahadur's Martyrdom Day", rushFrom: "09:00", rushTo: "17:00"},
                {date: "25-12-2025", name: "Christmas Day", rushFrom: "09:00", rushTo: "22:00"},
                {date: "31-12-2025", name: "New Year's Eve", rushFrom: "00:00", rushTo: "23:59"}
            ];
}

// Auto Mode Functions
function showAutoModeModal() {
    document.getElementById('autoModeModal').classList.add('show');
    updateAutoModeStatus();
}

function updateAutoModeStatus() {
    const statusDiv = document.getElementById('detectionStatus');
    if (detectionInProgress) {
        statusDiv.innerHTML = `
            <div style="color: #f59e0b; font-weight: bold;">
                <i class="fas fa-spinner fa-spin"></i> Detection in progress...
            </div>
        `;
    } else {
        statusDiv.innerHTML = `
            <div style="color: #10b981;">
                <i class="fas fa-check-circle"></i> Ready for detection
            </div>
        `;
    }
}

async function startAutoDetection() {
    if (detectionInProgress) {
        showNotification('Detection already in progress!', 'warning');
        return;
    }

    detectionInProgress = true;
    updateAutoModeStatus();
    
    showNotification('🤖 Starting Auto Detection...', 'success');
    
    const statusDiv = document.getElementById('detectionStatus');
    statusDiv.innerHTML = `
        <div style="color: #f59e0b; font-weight: bold; text-align: center;">
            <i class="fas fa-spinner fa-spin"></i> 
            <br>Running Python Detection Script...
            <br><small>Please follow the camera instructions</small>
        </div>
    `;

    try {
        // 🔴 Call Node backend (not Python directly)
        const response = await fetch('http://localhost:5000/start_detection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Failed to start detection');
        }

        const result = await response.json();
        
        if (result.status === 'started') {
            showNotification('Detection started! Follow camera instructions', 'success');
            pollDetectionResults();
        } else {
            throw new Error(result.message || 'Failed to start detection');
        }

    } catch (error) {
        console.error('Error starting detection:', error);
        showNotification('Failed to start detection. Make sure Node & Python servers are running.', 'error');
        detectionInProgress = false;
        updateAutoModeStatus();
    }
}

async function pollDetectionResults() {
    const pollInterval = setInterval(async () => {
        try {
            // 🔴 Poll Node backend (not Python directly)
            const response = await fetch('http://localhost:5000/get_results');
            const data = await response.json();
            
            if (data.status === 'completed' && data.results) {
                clearInterval(pollInterval);
                detectionInProgress = false;
                displayDetectionResults(data.results);
                updateAutoModeStatus();
            } else if (data.status === 'running') {
                const statusDiv = document.getElementById('detectionStatus');
                statusDiv.innerHTML = `
                    <div style="color: #f59e0b; font-weight: bold; text-align: center;">
                        <i class="fas fa-spinner fa-spin"></i> 
                        <br>Phase: ${data.current_phase || 'Initializing...'}
                        <br><small>Follow the camera instructions</small>
                    </div>
                `;
            } else if (data.status === 'error') {
                clearInterval(pollInterval);
                detectionInProgress = false;
                showNotification('Detection failed: ' + data.message, 'error');
                updateAutoModeStatus();
            }
        } catch (error) {
            console.error('Error polling results:', error);
            clearInterval(pollInterval);
            detectionInProgress = false;
            updateAutoModeStatus();
        }
    }, 2000);
}

async function saveToDatabase(slot, vehicleType, vehicleNumber, arrivalDate, arrivalTime, expectedPickupDate, expectedPickupTime) {
    try {
        const response = await fetch('http://localhost:5000/api/park', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slot,
                vehicleType,
                vehicleNumber,
                arrivalDate,
                arrivalTime,
                expectedPickupDate,
                expectedPickupTime
            })
        });
        const result = await response.json();
        console.log("✅ Saved to DB:", result);
    } catch (err) {
        console.error("❌ Error saving to DB:", err);
    }
}


function displayDetectionResults(results) {
    const resultsDiv = document.getElementById('detectionResults');
    
    if (results.vehicle_type || results.license_plate || results.parking_hours) {
        resultsDiv.innerHTML = `
            <div style="background: var(--bg-glass); border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
                <h4 style="color: var(--accent-primary); margin-bottom: 1rem;">Detection Results:</h4>
                <div style="text-align: left;">
                    <p><strong>Vehicle Type:</strong> ${results.vehicle_type || 'Not detected'}</p>
                    <p><strong>License Plate:</strong> ${results.license_plate || 'Not detected'}</p>
                    <p><strong>Parking Hours:</strong> ${results.parking_hours || 'Not detected'}</p>
                </div>
                ${results.vehicle_type && results.license_plate && results.parking_hours ? 
                    `<button class="btn btn-primary" onclick="processAutoDetection('${results.vehicle_type}', '${results.license_plate}', ${results.parking_hours})" style="margin-top: 1rem;">
                        <i class="fas fa-check"></i> Park Vehicle
                    </button>` : ''
                }
            </div>
        `;
        
        if (results.vehicle_type && results.license_plate && results.parking_hours) {
            showNotification('🎉 Auto detection completed successfully!', 'success');
        } else {
            showNotification('⚠️ Partial detection completed', 'warning');
        }
    } else {
        resultsDiv.innerHTML = `
            <div style="background: var(--bg-glass); border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
                <p style="color: var(--accent-red);">No detection results available</p>
            </div>
        `;
        showNotification('❌ Detection failed', 'error');
    }
}

async function checkDetectionStatus() {
    try {
        const response = await fetch('http://localhost:8000/get_results');
        const data = await response.json();
        
        if (data.status === 'completed' && data.results) {
            displayDetectionResults(data.results);
        } else {
            showNotification(`Detection status: ${data.status}`, 'info');
        }
    } catch (error) {
        showNotification('Cannot connect to detection server', 'error');
    }
}

function processAutoDetection(vehicleType, licenseNumber, hours) {
    const availableSlot = parkingData.find(slot => !slot.vehicleType && !slot.isReserved);
    
    if (!availableSlot) {
        showNotification('No available slots for auto parking!', 'error');
        return;
    }

    const vehicleTypeMap = {
        'Two Wheeler (Bike)': 'Bike',
        '4 Wheeler (Car)': 'Car', 
        'Heavy Vehicle (Bus/Truck)': 'Truck'
    };
    
    const mappedVehicleType = vehicleTypeMap[vehicleType] || vehicleType;
    
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const pickupTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));
    const pickupDate = pickupTime.toISOString().split("T")[0];
    const pickupTimeStr = pickupTime.toTimeString().slice(0, 5);
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdays[now.getDay()];
    
    const charge = calculateCharge(mappedVehicleType, hours, now);
    
    const slotIndex = availableSlot.slot - 1;
    parkingData[slotIndex] = {
        ...parkingData[slotIndex],
        vehicleType: mappedVehicleType,
        vehicleNumber: licenseNumber,
        arrivalDate: currentDate,
        arrivalTime: currentTime,
        expectedPickupDate: pickupDate,
        expectedPickupTime: pickupTimeStr,
        weekday: weekday,
        charge: charge
    };
    
    generateParkingGrid();
    updateStats();
    closeModal('autoModeModal');
    
    showNotification(`🎉 Vehicle auto-parked in slot ${availableSlot.slot}!`, 'success');

    // 🔴 Save to MongoDB
    saveToDatabase(availableSlot.slot, mappedVehicleType, licenseNumber, currentDate, currentTime, pickupDate, pickupTimeStr);
}

// Helper function to calculate charge
function calculateCharge(vehicleType, hours, arrivalTime) {
    const rates = {
        'Bike': { normal: 200, rush: 250, night: 100 },
        'Car': { normal: 150, rush: 180, night: 100 },
        'Truck': { normal: 300, rush: 370, night: 100 }
    };
    
    const vehicleRates = rates[vehicleType] || rates['Car'];
    const hour = arrivalTime.getHours();
    const day = arrivalTime.getDay();
    
    // Determine if it's rush hour or night time
    let hourlyRate;
    if (hour >= 23 || hour < 5) {
        hourlyRate = vehicleRates.night;
    } else if ((day === 5 && hour >= 17) || (day === 0 || day === 6) && hour >= 11) {
        hourlyRate = vehicleRates.rush;
    } else {
        hourlyRate = vehicleRates.normal;
    }
    
    return hourlyRate * hours;
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Generate parking grid
function generateParkingGrid() {
    const grid = document.getElementById('parkingGrid');
    grid.innerHTML = '';
    
    parkingData.forEach((slot, index) => {
        const slotElement = document.createElement('div');
        slotElement.className = 'parking-slot';
        slotElement.id = `slot-${slot.slot}`;
        
        if (slot.vehicleType) {
            slotElement.classList.add('occupied');
            const vehicleIcon = slot.vehicleType === 'Car' ? '🚗' : 
                             slot.vehicleType === 'Bike' ? '🏍️' : '🚛';
            slotElement.innerHTML = `
                <div class="slot-number">${slot.slot}</div>
                <div class="slot-info">${vehicleIcon}<br>${slot.vehicleNumber}</div>
            `;
        } else if (slot.isReserved) {
            slotElement.classList.add('reserved');
            slotElement.innerHTML = `
                <div class="slot-number">${slot.slot}</div>
                <div class="slot-info">Reserved<br>${slot.reservationData.time}</div>
            `;
        } else {
            slotElement.classList.add('empty');
            slotElement.innerHTML = `
                <div class="slot-number">${slot.slot}</div>
                <div class="slot-info">Available</div>
            `;
        }
        
        slotElement.addEventListener('click', () => handleSlotClick(slot.slot));
        grid.appendChild(slotElement);
    });
}

// Handle slot click
function handleSlotClick(slotNumber) {
    const slot = parkingData[slotNumber - 1];
    
    if (slot.vehicleType) {
        showVehicleDetails(slot);
    } else if (slot.isReserved) {
        showReservationDetails(slot);
    } else {
        showNotification(`Slot ${slotNumber} is available`, 'info');
    }
}

// Show vehicle details
function showVehicleDetails(slot) {
    const modal = document.getElementById('parkModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2><i class="fas fa-info-circle"></i> Vehicle Details - Slot ${slot.slot}</h2>
            <button class="close-btn" onclick="closeModal('parkModal')">&times;</button>
        </div>
        <div style="padding: 1rem 0;">
            <div class="bill">
                <div class="bill-row">
                    <span>Vehicle Type:</span>
                    <span>${slot.vehicleType}</span>
                </div>
                <div class="bill-row">
                    <span>Vehicle Number:</span>
                    <span>${slot.vehicleNumber}</span>
                </div>
                <div class="bill-row">
                    <span>Arrival Date:</span>
                    <span>${slot.arrivalDate}</span>
                </div>
                <div class="bill-row">
                    <span>Arrival Time:</span>
                    <span>${slot.arrivalTime}</span>
                </div>
                <div class="bill-row">
                    <span>Expected Pickup:</span>
                    <span>${slot.expectedPickupDate} ${slot.expectedPickupTime}</span>
                </div>
                <div class="bill-total">
                    <div class="bill-row">
                        <span>Estimated Charge:</span>
                        <span>₹${slot.charge}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Show reservation details
function showReservationDetails(slot) {
    const modal = document.getElementById('reserveModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2><i class="fas fa-bookmark"></i> Reservation Details - Slot ${slot.slot}</h2>
            <button class="close-btn" onclick="closeModal('reserveModal')">&times;</button>
        </div>
        <div style="padding: 1rem 0;">
            <div class="reserved-slot-info">
                <h4>Reserved Slot Information</h4>
                <p><strong>Vehicle Type:</strong> ${slot.reservationData.vehicleType}</p>
                <p><strong>Vehicle Number:</strong> ${slot.reservationData.vehicleNumber}</p>
                <p><strong>Reservation Date:</strong> ${slot.reservationData.date}</p>
                <p><strong>Reservation Time:</strong> ${slot.reservationData.time}</p>
                <p><strong>Duration:</strong> ${slot.reservationData.duration} hours</p>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Update statistics
function updateStats() {
    const totalSlots = parkingData.length;
    const occupiedSlots = parkingData.filter(slot => slot.vehicleType).length;
    const reservedSlots = parkingData.filter(slot => slot.isReserved).length;
    const availableSlots = totalSlots - occupiedSlots - reservedSlots;
    
    document.getElementById('totalSlots').textContent = totalSlots;
    document.getElementById('occupiedSlots').textContent = occupiedSlots;
    document.getElementById('reservedSlots').textContent = reservedSlots;
    document.getElementById('availableSlots').textContent = availableSlots;
}

// Update clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    document.getElementById('currentClock').innerHTML = `${timeString}<br>${dateString}`;
}

// Show park modal
function showParkModal() {
    // Populate available slots
    const slotSelect = document.getElementById('slotNumber');
    slotSelect.innerHTML = '<option value="">Select Slot</option>';
    
    parkingData.forEach(slot => {
        if (!slot.vehicleType && !slot.isReserved) {
            const option = document.createElement('option');
            option.value = slot.slot;
            option.textContent = `Slot ${slot.slot}`;
            slotSelect.appendChild(option);
        }
    });
    
    // Set current date and time
    const now = new Date();
    document.getElementById('arrivalDate').value = now.toISOString().split('T')[0];
    document.getElementById('arrivalTime').value = now.toTimeString().slice(0, 5);
    
    document.getElementById('parkModal').classList.add('show');
}

// Show reserve modal
function showReserveModal() {
    // Populate available slots
    const slotSelect = document.getElementById('reserveSlotNumber');
    slotSelect.innerHTML = '<option value="">Select Slot</option>';
    
    parkingData.forEach(slot => {
        if (!slot.vehicleType && !slot.isReserved) {
            const option = document.createElement('option');
            option.value = slot.slot;
            option.textContent = `Slot ${slot.slot}`;
            slotSelect.appendChild(option);
        }
    });
    
    // Set current date
    const now = new Date();
    document.getElementById('reserveDate').value = now.toISOString().split('T')[0];
    
    document.getElementById('reserveModal').classList.add('show');
}

// Show remove modal
function showRemoveModal() {
    // Populate occupied slots
    const slotSelect = document.getElementById('removeSlotNumber');
    slotSelect.innerHTML = '<option value="">Select Slot</option>';
    
    parkingData.forEach(slot => {
        if (slot.vehicleType) {
            const option = document.createElement('option');
            option.value = slot.slot;
            option.textContent = `Slot ${slot.slot} - ${slot.vehicleNumber}`;
            slotSelect.appendChild(option);
        }
    });
    
    document.getElementById('removeModal').classList.add('show');
}

// Show holiday calendar
function showHolidayCalendar() {
    const tableBody = document.getElementById('holidayTableBody');
    tableBody.innerHTML = '';
    
    holidayData.forEach(holiday => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${holiday.date}</td>
            <td>${holiday.name}</td>
            <td>${holiday.rushFrom} - ${holiday.rushTo}</td>
        `;
        tableBody.appendChild(row);
    });
    
    document.getElementById('holidayModal').classList.add('show');
}

// Generate report
function generateReport() {
    const occupiedSlots = parkingData.filter(slot => slot.vehicleType);
    const reservedSlots = parkingData.filter(slot => slot.isReserved);
    const totalRevenue = occupiedSlots.reduce((sum, slot) => sum + slot.charge, 0);
    
    const reportContent = `
        <div class="report-section">
            <h3>Current Status</h3>
            <div class="report-grid">
                <div class="report-card">
                    <h4>Total Slots</h4>
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-primary);">${parkingData.length}</div>
                </div>
                <div class="report-card">
                    <h4>Occupied</h4>
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-red);">${occupiedSlots.length}</div>
                </div>
                <div class="report-card">
                    <h4>Available</h4>
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-green);">${parkingData.length - occupiedSlots.length - reservedSlots.length}</div>
                </div>
                <div class="report-card">
                    <h4>Revenue</h4>
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-orange);">₹${totalRevenue}</div>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Vehicle Breakdown</h3>
            <div class="report-grid">
                <div class="report-card">
                    <h4>Cars</h4>
                    <div style="font-size: 1.5rem; font-weight: bold;">${occupiedSlots.filter(s => s.vehicleType === 'Car').length}</div>
                </div>
                <div class="report-card">
                    <h4>Bikes</h4>
                    <div style="font-size: 1.5rem; font-weight: bold;">${occupiedSlots.filter(s => s.vehicleType === 'Bike').length}</div>
                </div>
                <div class="report-card">
                    <h4>Trucks</h4>
                    <div style="font-size: 1.5rem; font-weight: bold;">${occupiedSlots.filter(s => s.vehicleType === 'Truck').length}</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('reportContent').innerHTML = reportContent;
    document.getElementById('reportModal').classList.add('show');
}

// Form event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    loadTheme();
    initializeParkingData();
    generateParkingGrid();
    updateStats();
    updateClock();
    
    // Update clock every second
    setInterval(updateClock, 1000);
    
    // Park form submission
    document.getElementById("parkForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const slot = parseInt(document.getElementById("slotNumber").value);
    const vehicleType = document.getElementById("vehicleType").value;
    const vehicleNumber = document.getElementById("vehicleNumber").value;
    const arrivalDate = document.getElementById("arrivalDate").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const expectedPickupDate = document.getElementById("expectedPickupDate").value;
    const expectedPickupTime = document.getElementById("expectedPickupTime").value;

    try {
        const response = await fetch('http://localhost:5000/api/park', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slot,
                vehicleType,
                vehicleNumber,
                arrivalDate,
                arrivalTime,
                expectedPickupDate,
                expectedPickupTime
            })
        });

        const result = await response.json();
        if (response.ok) {
            showNotification(`✅ Vehicle parked in slot ${slot}`, 'success');
            closeModal('parkModal');
        } else {
            showNotification(`❌ Error: ${result.error}`, 'error');
        }
    } catch (err) {
        console.error("Error saving manual booking:", err);
        showNotification('❌ Failed to save booking', 'error');
    }
});
        // Calculate weekday
        const arrival = new Date(arrivalDate);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekday = weekdays[arrival.getDay()];
        
        // Calculate hours and charge
        const arrivalDateTime = new Date(`${arrivalDate} ${arrivalTime}`);
        const pickupDateTime = new Date(`${expectedPickupDate} ${expectedPickupTime}`);
        const hours = Math.ceil((pickupDateTime - arrivalDateTime) / (1000 * 60 * 60));
        const charge = calculateCharge(vehicleType, hours, arrivalDateTime);
        
        // Update parking data
        const slotIndex = slotNumber - 1;
        parkingData[slotIndex] = {
            ...parkingData[slotIndex],
            vehicleType,
            vehicleNumber,
            arrivalDate: arrivalDate.split('-').reverse().join('-'),
            arrivalTime,
            expectedPickupDate: expectedPickupDate.split('-').reverse().join('-'),
            expectedPickupTime,
            weekday,
            charge
        };
        
        // Update UI
        generateParkingGrid();
        updateStats();
        closeModal('parkModal');
        e.target.reset();
        
        showNotification(`Vehicle parked successfully in slot ${slotNumber}!`, 'success');
    });
    
    // Reserve form submission
    document.getElementById('reserveForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const slotNumber = parseInt(formData.get('reserveSlotNumber'));
        const vehicleType = formData.get('reserveVehicleType');
        const vehicleNumber = formData.get('reserveVehicleNumber').toUpperCase();
        const reserveDate = formData.get('reserveDate');
        const reserveTime = formData.get('reserveTime');
        const duration = parseInt(formData.get('reserveDuration'));
        
        // Update parking data
        const slotIndex = slotNumber - 1;
        parkingData[slotIndex] = {
            ...parkingData[slotIndex],
            isReserved: true,
            reservationData: {
                vehicleType,
                vehicleNumber,
                date: reserveDate.split('-').reverse().join('-'),
                time: reserveTime,
                duration
            }
        };
        
        // Update UI
        generateParkingGrid();
        updateStats();
        closeModal('reserveModal');
        e.target.reset();
        
        showNotification(`Slot ${slotNumber} reserved successfully!`, 'success');
    });
    
    // Remove form submission
    document.getElementById('removeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const slotNumber = parseInt(formData.get('removeSlotNumber'));
        const slot = parkingData[slotNumber - 1];
        
        // Generate bill
        generateBill(slot);
        
        // Clear slot data
        parkingData[slotNumber - 1] = {
            slot: slotNumber,
            vehicleType: null,
            vehicleNumber: null,
            arrivalDate: null,
            arrivalTime: null,
            expectedPickupDate: null,
            expectedPickupTime: null,
            weekday: null,
            charge: 0,
            isReserved: false,
            reservationData: null
        };
        
        // Update UI
        generateParkingGrid();
        updateStats();
        closeModal('removeModal');
        e.target.reset();
        
        showNotification(`Vehicle removed from slot ${slotNumber}!`, 'success');
    });
    
    // Remove slot change handler
    document.getElementById('removeSlotNumber').addEventListener('change', function(e) {
        const slotNumber = parseInt(e.target.value);
        const infoDiv = document.getElementById('removeVehicleInfo');
        
        if (slotNumber) {
            const slot = parkingData[slotNumber - 1];
            infoDiv.innerHTML = `
                <div class="bill">
                    <div class="bill-row">
                        <span>Vehicle:</span>
                        <span>${slot.vehicleType} - ${slot.vehicleNumber}</span>
                    </div>
                    <div class="bill-row">
                        <span>Parked Since:</span>
                        <span>${slot.arrivalDate} ${slot.arrivalTime}</span>
                    </div>
                    <div class="bill-row">
                        <span>Expected Pickup:</span>
                        <span>${slot.expectedPickupDate} ${slot.expectedPickupTime}</span>
                    </div>
                    <div class="bill-total">
                        <div class="bill-row">
                            <span>Estimated Charge:</span>
                            <span>₹${slot.charge}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            infoDiv.innerHTML = '';
        }
    });


// Generate bill
function generateBill(slot) {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-GB').replace(/\//g, '-');
    const currentTime = now.toTimeString().slice(0, 5);
    
    const billContent = `
        <div class="bill">
            <div class="bill-header">
                <h3>PARKING BILL</h3>
                <p>Vehicle Vacancy Vault</p>
                <p>${currentDate} ${currentTime}</p>
            </div>
            
            <div class="bill-row">
                <span>Slot Number:</span>
                <span>${slot.slot}</span>
            </div>
            <div class="bill-row">
                <span>Vehicle Type:</span>
                <span>${slot.vehicleType}</span>
            </div>
            <div class="bill-row">
                <span>Vehicle Number:</span>
                <span>${slot.vehicleNumber}</span>
            </div>
            <div class="bill-row">
                <span>Arrival:</span>
                <span>${slot.arrivalDate} ${slot.arrivalTime}</span>
            </div>
            <div class="bill-row">
                <span>Departure:</span>
                <span>${currentDate} ${currentTime}</span>
            </div>
            
            <div class="bill-total">
                <div class="bill-row">
                    <span>Total Amount:</span>
                    <span>₹${slot.charge}</span>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);">
                Thank you for using our parking service!
            </div>
        </div>
    `;
    
    document.getElementById('billContent').innerHTML = billContent;
    document.getElementById('billModal').classList.add('show');
}

// Print functions
function printBill() {
    window.print();
}

function printReport() {
    window.print();
}
