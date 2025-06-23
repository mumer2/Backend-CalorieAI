// netlify/functions/db.js
const mongoose = require('mongoose');
let isConnected;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('📡 MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;
