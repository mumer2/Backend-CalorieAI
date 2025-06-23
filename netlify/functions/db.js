// netlify/functions/db.js
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const conn = await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('✅ MongoDB connected');
}

module.exports = { connectDB };
