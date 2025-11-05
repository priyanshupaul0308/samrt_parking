const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const fetch = require("node-fetch");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB connection
const MONGO_URI = "mongodb://127.0.0.1:27017/parkingDB";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Schema & Model
const parkingSchema = new mongoose.Schema({
  slot: Number,
  vehicleType: String,
  vehicleNumber: String,
  arrivalDate: String,
  arrivalTime: String,
  expectedPickupDate: String,
  expectedPickupTime: String,
  weekday: String,
  charge: Number,
  isReserved: Boolean,
  reservationData: Object,
});

const ParkingSlot = mongoose.model("ParkingSlot", parkingSchema);

// Initialize slots if empty
async function initSlots() {
  const count = await ParkingSlot.countDocuments();
  if (count === 0) {
    const slots = Array.from({ length: 20 }, (_, i) => ({
      slot: i + 1,
      vehicleType: null,
      vehicleNumber: null,
      arrivalDate: null,
      arrivalTime: null,
      expectedPickupDate: null,
      expectedPickupTime: null,
      weekday: null,
      charge: 0,
      isReserved: false,
      reservationData: null,
    }));
    await ParkingSlot.insertMany(slots);
    console.log("🚗 Initialized 20 parking slots in MongoDB");
  }
}
initSlots();

// ---------- ROUTES ----------

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Get all slots
app.get("/api/parking", async (req, res) => {
  const slots = await ParkingSlot.find().sort("slot");
  res.json(slots);
});

// Park a vehicle
app.post("/api/park", async (req, res) => {
  const {
    slot,
    vehicleType,
    vehicleNumber,
    arrivalDate,
    arrivalTime,
    expectedPickupDate,
    expectedPickupTime,
  } = req.body;

  const parkingSlot = await ParkingSlot.findOne({ slot });
  if (!parkingSlot || parkingSlot.vehicleType) {
    return res.status(400).json({ error: "Invalid or already occupied slot" });
  }

  parkingSlot.vehicleType = vehicleType;
  parkingSlot.vehicleNumber = vehicleNumber;
  parkingSlot.arrivalDate = arrivalDate;
  parkingSlot.arrivalTime = arrivalTime;
  parkingSlot.expectedPickupDate = expectedPickupDate;
  parkingSlot.expectedPickupTime = expectedPickupTime;
  parkingSlot.weekday = new Date(arrivalDate).toLocaleDateString("en-US", {
    weekday: "short",
  });
  parkingSlot.isReserved = false;
  parkingSlot.reservationData = null;

  await parkingSlot.save();
  res.json({ message: `Vehicle parked at slot ${slot}`, data: parkingSlot });
});

// Remove a vehicle
app.post("/api/remove", async (req, res) => {
  const { slot } = req.body;
  const parkingSlot = await ParkingSlot.findOne({ slot });

  if (!parkingSlot || !parkingSlot.vehicleType) {
    return res.status(400).json({ error: "Slot empty or invalid" });
  }

  const removedVehicle = { ...parkingSlot._doc };

  // Reset slot
  parkingSlot.vehicleType = null;
  parkingSlot.vehicleNumber = null;
  parkingSlot.arrivalDate = null;
  parkingSlot.arrivalTime = null;
  parkingSlot.expectedPickupDate = null;
  parkingSlot.expectedPickupTime = null;
  parkingSlot.weekday = null;
  parkingSlot.charge = 0;
  parkingSlot.isReserved = false;
  parkingSlot.reservationData = null;

  await parkingSlot.save();
  res.json({ message: `Vehicle removed from slot ${slot}`, removedVehicle });
});

// ---------- PYTHON DETECTION BRIDGE ----------

// Start detection (forward to Python)
app.post("/start_detection", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/start_detection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: "Python server not running" });
  }
});

// Get detection results
// Get detection results & store in MongoDB
app.get("/get_results", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/get_results");
    const data = await response.json();

    if (data && data.vehicleNumber) {
      // Find first empty slot
      const freeSlot = await ParkingSlot.findOne({ vehicleType: null }).sort("slot");

      if (freeSlot) {
        freeSlot.vehicleType = data.vehicleType || "Unknown";
        freeSlot.vehicleNumber = data.vehicleNumber;
        freeSlot.arrivalDate = new Date().toISOString().split("T")[0];
        freeSlot.arrivalTime = new Date().toLocaleTimeString();
        freeSlot.weekday = new Date().toLocaleDateString("en-US", { weekday: "short" });
        freeSlot.isReserved = false;
        freeSlot.reservationData = null;

        await freeSlot.save();
        console.log(`✅ Vehicle ${data.vehicleNumber} parked at slot ${freeSlot.slot}`);
      } else {
        console.log("❌ No free slots available");
      }
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: "Python server not running" });
  }
});


// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Express Server running at http://localhost:${PORT}`);
  console.log("⚡ Make sure to run: python server.py (YOLO backend)");
});
