const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock "database"
let users = []; // In-memory for demo. Replace with real DB in production.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password, role } = JSON.parse(event.body);

    if (!email || !password || !role) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    // Check if user already exists
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'User already exists' }),
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to "DB"
    const newUser = { email, password: hashedPassword, role };
    users.push(newUser);

    // Create JWT token
    const token = jwt.sign({ email, role }, 'your_jwt_secret', { expiresIn: '7d' });

    return {
      statusCode: 201,
      body: JSON.stringify({ token, role }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Signup failed', error: error.message }),
    };
  }
};
