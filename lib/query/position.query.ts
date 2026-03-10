import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPosition, getPositions, getPositionsByCompany } from "../api/position.api";
import { Position } from "@/generated/prisma/browser";
import { queryKey } from "../constants/query-key.constant";

export function usePositions() {
  return useQuery({
    queryKey: [queryKey.POSITIONS],
    queryFn: () => getPositions(),
  });
}

export function usePositionsByCompany(companyId: string) {
  return useQuery({
    queryKey: [queryKey.POSITIONS, companyId],
    queryFn: () => getPositionsByCompany(companyId),
    enabled: !!companyId,
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, positionData }: { companyId: string; positionData: Partial<Position> }) =>
      createPosition(companyId, positionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.POSITIONS] });
    },
  });
}
