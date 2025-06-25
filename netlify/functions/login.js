const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Pre-hashed password for '123456'
const hashedPassword = '$2a$10$s8.1JWbguJwWZ1vVqCDRAO92lkrS4TW/jk9syLZkOaG0sA7gxsKJm';

// Mock user database (replace with real DB in production)
const users = [
  {
    email: 'member@example.com',
    passwordHash: hashedPassword,
    role: 'member',
  },
  {
    email: 'coach@example.com',
    passwordHash: hashedPassword,
    role: 'coach',
  },
];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, password, role } = JSON.parse(event.body);

    if (!email || !password || !role) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role.toLowerCase() === role.toLowerCase()
    );

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'User not found or role mismatch' }),
      };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid password' }),
      };
    }

    const token = jwt.sign({ email: user.email, role: user.role }, 'your_jwt_secret', {
      expiresIn: '7d',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ token, role: user.role }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: err.message }),
    };
  }
};
