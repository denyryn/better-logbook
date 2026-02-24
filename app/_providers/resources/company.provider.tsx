import { Company } from "@/generated/prisma/client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { CompanyService } from "@/services/company";
import { useAuth } from "../auth/auth.provider";
import { status } from "@/lib/api.response";
import { toast } from "sonner";
import { CompanyWithPositions } from "@/types/prisma/companies";

interface CompanyContextType {
  companies: CompanyWithPositions[];
  isLoading: boolean;
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
  const { user, isLoading: authLoading } = useAuth();
  const [companies, setCompanies] = useState<CompanyWithPositions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const serviceRef = useRef<CompanyService | null>(null);

  // Initialize service once user is available
  useEffect(() => {
    try {
      if (user?.id && !serviceRef.current) {
        serviceRef.current = new CompanyService(user.id);
      }
    } finally {
      setIsLoading(false);
      getCompanies();
    }
  }, [user, authLoading]);

  const getCompanies = useCallback(async () => {
    if (!serviceRef.current) {
      console.warn("CompanyService not initialized");
      return;
    }

    try {
      const response = await serviceRef.current.get();
      if (Array.isArray(response.data)) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      toast.error("Failed to fetch companies. Please try again.");
    }
  }, []);

  const addCompany = async (company: Partial<Company>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.post(company);

    if (response.status === status.ERROR) {
      console.error("Failed to add company:", response.message);
      toast.error("Failed to add company. Please try again.");
      return;
    }

    toast.success("Company added successfully!");
    await getCompanies();
  };

  const updateCompany = async (
    companyId: string,
    company: Partial<Company>,
  ) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.put(companyId, company);

    if (response.status === status.ERROR) {
      console.error("Failed to update company:", response.message);
      toast.error("Failed to update company. Please try again.");
      return;
    }

    toast.success("Company updated successfully!");
    await getCompanies();
  };

  const deleteCompany = async (companyId: string) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.delete(companyId);

    if (response.status === status.ERROR) {
      console.error("Failed to delete company:", response.message);
      toast.error("Failed to delete company. Please try again.");
      return;
    }

    toast.success("Company deleted successfully!");
    await getCompanies();
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        isLoading,
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
