import Product from "../../../models/Product.js";
import Category from "../../../models/Category.js";
import Brand from "../../../models/Brand.js";
import Material from "../../../models/Material.js";
import Enquiry from "../../../models/Enquiry.js";
import mongoose from "mongoose";
import BrochureLead from "../../brochure/models/Lead.js";
import SystemLog from "../system-logs/SystemLog.js";

// Simple aggregated search for admin UI. Returns up to 'limit' rows per resource.
export const search = async (query = "", limit = 4) => {
  const q = (query || "").trim();
  const regex = q ? { $regex: q, $options: "i" } : null;

  const productQuery = q
    ? { $or: [{ name: regex }, { slug: regex }, { "seo.metaTitle": regex }] }
    : {};
  const categoryQuery = q ? { $or: [{ name: regex }, { slug: regex }] } : {};
  const brandQuery = q ? { $or: [{ name: regex }, { slug: regex }] } : {};
  const materialQuery = q ? { name: regex } : {};

  const [products, categories, brands, materials] = await Promise.all([
    Product.find(productQuery).limit(limit).lean(),
    Category.find(categoryQuery).limit(limit).lean(),
    Brand.find(brandQuery).limit(limit).lean(),
    Material.find(materialQuery).limit(limit).lean(),
  ]);

  // Attempts to include leads and brochure downloads if models exist
  const EnquiryModel = mongoose.models.Enquiry || Enquiry;
  const BrochureModel = mongoose.models.Lead || BrochureLead;

  const [leads, brochureLeads] = await Promise.all([
    EnquiryModel ? EnquiryModel.find(q ? { $or: [{ fullName: regex }, { email: regex }, { company: regex }] } : {}).limit(limit).lean() : Promise.resolve([]),
    BrochureModel ? BrochureModel.find(q ? { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { companyName: regex }] } : {}).limit(limit).lean() : Promise.resolve([]),
  ]);

  // Include system logs search results (if any)
  const systemLogs = q ? await SystemLog.find({ $or: [{ message: regex }, { 'meta.user': regex }, { source: regex }] }).limit(limit).lean() : [];

  return {
    products,
    categories,
    brands,
    materials,
    leads,
    brochureLeads,
    systemLogs,
  };
};

export default { search };
