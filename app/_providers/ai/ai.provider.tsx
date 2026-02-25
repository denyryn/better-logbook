import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

import type {
  ExpectedImprovedLogbookEntryResponse,
  ExpectedProduceLogbookDetailsResponse,
} from "@/lib/ai/instructions/entry.logbook";
import { ApiResponse, status } from "@/lib/api.response";
import { LogbookAIService } from "@/services/ai.generate.service";

export type AIResponse = {
  improvedText?: ExpectedImprovedLogbookEntryResponse;
  logbookDetails?: ExpectedProduceLogbookDetailsResponse;
};

interface AiContextType {
  state: "idle" | "loading" | "success" | "error";
  response: AIResponse | null;
  improveLogbookText: (logbookText: string) => Promise<void>;
  produceLogbookDetails: (logbookText: string) => Promise<void>;
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

      setResponse({ improvedText: response.data });
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

  const handleProduceLogbookDetails = async (logbookText: string) => {
    setState("loading");
    try {
      const response = (await new LogbookAIService(
        logbookText,
      ).produceLogbookDetails("client")) as ApiResponse<string>;

      if (response.status === status.ERROR) {
        setState("error");
        toast.error("Failed to produce logbook details. Please try again.");
        return;
      }

      setResponse({ logbookDetails: JSON.parse(response.data) });
      setState("success");
      toast.success("Logbook details produced successfully!");
    } catch (err) {
      setState("error");
      toast.error("Failed to produce logbook details. Please try again.");
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
        improveLogbookText: handleImproveLogbookText,
        produceLogbookDetails: handleProduceLogbookDetails,
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
