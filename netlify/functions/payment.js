const Stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Parse request body
  const { amount, currency } = JSON.parse(event.body || '{}');

  // Validate amount
  if (!amount) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Amount is required' }),
    };
  }

  try {
    // Create Alipay PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['alipay'],
      payment_method_options: {
        alipay: {
          // Use dummy URL just to satisfy Stripe requirement
          return_url: 'https://example.com', // You can change this if needed
        },
      },
    });

    // Extract redirect URL
    const nextActionUrl = paymentIntent.next_action?.redirect_to_url?.url;

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
