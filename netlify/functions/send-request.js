// functions/send-request.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DB_URI;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { coachId, message, memberName } = JSON.parse(event.body);

    if (!coachId || !message || !memberName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing fields' }),
      };
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('calorieai');

    await db.collection('requests').insertOne({
      coachId,
      message,
      memberName,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Request sent successfully' }),
    };
  } catch (err) {
    console.error('Error sending request:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
