const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
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
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: response.data.choices[0].message.content.trim(),
      }),
    };
  } 
  catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};


// Note: Make sure to set the OPENAI_API_KEY environment variable in your Netlify settings.git push -u origin main
