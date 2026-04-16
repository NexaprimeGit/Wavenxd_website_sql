import Razorpay from 'razorpay';
/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function POST(req) {
  const { amount, currency = 'INR' } = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency,
      receipt: 'receipt_' + Date.now(),
    });
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
