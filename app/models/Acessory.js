import mongoose from 'mongoose';

const accessorySchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    image: String,
    description: String,

    specifications: [
      {
        label: String,
        value: String,
        _id: false, // 🔥 IMPORTANT
      },
    ],

    price: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Accessory ||
  mongoose.model('Accessory', accessorySchema);
