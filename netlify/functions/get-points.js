const { MongoClient, ObjectId } = require('mongodb');
const uri3 = process.env.MONGO_DB_URI;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const userId = event.queryStringParameters?.userId;
  if (!userId) {
    return { statusCode: 400, body: 'User ID is required' };
  }

  const client = new MongoClient(uri3);
  try {
    await client.connect();
    const db = client.db('calorieai');
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return { statusCode: 404, body: 'User not found' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ coins: user.coins || 0 }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to retrieve coins', error: err.message }) };
  } finally {
    await client.close();
  }
};