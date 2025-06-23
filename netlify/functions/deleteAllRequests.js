const { connectToDatabase } = require("./db");
const Request = require("./models/Request");

exports.handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    await connectToDatabase();

    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId" }),
      };
    }

    const result = await Request.deleteMany({ userId });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "All requests deleted", deleted: result.deletedCount }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
