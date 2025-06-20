// netlify/functions/openai.js
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST requests allowed" }),
    };
  }

  const { question } = JSON.parse(event.body);

  if (!question) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Question is required" }),
    };
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: response.data.choices[0].message.content.trim(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
