import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { readDB, writeDB, updateItem, deleteItem } from "~/server/storage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = (req.query.type as string) === "video" ? "video" : "note";

  try {
    if (req.method === "GET") {
      const db = readDB();
      const items = type === "note" ? db.notes : db.videos;
      return res.status(200).json({ ok: true, items });
    }

    if (req.method === "PATCH") {
      const { id, title, description } = req.body as { id?: string; title?: string; description?: string };
      if (!id) return res.status(400).json({ error: "Missing id" });
      const updated = updateItem(id, type, { title, description });
      if (!updated) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ok: true, item: updated });
    }

    if (req.method === "DELETE") {
      const { id } = req.query as { id?: string };
      if (!id) return res.status(400).json({ error: "Missing id" });
      const removed = deleteItem(id, type);
      if (!removed) return res.status(404).json({ error: "Not found" });
      // also remove actual file from disk if exists
      const filePath = path.join(process.cwd(), "public", removed.relativePath.replace(/^\/?/, ""));
      try {
        if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
      } catch {}
      return res.status(200).json({ ok: true, item: removed });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Server error" });
  }
}
