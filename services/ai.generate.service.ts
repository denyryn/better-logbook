import { AIPromptBuilder } from "@/lib/ai/ai.prompt";
import { improveLogbookEntryInstructions, produceLogbookDetailsInstructions } from "@/lib/ai/instructions/entry.logbook";
import { ApiResponse, status } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class LogbookAIService {
  private text?: string;

  constructor(text?: string) {
    this.text = text;
  }

  private async callApi(
    text: string | undefined,
  ): Promise<ApiResponse<string>> {
    const { data } = await api.post<ApiResponse<string>>("/api/ai", {
      prompt: text,
    });

    if (data.status === status.ERROR) {
      throw new Error("AI request failed");
    }

    return data;
  }

  async improveText(
    requestType: "server" | "client",
  ): Promise<ApiResponse<string> | string> {
    if (!this.text) {
      throw new Error("No text provided for improvement");
    }

    async function buildPrompt(text: string | undefined): Promise<string> {
      if (!text) {
        throw new Error("No text provided for prompt building");
      }

      return await improveLogbookEntryInstructions(text);
    }

    const requests = {
      server: async () => {
        const prompt = await buildPrompt(this.text);
        return prompt;
      },

      client: async () => {
        // process prompt on client side
        const prompt = await buildPrompt(this.text); // this line can be removed for serverside processing
        const response = await this.callApi(prompt);
        return response;
      },
    };

    return await requests[requestType]();
  }

  async produceLogbookDetails(
    requestType: "server" | "client",
  ): Promise<ApiResponse<string> | string> {
    if (!this.text) {
      throw new Error("No text provided for improvement");
    }

    async function buildPrompt(text: string | undefined): Promise<string> {
      if (!text) {
        throw new Error("No text provided for prompt building");
      }

      return await produceLogbookDetailsInstructions(text);
    }

    const requests = {
      server: async () => {
        const prompt = await buildPrompt(this.text);
        return prompt;
      },

      client: async () => {
        // process prompt on client side
        const prompt = await buildPrompt(this.text); // this line can be removed for serverside processing
        const response = await this.callApi(prompt);
        return response;
      },
    };

    return await requests[requestType]();
  }
}
