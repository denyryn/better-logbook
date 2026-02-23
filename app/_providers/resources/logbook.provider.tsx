import { Logbook } from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";
import { LogbookService } from "@/services/logbook";
import { useAuth } from "../auth/auth.provider";
import { status } from "@/lib/api.response";
import { toast } from "sonner";

interface LogbookContextType {
  logbooks: Logbook[];
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
  const { user } = useAuth();

  if (!user) {
    throw new Error("LogbookProvider requires an authenticated user");
  }

  const service = new LogbookService(user?.id);
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);

  const getLogbooks = async () => {
    const response = await service.get();
    setLogbooks(response.data.logbooks);
  };

  const addLogbook = async (logbook: Partial<Logbook>) => {
    const response = await service.post(logbook);

    if (response.status === status.ERROR) {
      console.error("Failed to add logbook entry:", response.message);
      toast.error("Failed to add logbook entry. Please try again.");
      return;
    }

    toast.success("Logbook entry added successfully!");
    getLogbooks();
  };

  const updateLogbook = async (id: string, logbook: Partial<Logbook>) => {
    const response = await service.put(logbook, id);

    if (response.status === status.ERROR) {
      console.error("Failed to update logbook entry:", response.message);
      toast.error("Failed to update logbook entry. Please try again.");
      return;
    }

    toast.success("Logbook entry updated successfully!");
    getLogbooks();
  };

  const deleteLogbook = async (logbookId: string) => {
    const response = await service.delete(logbookId);

    if (response.status === status.ERROR) {
      console.error("Failed to delete logbook entry:", response.message);
      toast.error("Failed to delete logbook entry. Please try again.");
      return;
    }

    toast.success("Logbook entry deleted successfully!");
    getLogbooks();
  };

  return (
    <LogbookContext.Provider
      value={{
        logbooks,
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
