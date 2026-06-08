console.log("SCRIPT STARTED");

const mongoose = require("mongoose");

const MONGODB_URI = "your_mongodb_uri_here";

console.log("URI EXISTS:", !!MONGODB_URI);

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function run() {
  try {
    console.log("CONNECTING...");

    await mongoose.connect(MONGODB_URI);

    console.log("CONNECTED");

    await Product.create({ name: "Test", price: 10 });

    const data = await Product.find();

    console.log("DATA:", data);
  } catch (err) {
    console.error("ERROR:", err);
  }

  process.exit();
}

run();