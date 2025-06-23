const { connectToDatabase } = require("./db");
const Request = require("./models/Request");

exports.handler = async () => {
  try {
    await connectToDatabase();

    const requests = await Request.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(requests),
    };
  } catch (err) {
    console.error("❌ Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
