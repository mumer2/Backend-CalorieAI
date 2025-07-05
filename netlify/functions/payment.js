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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['alipay'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: 'Premium Subscription',
            },
          },
          quantity: 1,
        },
      ],
      success_url: 'https://example.com/success', // required, can be dummy
      cancel_url: 'https://example.com/cancel',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ nextActionUrl: session.url }),
    };
  } catch (err) {
    console.error('Stripe Checkout error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
