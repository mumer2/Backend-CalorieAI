// api/create-payment-intent.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cny',
      payment_method_types: ['alipay'],
      return_url: 'yourapp://return',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      nextActionUrl: paymentIntent.next_action?.redirect_to_url?.url || null,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
