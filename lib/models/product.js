import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: { type: [String], default: [] },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

// Named export matched with the curly braces import
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);