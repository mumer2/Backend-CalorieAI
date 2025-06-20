// netlify/functions/openai.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST allowed' }),
    };
  }

  const { question } = JSON.parse(event.body || '{}');

  if (!question) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Question is required' }),
    };
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: chatResponse.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error('OpenAI error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI request failed' }),
    };
  }
};
