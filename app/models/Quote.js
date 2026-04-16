// app/models/Quote.js
import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    product: String,
    quantity: String,
    details: String,
    source: { type: String, default: 'website' }, // Optional: track where form came from
  },
  { timestamps: true }
);

const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
export default Quote;
