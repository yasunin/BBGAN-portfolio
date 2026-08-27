import type { Metadata } from "next";
import { PerformanceAdmin } from "@/components/PerformanceAdmin";

export const metadata: Metadata = {
  title: "Performance Admin | BBGAN309",
  robots: { index: false, follow: false },
};

export default function PerformanceAdminPage() {
  return <PerformanceAdmin />;
}
