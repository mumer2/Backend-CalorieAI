const { connectToDatabase } = require('../../db');
const Request = require('../../models/Request');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    await connectToDatabase();

    const body = JSON.parse(event.body);

    if (!body.userId || !body.content || !body.type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const request = await Request.create({
      userId: body.userId,
      content: body.content,
      type: body.type,
      status: 'pending',
      createdAt: new Date(),
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Request submitted', request }),
    };
  } catch (err) {
    console.error('❌ Function Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Server Error' }),
    };
  }
};
