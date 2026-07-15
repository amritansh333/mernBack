import dotenv from "dotenv";
import mongoose from "mongoose";
import Brand from "../../src/models/Brand.js";
import Product from "../../src/models/Product.js";
import { toIdString } from "../../src/utils/ids.js";

dotenv.config();

const args = new Set(process.argv.slice(2));
const shouldApply = args.has("--apply");
const confirmationArg = process.argv.find((arg) =>
  arg.startsWith("--confirm=")
);
const confirmation = confirmationArg ? confirmationArg.split("=")[1] : "";
const requiredConfirmation = "delete-orphan-products";

const loadBrandIds = async () => {
  const brands = await Brand.find({}).select("_id").lean();
  return new Set(brands.map((brand) => toIdString(brand)));
};

const findOrphanProducts = async (brandIds) => {
  const productsWithBrand = await Product.find({
    brand: { $exists: true, $ne: null },
  })
    .select("name slug brand category subCategory path experience")
    .sort({ brand: 1, slug: 1 })
    .lean();

  return productsWithBrand.filter(
    (product) => !brandIds.has(toIdString(product.brand))
  );
};

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const brandIds = await loadBrandIds();
  const orphanProducts = await findOrphanProducts(brandIds);
  const orphanProductIds = orphanProducts.map((product) => product._id);
  const orphanBrandIds = [
    ...new Set(orphanProducts.map((product) => toIdString(product.brand))),
  ];

  const summary = {
    mode: shouldApply ? "apply" : "dry-run",
    matchedProducts: orphanProducts.length,
    orphanBrandIds,
    deletedProducts: 0,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (orphanProducts.length) {
    console.log("\nOrphan products targeted for deletion:");
    for (const product of orphanProducts) {
      console.log(
        `- ${product.name} (${product.slug}) -> missing brand ${toIdString(
          product.brand
        )}`
      );
    }
  }

  if (!shouldApply) {
    console.log(
      "\nDry run only. Re-run with --apply --confirm=delete-orphan-products to delete these products."
    );
    return;
  }

  if (confirmation !== requiredConfirmation) {
    throw new Error(
      `Refusing to delete. Pass --confirm=${requiredConfirmation} with --apply.`
    );
  }

  if (!orphanProductIds.length) {
    console.log("\nNo orphan products found. Nothing to delete.");
    return;
  }

  const result = await Product.deleteMany({ _id: { $in: orphanProductIds } });
  console.log(
    JSON.stringify(
      {
        ...summary,
        deletedProducts: result.deletedCount,
      },
      null,
      2
    )
  );
}

run()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  });
