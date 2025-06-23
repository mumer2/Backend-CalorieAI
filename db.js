// db.js
const mongoose = require('mongoose');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
};

module.exports = { connectToDatabase };
