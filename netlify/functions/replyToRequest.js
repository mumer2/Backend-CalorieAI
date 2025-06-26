const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' };
  }

  try {
    const { requestId, reply } = JSON.parse(event.body);
    if (!requestId || !reply) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing requestId or reply' }),
      };
    }

    const client = new MongoClient(process.env.MONGO_DB_URI);
    await client.connect();
    const db = client.db('calorieai');
    const collection = db.collection('coach_requests');

    const result = await collection.updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          reply,
          status: 'read',
          repliedAt: new Date().toISOString(),
        },
      }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, updated: result.modifiedCount }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: err.message }),
    };
  }
};
//         setRequests(updated);