import { plants, careGroups } from "@/lib/data";
import { GlobalSearch } from "./GlobalSearch";
import type { CareGroup } from "@/types";

export function GlobalSearchWrapper() {
  const careGroupMap = Object.fromEntries(
    careGroups.map((g) => [g.id, g])
  ) as Record<string, CareGroup>;

  return <GlobalSearch plants={plants} careGroupMap={careGroupMap} />;
}
