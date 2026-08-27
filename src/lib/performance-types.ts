export interface PerformanceImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

export interface PerformanceEntry {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: PerformanceImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePerformancePayload {
  title: string;
  description: string;
  tags: string[];
  images: PerformanceImage[];
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const VALID_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
