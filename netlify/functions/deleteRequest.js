// netlify/functions/deleteRequest.js
const { connectToDatabase } = require('./db');
const Request = require('./models/Request');

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    await connectToDatabase();

    const { id } = JSON.parse(event.body);

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing request ID' }) };
    }

    await Request.findByIdAndDelete(id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Request deleted successfully' }),
    };
  } catch (err) {
    console.error('❌ Delete Request Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
