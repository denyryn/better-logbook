import { AIProviderPrompts } from "../ai/providers/ai.provider.interface";
import { ExpectedProduceLogbookDetailsResponse, improveLogbookEntryInstructions, produceLogbookDetailsInstructions } from "../ai/instructions/entry.logbook";
import { ApiResponse, status } from "../api.response";
import { api } from "../axios";

function getBaseUrl() {
  return "/api/ai";
}

async function callApi(
  prompts: AIProviderPrompts,
): Promise<ApiResponse<string>> {
  const { data } = await api.post<ApiResponse<string>>(getBaseUrl(), prompts);

  if (data.status === status.ERROR) {
    throw new Error("AI request failed");
  }

  return data;
}

function parseProduceDetails(data: string): ExpectedProduceLogbookDetailsResponse {
  const cleaned = data.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  return JSON.parse(cleaned) as ExpectedProduceLogbookDetailsResponse;
}

export async function improveText(
  requestType: "server" | "client",
  text: string
): Promise<ApiResponse<string> | AIProviderPrompts> {
  if (!text) {
    throw new Error("No text provided for improvement");
  }

  const requests = {
    server: async () => {
      const prompts = await improveLogbookEntryInstructions(text);
      return prompts;
    },

    client: async () => {
      const prompts = await improveLogbookEntryInstructions(text);
      const response = await callApi(prompts);
      return response;
    },
  };

  return await requests[requestType]();
}

export async function produceLogbookDetails(
  requestType: "server" | "client",
  text: string
): Promise<ApiResponse<ExpectedProduceLogbookDetailsResponse> | AIProviderPrompts> {
  if (!text) {
    throw new Error("No text provided for improvement");
  }

  const requests = {
    server: async () => {
      const prompts = await produceLogbookDetailsInstructions(text);
      return prompts;
    },

    client: async () => {
      const prompts = await produceLogbookDetailsInstructions(text);
      const response = await callApi(prompts);
      const parsedResponseData = parseProduceDetails(response.data);
      return {...response, data: parsedResponseData} as ApiResponse<ExpectedProduceLogbookDetailsResponse>;
    },
  };

  return await requests[requestType]();
}
