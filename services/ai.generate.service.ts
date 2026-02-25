import { AIPromptBuilder } from "@/lib/ai/ai.prompt";
import { ApiResponse, status } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class LogbookAIService {
  private text?: string;

  constructor(text?: string) {
    this.text = text;
  }

  async improveText(
    requestType: "server" | "client",
  ): Promise<ApiResponse<string> | string> {
    if (!this.text) {
      throw new Error("No text provided for improvement");
    }

    async function buildPrompt(text: string | undefined): Promise<string> {
      const builder = new AIPromptBuilder("user");

      builder.base();
      builder.addInstruction(`Improve the following logbook text:\n${text}`);
      builder.formatOutput("plain text");

      return await builder.execute();
    }

    async function callApi(
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

    const requests = {
      server: async () => {
        const prompt = await buildPrompt(this.text);
        return prompt;
      },

      client: async () => {
        const response = await callApi(this.text);
        return response;
      },
    };

    return await requests[requestType]();
  }
}
