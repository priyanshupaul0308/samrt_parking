# Smart Parking System with AI Detection

A comprehensive smart parking management system that integrates computer vision AI for automatic vehicle detection, license plate recognition, and hand gesture-based parking duration input.

## Features

### 🚗 Core Parking Management
- Real-time parking slot visualization (20 slots)
- Manual vehicle parking and removal
- Slot reservation system
- Dynamic pricing based on vehicle type and time
- Bill generation with detailed breakdown
- Holiday calendar with rush hour pricing

### 🤖 AI-Powered Auto Mode
- **Vehicle Type Detection**: Automatically identifies cars, bikes, and trucks using YOLO
- **License Plate Recognition**: OCR-based Indian license plate detection and text extraction
- **Hand Gesture Recognition**: Uses MediaPipe to detect parking duration (1-10 hours)
- **Seamless Integration**: Auto-detected data flows directly into the parking system

### 🎨 Modern Interface
- Dark/Light theme toggle
- Glass morphism design
- Responsive layout
- Real-time statistics
- Animated notifications
- Keyboard shortcuts

## Technology Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Backend (AI Detection)
- **Python 3.8+** - Core language
- **Flask** - Web server framework
- **OpenCV** - Computer vision processing
- **YOLO (Ultralytics)** - Vehicle detection
- **MediaPipe** - Hand gesture recognition
- **OCR.space API** - License plate text recognition

## Installation & Setup

### 1. Prerequisites
- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam/Camera access
- Internet connection (for OCR API)

### 2. Install Python Dependencies
```bash
cd "C:\Users\UseR\Documents\Coding\Smart Parking"
pip install -r requirements.txt
```

### 3. Download YOLO Models
- Download `yolo11n.pt` from [Ultralytics](https://github.com/ultralytics/ultralytics)
- Place your license plate detection model as `best.pt`
- Both files should be in the Smart Parking directory

### 4. Update File Paths
Edit `server.py` and update these paths if different:
```python
model_path = r"C:\Users\UseR\Documents\Coding\Smart Parking\best.pt"
save_path = r"C:\Users\UseR\Documents\Coding\Smart Parking\detected_plate.jpg"
```

## Usage

### 1. Start the AI Detection Server
```bash
python server.py
```
Server will run on `http://localhost:8000`

### 2. Open the Web Interface
Open `index.html` in your web browser

### 3. Using Auto Mode

#### Step 1: Click "Auto Mode" Button
- Click the blue "Auto Mode" button in the controls panel
- The detection modal will open

#### Step 2: Start Detection
- Click "Start Auto Detection"
- Follow the 3-phase detection process:

**Phase 1: Vehicle Detection**
- Point camera at the vehicle
- Wait for 5-second confirmation
- Supported: Cars, Bikes, Trucks/Buses

**Phase 2: License Plate Detection**
- Point camera at the license plate
- System captures and processes with OCR
- Supports Indian license plate formats

**Phase 3: Hand Gesture Recognition**
- Show 1-10 fingers for parking hours
- Hold steady for 3 seconds
- Confirm with OK gesture (thumb + index circle)

#### Step 4: Automatic Parking
- System finds available slot automatically
- Calculates pricing based on vehicle type and duration
- Parks vehicle and updates display

### 4. Manual Mode Features

#### Parking a Vehicle
- Fill in vehicle details in the form
- System assigns first available slot
- Automatic pricing calculation

#### Reserving a Slot
- Click "Reserve Slot"
- Enter customer and vehicle details
- Set expected arrival time

#### Removing a Vehicle
- Click "Remove Vehicle"
- Select from occupied slots
- Generate and print bill

#### Additional Features
- **Search Vehicle**: Find vehicles by license number
- **Generate Report**: View parking statistics and revenue
- **Export/Import Data**: Backup and restore parking data
- **Holiday Calendar**: View rush hour schedules

## Pricing Structure

### Base Rates (per hour)
- **Bikes**: ₹200 (normal) / ₹250 (rush) / ₹100 (night)
- **Cars**: ₹150 (normal) / ₹180 (rush) / ₹100 (night)
- **Trucks**: ₹300 (normal) / ₹370 (rush) / ₹100 (night)

### Rush Hours
- **Fridays**: 5:00 PM - 12:00 AM
- **Weekends**: 11:00 AM - 12:00 AM
- **Holidays**: As per calendar

### Night Hours
- **Time**: 11:00 PM - 5:00 AM
- **Rate**: ₹100/hour for all vehicles

## Keyboard Shortcuts

- **Ctrl + T**: Toggle theme (Dark/Light)
- **Ctrl + F**: Open vehicle search
- **Ctrl + P**: Focus on vehicle number input
- **ESC**: Close any open modal

## API Endpoints

The Python server provides these REST API endpoints:

### POST /start_detection
Starts the 3-phase AI detection process
```json
{
  "status": "started",
  "message": "Detection process started"
}
```

### GET /get_results
Returns current detection status and results
```json
{
  "status": "completed",
  "current_phase": "Detection completed",
  "results": {
    "vehicle_type": "4 Wheeler (Car)",
    "license_plate": "MH 01 AB 1234",
    "parking_hours": 3
  }
}
```

### POST /reset
Resets the detection system
```json
{
  "status": "reset",
  "message": "Detection system reset"
}
```

## File Structure

```
Smart Parking/
├── index.html          # Main web interface
├── script.js           # Frontend JavaScript logic
├── styles.css          # CSS styling and themes
├── server.py           # Python AI detection server
├── requirements.txt    # Python dependencies
├── README.md          # This documentation
├── yolo11n.pt         # YOLO vehicle detection model
├── best.pt            # License plate detection model
└── detected_plate.jpg # Temporary plate image (auto-generated)
```

## Troubleshooting

### Common Issues

1. **Python Server Won't Start**
   - Check Python version (3.8+)
   - Install dependencies: `pip install -r requirements.txt`
   - Verify camera access permissions

2. **Auto Detection Fails**
   - Ensure webcam is working
   - Check model files are present
   - Verify OCR API connectivity
   - Good lighting for better detection

3. **CORS Errors**
   - Make sure Flask-CORS is installed
   - Check server is running on localhost:8000

4. **Model Not Found Errors**
   - Download `yolo11n.pt` from Ultralytics
   - Update file paths in `server.py`
   - Ensure models are in correct directory

### Performance Tips

- **Good Lighting**: Ensure adequate lighting for camera detection
- **Stable Camera**: Hold camera steady during detection phases
- **Clear License Plates**: Clean, unobstructed view of license plates
- **Hand Gestures**: Use clear finger positions for gesture recognition

## Contributing

This is a modular system designed for easy extension:

1. **Add New Vehicle Types**: Update `vehicle_classes_mapping` in `server.py`
2. **Custom Pricing**: Modify `calculateCharge()` function in `script.js`
3. **New Detection Phases**: Extend the detection workflow in `server.py`
4. **UI Enhancements**: Add new modals and styling in HTML/CSS/JS

## License

This project is for educational and demonstration purposes. Please ensure you have proper licenses for:
- YOLO models (Ultralytics license)
- OCR.space API (check usage terms)
- Any custom-trained models

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure proper file paths and permissions
4. Test camera and internet connectivity

---

**Happy Parking! 🚗🅿️**