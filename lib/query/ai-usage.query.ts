import { useQuery } from "@tanstack/react-query";
import { getAiUsage } from "../api/ai-usage.api";

export function useAiUsage() {
  return useQuery({
    queryKey: ["ai-usage"],
    queryFn: async () => getAiUsage(),
  })
}
