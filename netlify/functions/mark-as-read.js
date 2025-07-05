const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' };
  }

  try {
    const { id } = JSON.parse(event.body);
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing notification ID' }),
      };
    }

    const client = new MongoClient(process.env.MONGO_DB_URI);
    await client.connect();
    const db = client.db('calorieai');
    const collection = db.collection('notifications');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isRead: true } }
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
