// ✅ netlify/functions/db.js
const mongoose = require('mongoose');

let isConnected;

async function connectToDatabase() {
  if (isConnected) {
    console.log('✅ Using existing database connection');
    return;
  }

  console.log('📡 Connecting to DB...');
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'calorieAI',
  });

  isConnected = true;
  console.log('✅ Connected to MongoDB');
}

module.exports = { connectToDatabase };
