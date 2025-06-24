const { connectToDatabase } = require("./db");
const Request = require("./models/Request");

exports.handler = async (event) => {
  console.log("⚙️ Function started");

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    console.log("📡 Connecting to DB...");
    await connectToDatabase();
    console.log("✅ DB Connected");

    const body = JSON.parse(event.body);
    const { userId, content, type } = body;

    if (!userId || !content || !type) {
      console.log("❌ Missing fields");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // 🕒 Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 🔍 Check if a request already exists for today
    const existing = await Request.findOne({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "You can only submit one request per day." }),
      };
    }

    // ✅ Save new request
    const request = await Request.create({
      userId,
      type,
      content,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("✅ Request saved:", request._id);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Success", request }),
    };
  } catch (err) {
    console.error("❌ Caught error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server Error" }),
    };
  }
};


// netlify/functions/submitRequest.js
// const { connectToDatabase } = require("./db");
// const Request = require("./models/Request");

// exports.handler = async (event) => {
//   console.log("⚙️ Function started");

//   if (event.httpMethod !== "POST") {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ error: "Method Not Allowed" }),
//     };
//   }

//   try {
//     console.log("📡 Connecting to DB...");
//     await connectToDatabase();
//     console.log("✅ DB Connected");

//     const body = JSON.parse(event.body);

//     if (!body.userId || !body.content || !body.type) {
//       console.log("❌ Missing fields");
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "Missing required fields" }),
//       };
//     }

//     console.log("📦 Creating request document...");
//     const request = await Request.create({
//       userId: body.userId,
//       type: body.type,
//       content: body.content,
//       status: "pending",
//       createdAt: new Date(),
//     });

//     console.log("✅ Request saved:", request._id);

//     return {
//       statusCode: 201,
//       body: JSON.stringify({ message: "Success", request }),
//     };
//   } catch (err) {
//     console.error("❌ Caught error:", err.message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message || "Server Error" }),
//     };
//   }
// };
