const { MongoClient: MC } = require('mongodb');
const uri4 = process.env.MONGO_DB_URI;

exports.handler = async () => {
  const client = new MC(uri4);
  try {
    await client.connect();
    const db = client.db('calorieai');
    const users = db.collection('users');

    const topUsers = await users
      .find({}, { projection: { name: 1, coins: 1 } })
      .sort({ coins: -1 })
      .limit(10)
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(topUsers),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to load leaderboard', error: err.message }) };
  } finally {
    await client.close();
  }
};