"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ImageIcon,
  Images,
  LockKeyhole,
  X,
} from "lucide-react";
import type { PerformanceEntry } from "@/lib/performance-types";

type SelectedImage = {
  entry: PerformanceEntry;
  index: number;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function PerformanceGallery({
  entries,
}: {
  entries: PerformanceEntry[];
}) {
  const [selected, setSelected] = useState<SelectedImage | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const markImageAsFailed = (url: string) => {
    setFailedImages((current) => new Set(current).add(url));
  };

  const selectedImage = selected?.entry.images[selected.index];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/70 px-4 pb-16 pt-24 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase dark:text-blue-400">
              Portfolio
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Performance
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              รวมผลงาน โปรเจกต์ และภาพตัวอย่างการพัฒนาของผม
            </p>
          </div>

          <Link
            href="/performance/admin"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
          >
            <LockKeyhole size={16} />
            Admin login
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="glass-card flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 rounded-2xl bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <ImageIcon size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ยังไม่มีผลงานในขณะนี้
            </h2>
            <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">
              ผู้ดูแลระบบสามารถเข้าสู่ระบบเพื่อเพิ่มผลงานและรูปภาพได้
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => {
              const cover = entry.images[0];
              const coverUnavailable = !cover || failedImages.has(cover.url);

              return (
                <article
                  key={entry.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => cover && setSelected({ entry, index: 0 })}
                    disabled={!cover}
                    className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100 text-left dark:bg-slate-800 disabled:cursor-default"
                    aria-label={cover ? `ดูรูปภาพของ ${entry.title}` : undefined}
                  >
                    {cover && !coverUnavailable ? (
                      <img
                        src={cover.url}
                        alt={entry.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={() => markImageAsFailed(cover.url)}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                        <ImageIcon size={34} />
                        <span className="text-sm">ไม่มีภาพตัวอย่าง</span>
                      </div>
                    )}
                    {entry.images.length > 1 && (
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur">
                        <Images size={14} />
                        {entry.images.length}
                      </span>
                    )}
                  </button>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {entry.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {entry.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {formatDate(entry.updatedAt ?? entry.createdAt)}
                      </span>
                      {cover && (
                        <button
                          type="button"
                          onClick={() => setSelected({ entry, index: 0 })}
                          className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          ดูผลงาน
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selected && selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`รูปภาพของ ${selected.entry.title}`}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  {selected.entry.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  รูปภาพ {selected.index + 1} จาก {selected.entry.images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="ปิดหน้าต่างรูปภาพ"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex max-h-[68vh] min-h-64 items-center justify-center bg-slate-100 p-3 dark:bg-slate-950">
              {failedImages.has(selectedImage.url) ? (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <ImageIcon size={36} />
                  <span>ไม่สามารถแสดงรูปภาพนี้ได้</span>
                </div>
              ) : (
                <img
                  src={selectedImage.url}
                  alt={`${selected.entry.title} ภาพที่ ${selected.index + 1}`}
                  className="max-h-[64vh] max-w-full rounded-lg object-contain"
                  onError={() => markImageAsFailed(selectedImage.url)}
                />
              )}
            </div>

            {selected.entry.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-slate-200 p-3 dark:border-slate-800">
                {selected.entry.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelected({ entry: selected.entry, index })}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      index === selected.index
                        ? "border-blue-500"
                        : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                    aria-label={`เลือกภาพที่ ${index + 1}`}
                  >
                    {failedImages.has(image.url) ? (
                      <span className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <ImageIcon size={18} />
                      </span>
                    ) : (
                      <img
                        src={image.url}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => markImageAsFailed(image.url)}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
