// netlify/functions/submitRequest.js
const { connectToDatabase } = require('./db');
const Request = require('./models/Request');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    await connectToDatabase();

    const { userId, content, type } = JSON.parse(event.body);

    const newRequest = await Request.create({
      userId,
      content,
      type,
      status: 'pending',
    });

    return {
      statusCode: 200,
      body: JSON.stringify(newRequest),
    };
  } catch (err) {
    console.error('❌ Submit Request Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
