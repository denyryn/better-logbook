import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPosition, getPositions, getPositionsByCompany } from "../api/position.api";
import { Position } from "@/generated/prisma/browser";

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

export function useCreatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, positionData }: { companyId: string; positionData: Partial<Position> }) =>
      createPosition(companyId, positionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}
