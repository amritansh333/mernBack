import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/Product.js";

// ✅ LOAD .env FILE
dotenv.config();

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
    console.log("📦 DB name:", mongoose.connection.name);

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      if (!product.image && product.slug) {
        product.image = `/uploads/products/${product.slug}.jpg`;
        await product.save();
        console.log(`✔ Image added → ${product.slug}`);
      }
    }

    console.log("🎉 DONE: All products updated");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

run();
