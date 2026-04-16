import mongoose from 'mongoose';

const labelValueSchema = new mongoose.Schema(
  { label: String, value: String },
  { _id: false },
);
const documentSchema = new mongoose.Schema(
  { label: String, link: String },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    documents: [documentSchema],
    specs: [labelValueSchema],
    details: [labelValueSchema],
    applications: { type: Map, of: [String] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);
