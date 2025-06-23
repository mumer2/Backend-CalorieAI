const { connectToDatabase } = require('../../db');
const Request = require('../../models/Request');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PATCH') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await connectToDatabase();
    const { id, status, reviewedBy, reviewComment } = JSON.parse(event.body);
    const updated = await Request.findByIdAndUpdate(
      id,
      { status, reviewedBy, reviewComment, reviewedAt: new Date() },
      { new: true }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
