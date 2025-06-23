// netlify/functions/getRequests.js
const { connectToDatabase } = require("./db");
const Request = require('./models/Request'); // ✅ relative to the function file

exports.handler = async () => {
  try {
    await connectToDatabase();
    const requests = await Request.find().sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(requests),
    };
  } catch (err) {
    console.error("❌ Get Requests Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch requests" }),
    };
  }
};
