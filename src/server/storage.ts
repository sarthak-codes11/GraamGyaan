import fs from "fs";
import path from "path";

export type UploadItemBase = {
  id: string; // uuid or timestamp-based id
  type: "note" | "video";
  title: string;
  description?: string;
  fileName: string; // stored filename on disk
  relativePath: string; // e.g. /uploads/notes/abc.pdf
  teacherId?: string;
  uploadedAt: string; // ISO string
  unitNumber?: number; // for linking notes/videos to units
};

export type UploadDB = {
  notes: UploadItemBase[];
  videos: UploadItemBase[];
};

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const getProjectRoot = () => path.resolve(process.cwd());
export const getPublicDir = () => path.join(getProjectRoot(), "public");
export const getDataDir = () => path.join(getProjectRoot(), "data");
export const getDataFilePath = () => path.join(getDataDir(), "uploads.json");

export const readDB = (): UploadDB => {
  ensureDir(getDataDir());
  const file = getDataFilePath();
  if (!fs.existsSync(file)) {
    const empty: UploadDB = { notes: [], videos: [] };
    fs.writeFileSync(file, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as UploadDB;
    if (!parsed.notes) parsed.notes = [];
    if (!parsed.videos) parsed.videos = [];
    return parsed;
  } catch {
    return { notes: [], videos: [] };
  }
};

export const writeDB = (db: UploadDB) => {
  ensureDir(getDataDir());
  fs.writeFileSync(getDataFilePath(), JSON.stringify(db, null, 2), "utf8");
};

export const addItem = (item: UploadItemBase) => {
  const db = readDB();
  if (item.type === "note") db.notes.push(item); else db.videos.push(item);
  writeDB(db);
  return item;
};

export const deleteItem = (id: string, type: "note" | "video") => {
  const db = readDB();
  const list = type === "note" ? db.notes : db.videos;
  const idx = list.findIndex((x) => x.id === id);
  if (idx !== -1) {
    const [removed] = list.splice(idx, 1);
    writeDB(db);
    return removed;
  }
  return null;
};

export const updateItem = (
  id: string,
  type: "note" | "video",
  patch: Partial<Pick<UploadItemBase, "title" | "description">>
) => {
  const db = readDB();
  const list = type === "note" ? db.notes : db.videos;
  const item = list.find((x) => x.id === id);
  if (!item) return null;
  if (typeof patch.title === "string") item.title = patch.title;
  if (typeof patch.description === "string") item.description = patch.description;
  writeDB(db);
  return item;
};
