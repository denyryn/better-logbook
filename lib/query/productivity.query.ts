import { useQuery } from "@tanstack/react-query";
import { getProductivitiesByLogbook } from "../api/productivity.api";
import { queryKey } from "../constants/query-key.constant";

export function useProductivitiesByLogbook() {
  return useQuery({
    queryKey: [queryKey.PRODUCTIVITIES],
    queryFn: () => getProductivitiesByLogbook(),
  });
}
