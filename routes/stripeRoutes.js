import express from "express"
import Stripe from "stripe"


const stripeRouter = express.Router()


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


stripeRouter.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true }, 
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


export default stripeRouter