const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { amount, currency } = JSON.parse(event.body || '{}');

    if (!amount || !currency) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Amount and currency are required' }),
      };
    }

    // ✅ Remove the return_url parameter
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['alipay'],
    });

    const nextActionUrl = paymentIntent?.next_action?.redirect_to_url?.url;

    if (!nextActionUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No redirect URL returned from Stripe' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        nextActionUrl,
      }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
