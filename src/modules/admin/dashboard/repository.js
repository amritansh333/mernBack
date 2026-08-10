import Product from "../../../models/Product.js";
import Category from "../../../models/Category.js";
import Brand from "../../../models/Brand.js";
import Material from "../../../models/Material.js";
import Enquiry from "../../../models/Enquiry.js";
import SubCategory from "../../../models/SubCategory.js";
import mongoose from "mongoose";
import { PRODUCT_EXPERIENCES } from "../../../constants/productExperiences.js";
import BrochureLead from "../../brochure/models/Lead.js";
import * as mediaService from "../media-library/service.js";

export const countProducts = () => Product.countDocuments({});
export const countCategories = () => Category.countDocuments({});
export const countBrands = () => Brand.countDocuments({});
export const countMaterials = () => Material.countDocuments({});
export const countSubcategories = () =>
  SubCategory ? SubCategory.countDocuments({}) : Promise.resolve(0);

// Machine components are stored in a separate admin model
export const countMachineComponents = () => {
  const MachineComponentAdmin = mongoose.models.MachineComponentAdmin;
  return MachineComponentAdmin
    ? MachineComponentAdmin.countDocuments({})
    : Promise.resolve(0);
};

// Count Semi Finished products by product experience enum so we reuse the Product model
export const countSemiFinishedProducts = () =>
  Product.countDocuments({ experience: PRODUCT_EXPERIENCES.SEMI_FINISHED });

// Brochure downloads / leads come from the brochure Lead model
export const countBrochureDownloads = () => {
  // If model isn't registered for some deployments, fallback to 0
  const Model = mongoose.models.Lead || BrochureLead;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

// Additional optional counts: drawing requests, quote requests, media library, users, roles, settings
export const countDrawingRequests = () => {
  const Model = mongoose.models.DrawingRequest;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

export const countEnquiries = () => {
  // Count enquiries (single source-of-truth collection).
  return Enquiry ? Enquiry.countDocuments({}) : Promise.resolve(0);
};

export const countMediaLibrary = async () => {
  const Model = mongoose.models.Media || mongoose.models.Upload;
  if (Model) return Model.countDocuments({});
  // fallback to filesystem-based media library if no DB model
  try {
    const total = await mediaService.countMedia();
    return total;
  } catch (err) {
    return 0;
  }
};

export const countUsers = () => {
  const Model = mongoose.models.User;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

export const countRoles = () => {
  const Model = mongoose.models.Role;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

export const countContent = () => {
  const Model = mongoose.models.ContentEntry;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

export const latestProducts = (limit = 10) =>
  Product.find({}).sort({ createdAt: -1 }).limit(limit).lean();
export const latestLeads = (limit = 10) => {
  const Model = mongoose.models.Lead || BrochureLead;

  return Model
    ? Model.find({}).sort({ createdAt: -1 }).limit(limit).lean()
    : Promise.resolve([]);
};
export const latestDownloads = (limit = 10) => {
  const Model = mongoose.models.Lead || BrochureLead;
  return Model
    ? Model.find({}).sort({ createdAt: -1 }).limit(limit).lean()
    : Promise.resolve([]);
};

export const latestContent = (limit = 6) => {
  const Model = mongoose.models.ContentEntry;
  return Model
    ? Model.find({}).sort({ updatedAt: -1 }).limit(limit).lean()
    : Promise.resolve([]);
};

// Provide latest materials preview if needed by the frontend
export const latestMaterials = (limit = 6) =>
  Material.find({}).sort({ createdAt: -1 }).limit(limit).lean();

// Count enquiries (admin leads)
export const countLeads = () => {
  const Model = mongoose.models.Lead || BrochureLead;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

export default {
  countProducts,
  countCategories,
  countBrands,
  countMaterials,
  countSubcategories,
  countMachineComponents,
  countSemiFinishedProducts,
  countBrochureDownloads,
  countLeads,
  countDrawingRequests,
  countEnquiries,
  countMediaLibrary,
  countUsers,
  countRoles,
  countContent,
  latestProducts,
  latestLeads,
  latestDownloads,
  latestMaterials,
  latestContent,
};
