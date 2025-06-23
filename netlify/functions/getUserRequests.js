// netlify/functions/getUserRequests.js

const { connectToDatabase } = require("./db");
const Request = require("./models/Request");

exports.handler = async (event) => {
  try {
    await connectToDatabase();

    const { userId } = event.queryStringParameters;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId" }),
      };
    }

    const requests = await Request.find({ userId }).sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(requests),
    };
  } catch (error) {
    console.error("❌ getUserRequests error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
