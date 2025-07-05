const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
  const userId = event.queryStringParameters.userId;
  if (!userId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing userId' }),
    };
  }

  try {
    const client = new MongoClient(process.env.MONGO_DB_URI);
    await client.connect();
    const db = client.db('calorieai');

    const notifications = await db.collection('notifications')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    await client.close();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error', message: err.message }),
    };
  }
};
