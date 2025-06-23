// netlify/functions/db.js
const mongoose = require('mongoose');

let isConnected;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'your_db_name', // replace with your actual DB name
    });

    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}

module.exports = { connectToDatabase };
