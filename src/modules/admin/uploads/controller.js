import * as service from "./service.js";

export const getUploadsRoot = async (req, res) => {
  return res.apiSuccess({ message: "Uploads admin endpoint. Use POST /single to upload." }, "Uploads endpoint");
};

export const uploadSingle = async (req, res) => {
  const folder = req.query.folder || "misc";
  const info = await service.processSingle(req.file, folder);
  return res.apiSuccess(info, "File uploaded");
};

export const uploadMultiple = async (req, res) => {
  const folder = req.query.folder || "misc";
  const info = await service.processMultiple(req.files || [], folder);
  return res.apiSuccess(info, "Files uploaded");
};

export default { getUploadsRoot, uploadSingle, uploadMultiple };
