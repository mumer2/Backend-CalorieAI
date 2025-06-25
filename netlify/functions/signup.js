const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_DB_URI;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password, role } = JSON.parse(event.body);

    if (!email || !password || !role) {
      return { statusCode: 400, body: JSON.stringify({ message: 'All fields required' }) };
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('calorieai');
    const users = db.collection('users');

    const existing = await users.findOne({ email });
    if (existing) {
      await client.close();
      return { statusCode: 409, body: JSON.stringify({ message: 'User already exists' }) };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({ email, passwordHash, role });

    await client.close();
    return { statusCode: 201, body: JSON.stringify({ message: 'User registered successfully' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Signup error', error: err.message }) };
  }
};
