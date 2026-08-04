import Product from "../../../models/Product.js";
import Category from "../../../models/Category.js";
import Brand from "../../../models/Brand.js";
import Material from "../../../models/Material.js";
import Enquiry from "../../../models/Enquiry.js";
import mongoose from "mongoose";

export const countProducts = () => Product.countDocuments({});
export const countCategories = () => Category.countDocuments({});
export const countBrands = () => Brand.countDocuments({});
export const countMaterials = () => Material.countDocuments({});
export const countMachineComponents = () => {
  const MachineComponentAdmin = mongoose.models.MachineComponentAdmin;
  return MachineComponentAdmin ? MachineComponentAdmin.countDocuments({}) : Promise.resolve(0);
};

export const latestProducts = (limit = 10) => Product.find({}).sort({ createdAt: -1 }).limit(limit).lean();
export const latestLeads = (limit = 10) => Enquiry.find({}).sort({ createdAt: -1 }).limit(limit).lean();

export default { countProducts, countCategories, countBrands, countMaterials, countMachineComponents, latestProducts, latestLeads };
