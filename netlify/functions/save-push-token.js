const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { userId, pushToken } = JSON.parse(event.body);

  if (!userId || !pushToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId or pushToken' }),
    };
  }

  const client = new MongoClient(process.env.MONGO_DB_URI);
  try {
    await client.connect();
    const db = client.db('calorieai');
    const users = db.collection('users');

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { pushToken } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token saved successfully' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to save token', error: err.message }),
    };
  } finally {
    await client.close();
  }
};
