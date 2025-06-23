const { connectToDatabase } = require('../../db');
const Request = require('../../models/Request');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    await connectToDatabase();

    const { id, status } = JSON.parse(event.body);

    const updated = await Request.findByIdAndUpdate(id, {
      status,
      reviewedBy: 'admin123', // Optional
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Updated', updated }),
    };
  } catch (err) {
    console.error('❌ Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
