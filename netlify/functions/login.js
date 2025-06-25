const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  const { email, password, role } = JSON.parse(event.body);

  // Mock: Replace with DB lookup
  const mockUser = {
    email: 'member@example.com',
    passwordHash: await bcrypt.hash('123456', 10),
    role: 'member',
  };

  const match = await bcrypt.compare(password, mockUser.passwordHash);

  if (email === mockUser.email && match && role === mockUser.role) {
    const token = jwt.sign({ email, role }, 'your_jwt_secret', { expiresIn: '7d' });

    return {
      statusCode: 200,
      body: JSON.stringify({ token, role }),
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ message: 'Invalid credentials' }),
  };
};
