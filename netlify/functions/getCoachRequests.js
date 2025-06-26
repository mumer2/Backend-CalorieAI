// functions/getCoachRequests.js
const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Only GET method allowed' };
  }

  const coachId = event.queryStringParameters.coachId;

  // Validate coachId
  if (!coachId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing coachId query parameter' }),
    };
  }

  const client = new MongoClient(process.env.MONGO_DB_URI);

  try {
    await client.connect();
    const db = client.db('calorieai');
    const collection = db.collection('coach_requests');

    // Convert coachId to ObjectId if needed (only if you're storing it as ObjectId)
    const query = { coachId };

    const requests = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(requests),
    };
  } catch (err) {
    console.error('Error fetching coach requests:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
