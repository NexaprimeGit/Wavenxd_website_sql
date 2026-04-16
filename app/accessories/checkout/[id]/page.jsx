// app/accessories/checkout/[id]/page.jsx
import CheckoutForm from './CheckoutForm';
import connectDB from '../../../lib/mongodb';
import Accessory from '../../../models/Acessory';

// 1️⃣ Keep this as a server component (no "use client")
export default async function CheckoutPage({ params }) {
  // 2️⃣ Wait for params if it's a promise
  const { id } = await params; // unwrap the promise

  // 3️⃣ Connect to MongoDB
  await connectDB();

  // 4️⃣ Fetch the accessory
  const productDoc = await Accessory.findById(id).lean();

  // 5️⃣ Handle not found
  if (!productDoc) {
    return <p className="p-10 text-center">Product not found</p>;
  }

  // 6️⃣ Convert _id to string (required for client component props)
  const product = { ...productDoc, _id: productDoc._id.toString() };

  // 7️⃣ Render checkout form
  return <CheckoutForm product={product} />;
}
