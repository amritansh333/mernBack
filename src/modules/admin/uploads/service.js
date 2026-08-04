export const processSingle = async (file, folder = "misc") => {
  if (!file) throw { status: 400, message: "file required" };
  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${folder}/${file.filename}`,
  };
};

export const processMultiple = async (files, folder = "misc") => {
  if (!files || files.length === 0) throw { status: 400, message: "files required" };
  return files.map((file) => ({ filename: file.filename, originalname: file.originalname, mimetype: file.mimetype, size: file.size, url: `/uploads/${folder}/${file.filename}` }));
};

export default { processSingle, processMultiple };
