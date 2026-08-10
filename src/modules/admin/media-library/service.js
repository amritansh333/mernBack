import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export const listMedia = async ({ page = 1, limit = 10, search = "" }) => {
  const folders = await fs.readdir(UPLOAD_ROOT).catch(() => []);
  const items = [];

  for (const folder of folders) {
    const folderPath = path.join(UPLOAD_ROOT, folder);
    const stat = await fs.stat(folderPath).catch(() => null);
    if (!stat || !stat.isDirectory()) continue;
    const files = await fs.readdir(folderPath).catch(() => []);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fstat = await fs.stat(filePath).catch(() => null);
      if (!fstat || !fstat.isFile()) continue;
      const item = {
        filename: file,
        folder,
        url: `/uploads/${folder}/${file}`,
        size: fstat.size,
        updatedAt: fstat.mtime,
      };
      if (!search || file.toLowerCase().includes(search.toLowerCase()))
        items.push(item);
    }
  }

  // sort by updatedAt desc
  items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (Math.max(1, page) - 1) * limit;
  const rows = items.slice(start, start + limit);

  return { rows, pagination: { page, limit, total, pages } };
};

export const countMedia = async () => {
  const folders = await fs.readdir(UPLOAD_ROOT).catch(() => []);
  let total = 0;
  for (const folder of folders) {
    const folderPath = path.join(UPLOAD_ROOT, folder);
    const stat = await fs.stat(folderPath).catch(() => null);
    if (!stat || !stat.isDirectory()) continue;
    const files = await fs.readdir(folderPath).catch(() => []);
    total += files.length;
  }
  return total;
};

export const getMediaItem = async (folder, filename) => {
  const filePath = path.join(UPLOAD_ROOT, folder, filename);
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat || !stat.isFile()) return null;
  return {
    filename,
    folder,
    url: `/uploads/${folder}/${filename}`,
    size: stat.size,
    updatedAt: stat.mtime,
  };
};

export default { listMedia, countMedia, getMediaItem };
