require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

console.log('🔧 Function loading, key:', process.env.OPENAI_API_KEY?.slice(0,6) + '…');

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

exports.handler = async (event) => {
  console.log('📨 Received method:', event.httpMethod);
  let body;
  try {
    body = JSON.parse(event.body || '{}');
    console.log('📥 Parsed body:', body);
  } catch (err) {
    console.error('❌ JSON parse error:', err);
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad JSON' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Only POST allowed' }) };
  }

  const question = body.question;
  if (!question) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Question is required' }) };
  }

  console.log('👉 Question received:', question);

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });

    const answer = response.data.choices?.[0]?.message?.content || '(no answer)';
    console.log('✅ API answered:', answer);

    return { statusCode: 200, body: JSON.stringify({ answer }) };
  } catch (err) {
    console.error('💥 OpenAI call errored:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI request failed' }) };
  }
};
