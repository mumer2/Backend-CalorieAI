// netlify/functions/db.js
const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'calorieAI', // or remove dbName if it's included in MONGO_URI
  });

  isConnected = conn.connections[0].readyState;
  console.log('✅ MongoDB connected');
}

module.exports = {
  connectToDatabase,
};
