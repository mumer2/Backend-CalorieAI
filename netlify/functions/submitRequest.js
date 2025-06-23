const { connectToDatabase } = require('../../db');
const Request = require('../../models/Request');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await connectToDatabase();
    const body = JSON.parse(event.body);
    const request = await Request.create(body);
    return {
      statusCode: 201,
      body: JSON.stringify(request),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
