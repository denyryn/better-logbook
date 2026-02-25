import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

import { ApiResponse, status } from "@/lib/api.response";
import { LogbookAIService } from "@/services/ai.generate.service";

interface AiContextType {
  state: "idle" | "loading" | "success" | "error";
  response: string | null;
  improve: (logbookText: string) => Promise<void>;
}

export const AiContext = createContext<AiContextType | null>(null);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AiContextType["state"]>("idle");
  const [response, setResponse] = useState<AiContextType["response"] | null>(
    null,
  );

  const handleImproveLogbookText = async (logbookText: string) => {
    setState("loading");
    try {
      const response = (await new LogbookAIService(logbookText).improveText(
        "client",
      )) as ApiResponse<string>;

      if (response.status === status.ERROR) {
        setState("error");
        toast.error("Failed to improve logbook text. Please try again.");
        return;
      }

      setResponse(response.data);
      setState("success");
      toast.success("Logbook text improved successfully!");
    } catch (err) {
      setState("error");
      toast.error("Failed to improve logbook text. Please try again.");
      console.error("AI request failed:", err);
    } finally {
      setState("idle");
    }
  };

  return (
    <AiContext.Provider
      value={{
        state,
        response: response,
        improve: handleImproveLogbookText,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
}
