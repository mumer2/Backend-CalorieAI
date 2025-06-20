const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { question } = body;

  if (!question) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Question is required' }),
    };
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768', // you can also use 'llama3-70b-8192' or 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: question }],
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error('❌ Groq API error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Groq request failed' }),
    };
  }
};
