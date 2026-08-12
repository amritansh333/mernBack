import Product from "../../../models/Product.js";
import Category from "../../../models/Category.js";
import Brand from "../../../models/Brand.js";
import Material from "../../../models/Material.js";
import Enquiry from "../../../models/Enquiry.js";
import SubCategory from "../../../models/SubCategory.js";
import Industry from "../../../models/Industry.js";
import BlogPost from "../../../models/BlogPost.js";
import User from "../users/User.js";
import mongoose from "mongoose";
import BrochureLead from "../../brochure/models/Lead.js";
import * as mediaService from "../media-library/service.js";
import CatalogRequest from "../../../models/CatalogRequest.js";

export const countProducts = () => Product.countDocuments({});
export const countCategories = () => Category.countDocuments({});
export const countBrands = () => Brand.countDocuments({});
export const countMaterials = () => Material.countDocuments({});
export const countSubcategories = () =>
  SubCategory ? SubCategory.countDocuments({}) : Promise.resolve(0);

// Brochure downloads / leads come from the brochure Lead model
export const countBrochureDownloads = () => {
  // If model isn't registered for some deployments, fallback to 0
  const Model = mongoose.models.Lead || BrochureLead;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

// Additional optional counts: drawing requests, quote requests, media library, users, roles
export const countDrawingRequests = () => {
  const Model = mongoose.models.DrawingRequest;
  return Model ? Model.countDocuments({}) : Promise.resolve(0);
};

export const countEnquiries = () => {
  // Count enquiries (single source-of-truth collection).
  return Enquiry ? Enquiry.countDocuments({}) : Promise.resolve(0);
};

export const countCatalogRequests = () => CatalogRequest.countDocuments({});

export const countIndustries = () => Industry.countDocuments({});

export const countBlog = () => BlogPost.countDocuments({});

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

export const countUsers = () => User.countDocuments({});

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
  countBrochureDownloads,
  countLeads,
  countDrawingRequests,
  countEnquiries,
  countCatalogRequests,
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
