import path from "path";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storageFor = (subfolder) => {
  const dest = path.join(__dirname, "..", "public", "uploads", subfolder);
  ensureFolder(dest);

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname) || "";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      cb(null, name);
    },
  });
};

export const uploadSingle = (subfolder, fieldName = "image") => {
  return multer({ storage: storageFor(subfolder) }).single(fieldName);
};

export default { uploadSingle };
