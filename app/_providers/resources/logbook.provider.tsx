import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Logbook } from "@/generated/prisma/client";
import { status } from "@/lib/api.response";
import { LogbookService } from "@/services/logbook";

import { useAuth } from "../auth/auth.provider";

interface LogbookContextType {
  logbooks: Logbook[];
  isLoading: boolean;
  getLogbooks: () => Promise<void>;
  addLogbook: (logbook: Partial<Logbook>) => Promise<void>;
  updateLogbook: (
    logbookId: string,
    logbook: Partial<Logbook>,
  ) => Promise<void>;
  deleteLogbook: (logbookId: string) => Promise<void>;
}

export const LogbookContext = createContext<LogbookContextType | null>(null);

export function LogbookProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const serviceRef = useRef<LogbookService | null>(null);

  // Initialize service once user is available
  useEffect(() => {
    try {
      if (user?.id && !serviceRef.current) {
        serviceRef.current = new LogbookService(user.id);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const getLogbooks = async () => {
    if (!serviceRef.current) return;

    try {
      const response = await serviceRef.current.get();
      if (response.data?.logbooks) {
        setLogbooks(response.data.logbooks);
      }
    } catch (error) {
      console.error("Failed to fetch logbooks:", error);
      toast.error("Failed to fetch logbooks");
    }
  };

  const addLogbook = async (logbook: Partial<Logbook>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.post(logbook);

    if (response.status === status.ERROR) {
      console.error("Failed to add logbook entry:", response.message);
      toast.error("Failed to add logbook entry. Please try again.");
      return;
    }

    toast.success("Logbook entry added successfully!");
    await getLogbooks();
  };

  const updateLogbook = async (id: string, logbook: Partial<Logbook>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.put(logbook, id);

    if (response.status === status.ERROR) {
      console.error("Failed to update logbook entry:", response.message);
      toast.error("Failed to update logbook entry. Please try again.");
      return;
    }

    toast.success("Logbook entry updated successfully!");
    await getLogbooks();
  };

  const deleteLogbook = async (logbookId: string) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.delete(logbookId);

    if (response.status === status.ERROR) {
      console.error("Failed to delete logbook entry:", response.message);
      toast.error("Failed to delete logbook entry. Please try again.");
      return;
    }

    toast.success("Logbook entry deleted successfully!");
    await getLogbooks();
  };

  return (
    <LogbookContext.Provider
      value={{
        logbooks,
        isLoading,
        getLogbooks,
        addLogbook,
        updateLogbook,
        deleteLogbook,
      }}
    >
      {children}
    </LogbookContext.Provider>
  );
}

export function useLogbook() {
  const context = useContext(LogbookContext);
  if (!context) {
    throw new Error("useLogbook must be used within a LogbookProvider");
  }
  return context;
}
