import { useQuery } from "@tanstack/react-query";
import { getProductivitiesByLogbook } from "../api/productivity.api";

export function useProductivitiesByLogbook() {
  return useQuery({
    queryKey: ["productivities"],
    queryFn: () => getProductivitiesByLogbook(),
  });
}
