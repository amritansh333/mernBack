import mongoose from "mongoose";

const { Schema } = mongoose;

const SystemLogSchema = new Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  level: { type: String, index: true },
  message: { type: String, index: true },
  meta: { type: Schema.Types.Mixed },
  source: { type: String },
  context: { type: Schema.Types.Mixed },
});

export default mongoose.models.SystemLog ||
  mongoose.model("SystemLog", SystemLogSchema);
