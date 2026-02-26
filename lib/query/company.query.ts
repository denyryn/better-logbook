import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Company } from "@/generated/prisma/client";

import { createCompany, getCompanies } from "../api/company.api";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companyData: Partial<Company>) => createCompany(companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
