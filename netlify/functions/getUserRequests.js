const { connectToDatabase } = require("./db");
const Request = require("./models/Request");

exports.handler = async (event) => {
  await connectToDatabase();

  const { userId } = event.queryStringParameters || {};

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required 'userId' parameter." }),
    };
  }

  try {
    const requests = await Request.find({ userId }).sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(requests),
    };
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error while fetching requests." }),
    };
  }
};
