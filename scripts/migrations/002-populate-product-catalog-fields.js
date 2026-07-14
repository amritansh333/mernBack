import dotenv from "dotenv";
import mongoose from "mongoose";
import Brand from "../../src/models/Brand.js";
import Category from "../../src/models/Category.js";
import Product from "../../src/models/Product.js";
import SubCategory from "../../src/models/SubCategory.js";
import {
  DEFAULT_PRODUCT_EXPERIENCE,
  PRODUCT_EXPERIENCE_VALUES,
} from "../../src/constants/productExperiences.js";
import { resolveProductExperience } from "../../src/productExperiences/experienceResolver.js";
import { toIdString } from "../../src/utils/ids.js";

dotenv.config();

const args = new Set(process.argv.slice(2));
const shouldApply = args.has("--apply");
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : 0;

const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object || {}, key);

const isMissingValue = (value) =>
  value === undefined || value === null || value === "";

const isMissingField = (object, key) =>
  !hasOwn(object, key) || isMissingValue(object[key]);

const hasDownloads = (downloads) =>
  Array.isArray(downloads) &&
  downloads.some((download) => download?.label || download?.url);

const hasKeywords = (keywords) =>
  Array.isArray(keywords) && keywords.some((keyword) => keyword?.trim?.());

const firstText = (...values) => {
  for (const value of values.flat()) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const compactDownloads = (downloads) =>
  (Array.isArray(downloads) ? downloads : [])
    .map((download) => ({
      label: firstText(download?.label, "Product PDF"),
      url: firstText(download?.url),
    }))
    .filter((download) => download.url);

const buildDownloads = (product) => {
  const machineDownloads = compactDownloads(product.machineComponentData?.downloads);

  if (machineDownloads.length) {
    return machineDownloads;
  }

  if (typeof product.pdfUrl === "string" && product.pdfUrl.trim()) {
    return [{ label: "Product PDF", url: product.pdfUrl.trim() }];
  }

  return [];
};

const buildKeywords = (product) => {
  const words = `${product.name || ""} ${product.slug || ""}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2);

  return [...new Set(words)].slice(0, 12);
};

const buildSeoPatch = (product) => {
  const seo = product.seo && typeof product.seo === "object" ? product.seo : {};
  const patch = {};

  if (isMissingField(seo, "metaTitle")) {
    const metaTitle = firstText(product.name);

    if (metaTitle) {
      patch["seo.metaTitle"] = metaTitle;
    }
  }

  if (isMissingField(seo, "metaDescription")) {
    const metaDescription = firstText(
      product.description,
      product.machineComponentData?.description
    ).slice(0, 160);

    if (metaDescription) {
      patch["seo.metaDescription"] = metaDescription;
    }
  }

  if (!hasOwn(seo, "keywords") || !hasKeywords(seo.keywords)) {
    const keywords = buildKeywords(product);

    if (keywords.length) {
      patch["seo.keywords"] = keywords;
    }
  }

  return patch;
};

const toObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : null;

const loadMap = async (Model) => {
  const documents = await Model.find({}).lean();
  return new Map(documents.map((document) => [toIdString(document), document]));
};

const inferHierarchy = ({ product, categoriesById, subCategoriesById, brandsById }) => {
  const brand = product.brand ? brandsById.get(toIdString(product.brand)) : null;
  const existingSubCategory = product.subCategory
    ? subCategoriesById.get(toIdString(product.subCategory))
    : null;
  const brandSubCategory = brand
    ? subCategoriesById.get(toIdString(brand.subCategory))
    : null;
  const subCategory = existingSubCategory || brandSubCategory || null;

  const existingCategory = product.category
    ? categoriesById.get(toIdString(product.category))
    : null;
  const subCategoryCategory = subCategory
    ? categoriesById.get(toIdString(subCategory.category))
    : null;
  const category = existingCategory || subCategoryCategory || null;

  return { category, subCategory, brand };
};

const isSupportedExperience = (experience) =>
  PRODUCT_EXPERIENCE_VALUES.includes(experience);

const hasOrphanBrand = ({ product, brandsById }) =>
  Boolean(product.brand) && !brandsById.has(toIdString(product.brand));

const buildPatch = ({ product, hierarchy, knownPaths }) => {
  const { category, subCategory, brand } = hierarchy;
  const patch = {};
  const warnings = [];

  if (isMissingField(product, "experience")) {
    const inferredExperience =
      category?.experience ||
      subCategory?.experience ||
      brand?.experience ||
      DEFAULT_PRODUCT_EXPERIENCE;

    if (isSupportedExperience(inferredExperience)) {
      patch.experience = inferredExperience;
    } else {
      warnings.push("unsupported inferred experience");
    }
  }

  if (isMissingField(product, "category") && category?._id) {
    patch.category = category._id;
  }

  if (isMissingField(product, "subCategory") && subCategory?._id) {
    patch.subCategory = subCategory._id;
  }

  if (!hasOwn(product, "brand")) {
    patch.brand = null;
  }

  if (!hasDownloads(product.downloads)) {
    const downloads = buildDownloads(product);

    if (downloads.length) {
      patch.downloads = downloads;
    }
  }

  Object.assign(patch, buildSeoPatch(product));

  if (isMissingField(product, "path")) {
    const resolvedExperience = resolveProductExperience(category);
    const routingStrategy = resolvedExperience?.routingStrategy;

    if (category && routingStrategy) {
      let generatedPath = null;

      try {
        generatedPath = routingStrategy.buildProductPath({
          category,
          subCategory,
          brand,
          product,
        });
      } catch (error) {
        warnings.push(`path skipped: ${error.message}`);
      }

      if (!generatedPath) {
        return { patch, warnings };
      }

      const ownerId = knownPaths.get(generatedPath);

      if (ownerId && ownerId !== toIdString(product)) {
        warnings.push(`path collision skipped: ${generatedPath}`);
      } else {
        patch.path = generatedPath;
        knownPaths.set(generatedPath, toIdString(product));
      }
    } else {
      warnings.push("path skipped: experience routing could not be resolved");
    }
  }

  return { patch, warnings };
};

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const [categoriesById, subCategoriesById, brandsById] = await Promise.all([
    loadMap(Category),
    loadMap(SubCategory),
    loadMap(Brand),
  ]);

  const existingPathProducts = await Product.collection
    .find({ path: { $type: "string", $ne: "" } }, { projection: { path: 1 } })
    .toArray();
  const knownPaths = new Map(
    existingPathProducts.map((product) => [product.path, toIdString(product)])
  );

  const query = {};
  const options = { sort: { _id: 1 } };

  if (limit > 0) {
    options.limit = limit;
  }

  const products = await Product.collection.find(query, options).toArray();

  const summary = {
    mode: shouldApply ? "apply" : "dry-run",
    scanned: 0,
    changed: 0,
    unchanged: 0,
    skippedWarnings: 0,
    updates: {
      experience: 0,
      category: 0,
      subCategory: 0,
      brand: 0,
      path: 0,
      downloads: 0,
      seo: 0,
    },
    orphanProducts: 0,
  };
  const warnings = [];
  const orphanProducts = [];

  for (const product of products) {
    summary.scanned += 1;

    if (hasOrphanBrand({ product, brandsById })) {
      summary.orphanProducts += 1;
      summary.unchanged += 1;
      orphanProducts.push({
        name: product.name,
        slug: product.slug,
        brand: toIdString(product.brand),
      });
      continue;
    }

    const hierarchy = inferHierarchy({
      product,
      categoriesById,
      subCategoriesById,
      brandsById,
    });
    const { patch, warnings: productWarnings } = buildPatch({
      product,
      hierarchy,
      knownPaths,
    });

    for (const warning of productWarnings) {
      summary.skippedWarnings += 1;
      warnings.push(`${product.slug || product._id}: ${warning}`);
    }

    const set = {};

    for (const [key, value] of Object.entries(patch)) {
      if (key === "category" || key === "subCategory") {
        set[key] = toObjectId(value);
      } else {
        set[key] = value;
      }
    }

    const setKeys = Object.keys(set);

    if (!setKeys.length) {
      summary.unchanged += 1;
      continue;
    }

    summary.changed += 1;

    for (const key of setKeys) {
      if (key.startsWith("seo.")) {
        summary.updates.seo += 1;
      } else if (summary.updates[key] !== undefined) {
        summary.updates[key] += 1;
      }
    }

    if (shouldApply) {
      await Product.collection.updateOne({ _id: product._id }, { $set: set });
    }
  }

  console.log(JSON.stringify(summary, null, 2));

  if (orphanProducts.length) {
    console.log("\nOrphan products skipped as obsolete:");
    for (const product of orphanProducts) {
      console.log(
        `- ${product.name} (${product.slug}) -> missing brand ${product.brand}`
      );
    }
    console.log(
      "\nRun npm run migrate:cleanup-orphan-products to preview cleanup."
    );
  }

  if (warnings.length) {
    console.log("\nWarnings:");
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  }

  if (!shouldApply) {
    console.log("\nDry run only. Re-run with --apply to write changes.");
  }
}

run()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  });
