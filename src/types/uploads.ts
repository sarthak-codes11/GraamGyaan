export type UploadItem = {
  id: string;
  type: "note" | "video";
  title: string;
  description?: string;
  fileName: string;
  relativePath: string; // begins with /uploads/...
  teacherId?: string;
  uploadedAt: string; // ISO
  unitNumber?: number;
};
