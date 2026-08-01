import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../../src/models/Category.js";
import { PRODUCT_EXPERIENCES } from "../../src/constants/productExperiences.js";

dotenv.config();

const MACHINE_CATEGORY_SLUGS = new Set(
  (process.env.MACHINE_COMPONENT_CATEGORY_SLUGS || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean),
);

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const categories = await Category.find({});

  for (const category of categories) {
    category.experience = MACHINE_CATEGORY_SLUGS.has(category.slug)
      ? PRODUCT_EXPERIENCES.MACHINE_COMPONENTS
      : PRODUCT_EXPERIENCES.SEMI_FINISHED;

    await category.save();
  }

  console.log(`Updated ${categories.length} categories`);
}

run()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
