import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { addItem } from "~/server/storage";

export const config = {
  api: { bodyParser: false },
};

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = formidable({ multiples: true, keepExtensions: true });

  try {
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const raw = (files as any).file as File | File[] | undefined;
    const fileList: File[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (fileList.length === 0) return res.status(400).json({ error: "File missing" });

    const title = String(fields.title ?? "Untitled video");
    const description = fields.description ? String(fields.description) : undefined;
    const teacherId = fields.teacherId ? String(fields.teacherId) : undefined;

    const publicDir = path.join(process.cwd(), "public");
    const vidsDir = path.join(publicDir, "uploads", "videos");
    ensureDir(vidsDir);

    const unitNumberRaw = (fields as any).unitNumber ? Number(String((fields as any).unitNumber)) : undefined;
    const unitNumber = Number.isFinite(unitNumberRaw) ? (unitNumberRaw as number) : undefined;

    const savedItems = [] as any[];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]!;
      const origName = f.originalFilename ?? `video-${i + 1}.mp4`;
      const stamped = `${Date.now()}-${i}-${safeFilename(origName)}`;
      const destPath = path.join(vidsDir, stamped);
      await fs.promises.copyFile(f.filepath, destPath);
      await fs.promises.unlink(f.filepath).catch(() => {});
      const relativePath = `/uploads/videos/${stamped}`;
      const saved = addItem({
        id: `${Date.now()}-${i}`,
        type: "video",
        title: i === 0 ? title : `${title} (${i + 1})`,
        description,
        fileName: stamped,
        relativePath,
        teacherId,
        uploadedAt: new Date().toISOString(),
        unitNumber,
      });
      savedItems.push(saved);
    }

    return res.status(200).json({ ok: true, items: savedItems });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Upload failed" });
  }
}
