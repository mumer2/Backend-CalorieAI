// netlify/functions/openai.js
const { OpenAI } = require("openai");

// ✅ OpenAI client setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  // ✅ Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST allowed" }),
    };
  }

  // ✅ Parse JSON body safely
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { question } = body;

  // ✅ Check for empty input
  if (!question || question.trim() === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Question is required" }),
    };
  }

  try {
    // ✅ Call OpenAI API
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
    });

    const answer = chatResponse.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No response from OpenAI" }),
      };
    }

    // ✅ Return answer
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error("❌ OpenAI Error:", error.response?.data || error.message || error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "OpenAI request failed",
        message: error.message,
        details: error.response?.data || null,
      }),
    };
  }
};
