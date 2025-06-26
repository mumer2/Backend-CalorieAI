const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_DB_URI;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  if (!uri) {
    console.error("❌ MongoDB URI not set in environment variables.");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server configuration error: missing DB URI" }),
    };
  }

  try {
    const { name, email, password, role } = JSON.parse(event.body);

    if (!name || !email || !password || !role) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields (name, email, password, role) are required' }),
      };
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('calorieai');
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
    await users.insertOne({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date(),
    });

    await client.close();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (err) {
    console.error('❌ Signup error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Server error',
        error: err.message,
      }),
    };
  }
};
