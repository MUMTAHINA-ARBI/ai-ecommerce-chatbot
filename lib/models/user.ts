// lib/models/user.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevents compilation errors during Next.js hot-reloading
export const User = mongoose.models.User || mongoose.model("User", UserSchema);