export const preferredRegion = "nrt1";

import { requireAdmin } from "@/lib/requireAdmin";
import ExperiencesClient from "./ExperiencesClient";

export default async function AdminPage() {
  await requireAdmin("/admin");
  return <ExperiencesClient />;
}
