import Product from "../../../models/Product.js";
import Enquiry from "../../../models/Enquiry.js";

export const count = (query) => Product.countDocuments(query);

export const find = (query, { sort = {}, skip = 0, limit = 50, populate = [] } = {}) => {
  let q = Product.find(query).sort(sort).skip(skip).limit(limit).lean();
  populate.forEach((p) => { q = q.populate(p); });
  return q;
};

export const findById = (id, populate = []) => {
  let q = Product.findById(id).lean();
  populate.forEach((p) => { q = q.populate(p); });
  return q;
};

export const findOne = (query) => Product.findOne(query).lean();

export const create = (payload) => Product.create(payload);

export const updateById = (id, payload, opts = { new: true }) =>
  Product.findByIdAndUpdate(id, payload, opts).lean();

export const deleteById = (id) => Product.findByIdAndDelete(id).lean();

export const deleteMany = (ids) => Product.deleteMany({ _id: { $in: ids } });

export const updateMany = (ids, patch) => Product.updateMany({ _id: { $in: ids } }, { $set: patch });

export const findEnquiriesByProductName = (productName, limit = 5) =>
  Enquiry.find({ product: { $regex: productName, $options: "i" } }).sort({ createdAt: -1 }).limit(limit).lean();

export default { count, find, findById, findOne, create, updateById, deleteById, deleteMany, updateMany, findEnquiriesByProductName };
