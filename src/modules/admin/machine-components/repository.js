import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mcSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: { type: [String], default: [] },
    applications: { type: [String], default: [] },
    specifications: { type: Map, of: Schema.Types.Mixed, default: {} },
    downloads: { type: [{ label: String, url: String }], default: [] },
    order: { type: Number, default: 99 },
    isVisible: { type: Boolean, default: true },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);

const Model =
  mongoose.models.MachineComponentAdmin ||
  mongoose.model("MachineComponentAdmin", mcSchema);

export const count = (query) => Model.countDocuments(query);
export const find = (query, { sort = {}, skip = 0, limit = 50 } = {}) =>
  Model.find(query).sort(sort).skip(skip).limit(limit).lean();
export const findById = (id) => Model.findById(id).lean();
export const findOne = (query) => Model.findOne(query).lean();
export const create = (payload) => Model.create(payload);
export const updateById = (id, payload, opts = { new: true }) =>
  Model.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => Model.findByIdAndDelete(id).lean();

export default {
  count,
  find,
  findById,
  findOne,
  create,
  updateById,
  deleteById,
};
