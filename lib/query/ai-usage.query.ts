import { useQuery } from "@tanstack/react-query";
import { getAiUsage } from "../api/ai-usage.api";
import { queryKey } from "../constants/query-key.constant";

export function useAiUsage() {
  return useQuery({
    queryKey: [queryKey.AI_USAGE],
    queryFn: async () => getAiUsage(),
  })
}
