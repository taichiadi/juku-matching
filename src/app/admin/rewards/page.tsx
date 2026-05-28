export const preferredRegion = "nrt1";

import { requireAdmin } from "@/lib/requireAdmin";
import RewardsClient from "./RewardsClient";

export default async function AdminRewardsPage() {
  await requireAdmin("/admin/rewards");
  return <RewardsClient />;
}
