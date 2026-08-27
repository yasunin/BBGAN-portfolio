import { PerformanceGallery } from "@/components/PerformanceGallery";
import { getAllEntries } from "@/lib/performance-db";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const entries = await getAllEntries();

  return <PerformanceGallery entries={entries} />;
}
