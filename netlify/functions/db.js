// netlify/functions/db.js
const mongoose = require('mongoose');

let isConnected;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'calorieAI', // replace if needed
  });

  isConnected = conn.connections[0].readyState;
  console.log('✅ MongoDB connected:', isConnected);
}

module.exports = { connectToDatabase };
