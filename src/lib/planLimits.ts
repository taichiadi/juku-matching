export type PlanType = "free" | "standard" | "pro";

export const PLAN_LABELS: Record<PlanType, string> = {
  free: "フリー",
  standard: "スタンダード",
  pro: "プロ",
};

export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  standard: 1980,
  pro: 4980,
};

export type UsageLimits = {
  questions: number | null;   // null = unlimited
  corrections: number | null;
  consultations: number | null;
  studyPlans: boolean;
  aiProblems: boolean;
  priorityReply: boolean;
  focusRoom: boolean;
};

export const PLAN_LIMITS: Record<PlanType, UsageLimits> = {
  free: {
    questions: 0,
    corrections: 0,
    consultations: 1,
    studyPlans: false,
    aiProblems: false,
    priorityReply: false,
    focusRoom: false,
  },
  standard: {
    questions: 10,
    corrections: 1,
    consultations: 2,
    studyPlans: false,
    aiProblems: false,
    priorityReply: false,
    focusRoom: true,
  },
  pro: {
    questions: null,
    corrections: null,
    consultations: null,
    studyPlans: true,
    aiProblems: true,
    priorityReply: true,
    focusRoom: true,
  },
};

export function getPlanType(meta: Record<string, unknown>): PlanType {
  const p = meta?.plan_type;
  if (p === "standard" || p === "pro") return p;
  return "free";
}

export function canUseService(
  plan: PlanType,
  service: "questions" | "corrections" | "consultations",
  usedThisMonth: number
): { allowed: boolean; limit: number | null; remaining: number | null } {
  const limit = PLAN_LIMITS[plan][service];
  if (limit === null) return { allowed: true, limit: null, remaining: null };
  const remaining = Math.max(0, limit - usedThisMonth);
  return { allowed: remaining > 0, limit, remaining };
}
