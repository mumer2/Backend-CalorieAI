const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Only GET allowed' };
  }

  const { userId, coachId } = event.queryStringParameters;
  if (!userId || !coachId) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing userId or coachId' }) };
  }

  const client = new MongoClient(process.env.MONGO_DB_URI);
  try {
    await client.connect();
    const db = client.db('calorieai');
    const collection = db.collection('coach_requests');

    const replies = await collection
      .find({ userId, coachId, reply: { $exists: true } })
      .sort({ repliedAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(replies),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: err.message }),
    };
  } finally {
    await client.close();
  }
};
