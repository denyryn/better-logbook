import { useMutation, useQueryClient } from "@tanstack/react-query";
import { improveText, produceLogbookDetails } from "../api/ai-generate.api";
import { toast } from "sonner";
import { ApiResponse } from "../api.response";
import { ExpectedProduceLogbookDetailsResponse } from "../ai/instructions/entry.logbook";

export function useImproveText() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string): Promise<ApiResponse<string>> => improveText("client", text) as Promise<ApiResponse<string>>,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["improvedText"] });
      toast.success("Text improved successfully!");
    },

    onError: (error) => {
      console.error("Error improving text: ", error);
      toast.error("Failed to improve text. " + error.message);
    }
  })
}

export function useProduceLogbookDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string): Promise<ApiResponse<ExpectedProduceLogbookDetailsResponse>> => produceLogbookDetails("client", text) as Promise<ApiResponse<ExpectedProduceLogbookDetailsResponse>>,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logbookDetails"] });
      toast.success("Logbook details produced successfully!");
    },

    onError: (error) => {
      console.error("Error producing logbook details: ", error);
      toast.error("Failed to produce logbook details. " + error.message);
    }
  })
}
