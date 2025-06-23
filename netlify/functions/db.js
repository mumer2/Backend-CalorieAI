// netlify/functions/db.js
const mongoose = require("mongoose");

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "calorieAI", // optional, if not included in MONGO_URI
    });

    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

module.exports = { connectToDatabase };
