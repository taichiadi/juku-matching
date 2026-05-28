export const preferredRegion = "nrt1";

import { requireAdmin } from "@/lib/requireAdmin";
import GenerateMessagesClient from "./GenerateMessagesClient";

export default async function AdminGenerateMessagesPage() {
  await requireAdmin("/admin/generate-messages");
  return <GenerateMessagesClient />;
}
