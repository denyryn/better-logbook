import { useQuery } from "@tanstack/react-query";
import { getPositions, getPositionsByCompany } from "../api/position.api";

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => getPositions(),
  });
}

export function usePositionsByCompany(companyId: string) {
  return useQuery({
    queryKey: ["positions", companyId],
    queryFn: () => getPositionsByCompany(companyId),
    enabled: !!companyId,
  });
}
