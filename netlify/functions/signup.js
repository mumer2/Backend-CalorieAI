const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_DB_URI;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  try {
    const { email, password, role } = JSON.parse(event.body);

    if (!email || !password || !role) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing fields' }) };
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db('sample_mflix');
    const users = db.collection('users');

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await client.close();
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'User already exists' }),
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({ email: email.toLowerCase(), passwordHash, role });

    await client.close();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (err) {
    console.error('Signup error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: err.message }),
    };
  }
};
