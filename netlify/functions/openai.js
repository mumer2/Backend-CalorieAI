// netlify/functions/openai.js

const { OpenAI } = require('openai');

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

  let question;
  try {
    const body = JSON.parse(event.body || '{}');
    question = body.question;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  if (!question || typeof question !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Question is required and must be a string' }),
    };
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });

    const answer = chatResponse.choices[0]?.message?.content || 'No answer received.';

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error('OpenAI error:', error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch response from OpenAI' }),
    };
  }
};
