const Stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

exports.handler = async (event) => {
  // Allow only POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse body and validate
    const { amount, currency } = JSON.parse(event.body || '{}');

    if (!amount || !currency) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Amount and currency are required' }),
      };
    }

    // Create a Stripe PaymentIntent with Alipay
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['alipay'],
      payment_method_options: {
        alipay: {
          return_url: 'https://example.com', // required by Stripe, but unused
        },
      },
    });

    // Extract the redirect URL for Alipay
    const nextActionUrl = paymentIntent?.next_action?.redirect_to_url?.url;

    if (!nextActionUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No redirect URL returned from Stripe' }),
      };
    }

    // Respond to the client app
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
