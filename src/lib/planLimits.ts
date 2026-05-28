export type PlanType = "free" | "lite" | "pro";

export const PLAN_LABELS: Record<PlanType, string> = {
  free: "フリー",
  lite: "LITE",
  pro: "PRO",
};

export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  lite: 980,
  pro: 1980,
};

export type UsageLimits = {
  questions: number | null;      // 先輩への質問回数
  corrections: number | null;    // 添削回数
  consultations: number | null;  // 単発相談回数(都度払い別)
  currentCheck: boolean;         // 現在地チェック使い放題
  branchingDB: boolean;          // 分岐点DB閲覧
  studyPlans: boolean;           // 学習計画表
};

export const PLAN_LIMITS: Record<PlanType, UsageLimits> = {
  free: {
    questions: 0,
    corrections: 0,
    consultations: 0,
    currentCheck: false,
    branchingDB: false,
    studyPlans: false,
  },
  lite: {
    questions: 0,
    corrections: 0,
    consultations: 0,
    currentCheck: true,
    branchingDB: true,
    studyPlans: false,
  },
  pro: {
    questions: null,   // 無制限（プラン制廃止中）
    corrections: null, // 無制限（プラン制廃止中）
    consultations: null,
    currentCheck: true,
    branchingDB: true,
    studyPlans: true,
  },
};

export function getPlanType(meta: Record<string, unknown>): PlanType {
  const p = meta?.plan_type;
  if (p === "lite" || p === "pro") return p;
  return "free";
}

// プラン制廃止中 — 全ユーザーを "pro" 扱いにして全機能を開放
export function getEffectivePlan(_meta: Record<string, unknown>): PlanType {
  return "pro";
}

export function canUseFeature(
  plan: PlanType,
  feature: keyof Pick<UsageLimits, "currentCheck" | "branchingDB" | "studyPlans">
): boolean {
  return PLAN_LIMITS[plan][feature];
}

export function canUseService(
  plan: PlanType,
  service: "questions" | "corrections",
  usedThisMonth: number
): { allowed: boolean; limit: number | null; remaining: number | null } {
  const limit = PLAN_LIMITS[plan][service];
  if (limit === null) return { allowed: true, limit: null, remaining: null };
  if (limit === 0) return { allowed: false, limit: 0, remaining: 0 };
  const remaining = Math.max(0, limit - usedThisMonth);
  return { allowed: remaining > 0, limit, remaining };
}
