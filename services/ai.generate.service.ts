import { improveLogbookEntryInstructions, produceLogbookDetailsInstructions } from "@/lib/ai/instructions/entry.logbook";
import { ApiResponse, status } from "@/lib/api.response";
import { api } from "@/lib/axios";
import { AIProviderPrompts } from "@/lib/ai/providers/ai.provider.interface";

export class LogbookAIService {
  private text?: string;

  constructor(text?: string) {
    this.text = text;
  }

  private async callApi(
    prompts: AIProviderPrompts,
  ): Promise<ApiResponse<string>> {
    const { data } = await api.post<ApiResponse<string>>("/api/ai", prompts);

    if (data.status === status.ERROR) {
      throw new Error("AI request failed");
    }

    return data;
  }

  async improveText(
    requestType: "server" | "client",
  ): Promise<ApiResponse<string> | AIProviderPrompts> {
    if (!this.text) {
      throw new Error("No text provided for improvement");
    }

    const requests = {
      server: async () => {
        const prompts = await improveLogbookEntryInstructions(this.text!);
        return prompts;
      },

      client: async () => {
        const prompts = await improveLogbookEntryInstructions(this.text!);
        const response = await this.callApi(prompts);
        return response;
      },
    };

    return await requests[requestType]();
  }

  async produceLogbookDetails(
    requestType: "server" | "client",
  ): Promise<ApiResponse<string> | AIProviderPrompts> {
    if (!this.text) {
      throw new Error("No text provided for improvement");
    }

    const requests = {
      server: async () => {
        const prompts = await produceLogbookDetailsInstructions(this.text!);
        return prompts;
      },

      client: async () => {
        const prompts = await produceLogbookDetailsInstructions(this.text!);
        const response = await this.callApi(prompts);
        return response;
      },
    };

    return await requests[requestType]();
  }
}
