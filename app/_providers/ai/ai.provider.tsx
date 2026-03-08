"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

import type {
  ExpectedImprovedLogbookEntryResponse,
  ExpectedProduceLogbookDetailsResponse,
} from "@/lib/ai/instructions/entry.logbook";
import { ApiResponse, errorResponse, status, successResponse } from "@/lib/api.response";
import { LogbookAIService } from "@/services/ai.generate.service";
import { useAiUsage } from "@/lib/query/ai-usage.query";
import { TokenCalculator } from "@/lib/ai/token.calculator";

export type AIResponse = {
  improvedText?: ExpectedImprovedLogbookEntryResponse;
  logbookDetails?: ExpectedProduceLogbookDetailsResponse;
};

interface AiContextType {
  state: "idle" | "loading" | "success" | "error";
  response: AIResponse | null;
  improveLogbookText: (logbookText: string) => Promise<ApiResponse<ExpectedImprovedLogbookEntryResponse | undefined>>;
  produceLogbookDetails: (logbookText: string) => Promise<ApiResponse<ExpectedProduceLogbookDetailsResponse | undefined>>;
}

export const AiContext = createContext<AiContextType | null>(null);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AiContextType["state"]>("idle");
  const [response, setResponse] = useState<AiContextType["response"] | null>(
    null,
  );
  const { data: aiUsageData } = useAiUsage();

  const tokens = new TokenCalculator(aiUsageData?.data)
  const usedTokenPercentage = tokens.calculateRemainingPercentage();

  const handleImproveLogbookText = async (logbookText: string) => {
    setState("loading");
    try {
      if (usedTokenPercentage <= 0) return errorResponse(undefined, "You exceeded ai usage limit.") as ApiResponse<undefined>;

      const response = (await new LogbookAIService(logbookText).improveText(
        "client",
      )) as ApiResponse<string>;

      if (response.status === status.ERROR) {
        setState("error");
        toast.error("Failed to improve logbook text. Please try again.");
        return errorResponse(undefined, "Failed to improve logbook text") as ApiResponse<undefined>;
      }

      setResponse(prev => ({ ...prev, improvedText: response.data }));
      setState("success");
      toast.success("Logbook text improved successfully!");

      return successResponse(response.data, "Logbook text improved successfully") as ApiResponse<ExpectedImprovedLogbookEntryResponse>;
    } catch (err) {
      setState("error");
      toast.error("Failed to improve logbook text. Please try again.");
      console.error("AI request failed:", err);

      return errorResponse(undefined, "Failed to improve logbook text") as ApiResponse<undefined>;
    } finally {
      setState("idle");
    }
  };

  const handleProduceLogbookDetails = async (logbookText: string) => {
    setState("loading");
    try {
      if (usedTokenPercentage === 0) return errorResponse(undefined, "You exceeded ai usage limit.") as ApiResponse<undefined>;

      const response = (await new LogbookAIService(
        logbookText,
      ).produceLogbookDetails("client")) as ApiResponse<string>;

      if (response.status === status.ERROR) {
        setState("error");
        toast.error("Failed to produce logbook details. Please try again.");
        return errorResponse(undefined, "Failed to produce logbook details") as ApiResponse<undefined>;
      }

      setResponse(prev => ({ ...prev, logbookDetails: JSON.parse(response.data) }));
      setState("success");
      toast.success("Logbook details produced successfully!");

      return successResponse(JSON.parse(response.data), "Logbook details produced successfully") as ApiResponse<ExpectedProduceLogbookDetailsResponse>;
    } catch (err) {
      setState("error");
      toast.error("Failed to produce logbook details. Please try again.");
      console.error("AI request failed:", err);

      return errorResponse(undefined, "Failed to produce logbook details") as ApiResponse<undefined>;
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
