"use client";

import {
  FormEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  FileImage,
  ImageIcon,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  MAX_FILE_SIZE,
  VALID_IMAGE_TYPES,
  formatFileSize,
  type PerformanceEntry,
  type PerformanceImage,
} from "@/lib/performance-types";

const MAX_IMAGES_PER_ENTRY = 12;

type Feedback = {
  type: "error" | "success";
  message: string;
};

type PendingPreview = {
  file: File;
  url: string;
};

async function readResponseError(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

async function getEntries(): Promise<PerformanceEntry[]> {
  const response = await fetch("/api/performance", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await readResponseError(response, "ไม่สามารถโหลดข้อมูลผลงานได้"));
  }

  const body = (await response.json()) as { entries?: PerformanceEntry[] };
  return Array.isArray(body.entries) ? body.entries : [];
}

export function PerformanceAdmin() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<PerformanceImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<PendingPreview[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const previews = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPendingPreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles]);

  useEffect(() => {
    let isCurrent = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/performance/session", {
          cache: "no-store",
        });
        const body = (await response.json()) as { authenticated?: boolean };
        if (!isCurrent || !body.authenticated) return;

        const loadedEntries = await getEntries();
        if (!isCurrent) return;
        setIsAuthenticated(true);
        setEntries(loadedEntries);
      } catch {
        if (isCurrent) {
          setFeedback({
            type: "error",
            message: "ไม่สามารถตรวจสอบสถานะการเข้าสู่ระบบได้",
          });
        }
      } finally {
        if (isCurrent) setIsCheckingSession(false);
      }
    }

    void checkSession();
    return () => {
      isCurrent = false;
    };
  }, []);

  const refreshEntries = async () => {
    setIsLoadingEntries(true);
    try {
      setEntries(await getEntries());
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "ไม่สามารถโหลดข้อมูลผลงานได้",
      });
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImages([]);
    setSelectedFiles([]);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      setFeedback({ type: "error", message: "กรุณากรอกรหัสผ่านแอดมิน" });
      return;
    }

    setIsLoggingIn(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/performance/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        throw new Error(
          await readResponseError(response, "ไม่สามารถเข้าสู่ระบบได้")
        );
      }

      setPassword("");
      setEntries(await getEntries());
      setIsAuthenticated(true);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "ไม่สามารถเข้าสู่ระบบได้",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const remaining = MAX_IMAGES_PER_ENTRY - images.length - selectedFiles.length;
    const validFiles = files.filter(
      (file) =>
        VALID_IMAGE_TYPES.includes(file.type) &&
        file.size > 0 &&
        file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length !== files.length) {
      setFeedback({
        type: "error",
        message: "รองรับ JPG, PNG, WEBP, GIF และไฟล์ละไม่เกิน 10 MB",
      });
    }
    if (remaining <= 0) {
      setFeedback({
        type: "error",
        message: `เพิ่มรูปภาพได้ไม่เกิน ${MAX_IMAGES_PER_ENTRY} รูปต่อรายการ`,
      });
    } else if (validFiles.length > remaining) {
      setFeedback({
        type: "error",
        message: `เลือกรูปภาพได้อีก ${remaining} รูป`,
      });
    }

    const filesToAdd = remaining > 0 ? validFiles.slice(0, remaining) : [];
    setSelectedFiles((current) => [...current, ...filesToAdd]);
    event.target.value = "";
  };

  const uploadFile = async (file: File): Promise<PerformanceImage> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/performance/upload", {
      method: "POST",
      body: formData,
    });
    if (response.status === 401) {
      setIsAuthenticated(false);
      throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
    }
    if (!response.ok) {
      throw new Error(await readResponseError(response, "ไม่สามารถอัปโหลดรูปภาพได้"));
    }

    const body = (await response.json()) as { image?: PerformanceImage };
    if (!body.image) throw new Error("ไม่พบข้อมูลรูปภาพที่อัปโหลด");
    return body.image;
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFeedback({ type: "error", message: "กรุณากรอกหัวข้อเรื่องและรายละเอียด" });
      return;
    }
    if (images.length + selectedFiles.length === 0) {
      setFeedback({ type: "error", message: "กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป" });
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    try {
      const uploadedImages: PerformanceImage[] = [];
      for (const file of selectedFiles) {
        uploadedImages.push(await uploadFile(file));
      }

      const response = await fetch(
        editingId ? `/api/performance/${editingId}` : "/api/performance",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            tags: [],
            images: [...images, ...uploadedImages],
          }),
        }
      );
      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
      }
      if (!response.ok) {
        throw new Error(
          await readResponseError(response, "ไม่สามารถบันทึกข้อมูลผลงานได้")
        );
      }

      const wasEditing = !!editingId;
      resetForm();
      await refreshEntries();
      setFeedback({
        type: "success",
        message: wasEditing ? "อัปเดตข้อมูลผลงานแล้ว" : "เพิ่มผลงานแล้ว",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "ไม่สามารถบันทึกข้อมูลผลงานได้",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (entry: PerformanceEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setDescription(entry.description);
    setImages(entry.images);
    setSelectedFiles([]);
    setFeedback(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (entry: PerformanceEntry) => {
    if (!window.confirm(`ต้องการลบผลงาน “${entry.title}” ใช่หรือไม่?`)) return;

    setDeletingId(entry.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/performance/${entry.id}`, {
        method: "DELETE",
      });
      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
      }
      if (!response.ok) {
        throw new Error(
          await readResponseError(response, "ไม่สามารถลบข้อมูลผลงานได้")
        );
      }

      if (editingId === entry.id) resetForm();
      await refreshEntries();
      setFeedback({ type: "success", message: "ลบข้อมูลผลงานแล้ว" });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "ไม่สามารถลบข้อมูลผลงานได้",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/performance/logout", { method: "POST" });
    resetForm();
    setEntries([]);
    setFeedback(null);
    setIsAuthenticated(false);
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <LoaderCircle className="animate-spin text-blue-400" size={30} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-10">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-7 shadow-2xl backdrop-blur-xl sm:p-9"
        >
          <Link
            href="/performance"
            className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            กลับไปหน้าผลงาน
          </Link>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/25">
            <LockKeyhole size={27} />
          </div>
          <h1 className="text-2xl font-bold text-white">Performance Admin</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            เข้าสู่ระบบเพื่อเพิ่ม แก้ไข หรือลบผลงาน
          </p>

          {feedback && (
            <div className="mt-5 flex gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">
              <AlertCircle className="mt-0.5 shrink-0" size={17} />
              <span>{feedback.message}</span>
            </div>
          )}

          <label className="mt-6 block text-sm font-medium text-slate-200">
            รหัสผ่านแอดมิน
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
              placeholder="กรอกรหัสผ่าน"
              disabled={isLoggingIn}
            />
          </label>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoggingIn ? <LoaderCircle className="animate-spin" size={18} /> : <LogIn size={18} />}
            {isLoggingIn ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-7 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-blue-600 uppercase dark:text-blue-400">
              Admin dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
              จัดการ Performance
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/performance"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <ArrowLeft size={16} />
              ดูหน้าผลงาน
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/30"
            >
              <LogOut size={16} />
              ออกจากระบบ
            </button>
          </div>
        </header>

        {feedback && (
          <div
            className={`mb-6 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300"
            }`}
          >
            <AlertCircle className="mt-0.5 shrink-0" size={17} />
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="grid gap-7 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <form
            ref={formRef}
            onSubmit={handleSave}
            className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? "แก้ไขผลงาน" : "เพิ่มผลงานใหม่"}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  ใส่รูปภาพ หัวข้อเรื่อง และรายละเอียด
                </p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={16} />
                  ยกเลิก
                </button>
              )}
            </div>

            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              หัวข้อเรื่อง
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={180}
                required
                placeholder="ตัวอย่าง: Dashboard วิเคราะห์ข้อมูล"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </label>

            <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              รายละเอียด
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={5000}
                required
                rows={5}
                placeholder="อธิบายผลงาน เทคโนโลยีที่ใช้ หรือหน้าที่รับผิดชอบ"
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </label>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  รูปภาพ <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {images.length + selectedFiles.length}/{MAX_IMAGES_PER_ENTRY} รูป
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                รองรับ JPG, PNG, WEBP, GIF ขนาดไม่เกิน 10 MB ต่อไฟล์
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFiles}
                className="sr-only"
                id="performance-images"
              />
              <label
                htmlFor="performance-images"
                className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
              >
                <Upload className="mb-2 text-blue-600 dark:text-blue-400" size={24} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  เลือกรูปภาพ
                </span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  เลือกได้หลายรูปพร้อมกัน
                </span>
              </label>

              {(images.length > 0 || pendingPreviews.length > 0) && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((current) =>
                            current.filter((currentImage) => currentImage.id !== image.id)
                          )
                        }
                        className="absolute right-2 top-2 rounded-lg bg-slate-950/75 p-1.5 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label={`ลบรูป ${image.name}`}
                      >
                        <X size={15} />
                      </button>
                      <span className="absolute inset-x-0 bottom-0 truncate bg-slate-950/70 px-2 py-1.5 text-[11px] text-white">
                        {image.name}
                      </span>
                    </div>
                  ))}
                  {pendingPreviews.map((preview, index) => (
                    <div
                      key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-blue-300 bg-slate-100 dark:border-blue-700 dark:bg-slate-800"
                    >
                      <img
                        src={preview.url}
                        alt={preview.file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles((current) =>
                            current.filter((_, fileIndex) => fileIndex !== index)
                          )
                        }
                        className="absolute right-2 top-2 rounded-lg bg-slate-950/75 p-1.5 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label={`นำรูป ${preview.file.name} ออก`}
                      >
                        <X size={15} />
                      </button>
                      <span className="absolute inset-x-0 bottom-0 truncate bg-blue-700/85 px-2 py-1.5 text-[11px] text-white">
                        รออัปโหลด · {formatFileSize(preview.file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : editingId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}
              {isSaving
                ? "กำลังบันทึก..."
                : editingId
                  ? "อัปเดตข้อมูล"
                  : "เพิ่มผลงาน"}
            </button>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  รายการผลงาน
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {entries.length} รายการ
                </p>
              </div>
              <button
                type="button"
                onClick={() => void refreshEntries()}
                disabled={isLoadingEntries}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 disabled:opacity-50 dark:hover:bg-slate-800"
                aria-label="รีเฟรชรายการผลงาน"
              >
                <LoaderCircle className={isLoadingEntries ? "animate-spin" : ""} size={18} />
              </button>
            </div>

            {isLoadingEntries && entries.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center text-slate-400">
                <LoaderCircle className="animate-spin" size={24} />
              </div>
            ) : entries.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 text-center dark:border-slate-700">
                <FileImage className="mb-3 text-slate-400" size={28} />
                <p className="font-medium text-slate-700 dark:text-slate-200">
                  ยังไม่มีรายการผลงาน
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  กรอกข้อมูลในฟอร์มด้านซ้ายเพื่อเพิ่มผลงานแรก
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="flex gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 dark:border-slate-800 dark:hover:border-blue-800"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      {entry.images[0] ? (
                        <img
                          src={entry.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageIcon size={22} />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-slate-900 dark:text-white">
                        {entry.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {entry.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(entry)}
                          disabled={isSaving || deletingId === entry.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/70"
                        >
                          <Pencil size={14} />
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(entry)}
                          disabled={isSaving || deletingId === entry.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/60"
                        >
                          {deletingId === entry.id ? (
                            <LoaderCircle className="animate-spin" size={14} />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          ลบ
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
