"use client";

import { useEffect } from "react";
import { markRepliesRead } from "./actions";

export default function MarkRepliesRead({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (ids.length > 0) {
      void markRepliesRead(ids);
    }
  // 初回マウント時のみ実行
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
