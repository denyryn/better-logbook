import { Company } from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";
import { CompanyService } from "@/services/company";
import { status } from "@/lib/api.response";
import { toast } from "sonner";

interface CompanyContextType {
  companies: Company[];
  getCompanies: () => Promise<void>;
  addCompany: (company: Partial<Company>) => Promise<void>;
  updateCompany: (
    companyId: string,
    company: Partial<Company>,
  ) => Promise<void>;
  deleteCompany: (companyId: string) => Promise<void>;
}

export const CompanyContext = createContext<CompanyContextType | null>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const service = new CompanyService();
  const [companies, setCompanies] = useState<Company[]>([]);

  const getCompanies = async () => {
    try {
      const response = await service.get("");
      if (Array.isArray(response.data)) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      toast.error("Failed to fetch companies. Please try again.");
    }
  };

  const addCompany = async (company: Partial<Company>) => {
    const response = await service.post(company);

    if (response.status === status.ERROR) {
      console.error("Failed to add company:", response.message);
      toast.error("Failed to add company. Please try again.");
      return;
    }

    toast.success("Company added successfully!");
    getCompanies();
  };

  const updateCompany = async (
    companyId: string,
    company: Partial<Company>,
  ) => {
    const response = await service.put(companyId, company);

    if (response.status === status.ERROR) {
      console.error("Failed to update company:", response.message);
      toast.error("Failed to update company. Please try again.");
      return;
    }

    toast.success("Company updated successfully!");
    getCompanies();
  };

  const deleteCompany = async (companyId: string) => {
    const response = await service.delete(companyId);

    if (response.status === status.ERROR) {
      console.error("Failed to delete company:", response.message);
      toast.error("Failed to delete company. Please try again.");
      return;
    }

    toast.success("Company deleted successfully!");
    getCompanies();
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        getCompanies,
        addCompany,
        updateCompany,
        deleteCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
