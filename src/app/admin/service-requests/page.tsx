export const preferredRegion = "nrt1";

import { requireAdmin } from "@/lib/requireAdmin";
import ServiceRequestsClient from "./ServiceRequestsClient";

export default async function AdminServiceRequestsPage() {
  await requireAdmin("/admin/service-requests");
  return <ServiceRequestsClient />;
}
