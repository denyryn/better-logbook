import { ExpectedProduceLogbookDetailsResponse, improveLogbookEntryInstructions, produceLogbookDetailsInstructions } from "../ai/instructions/entry.logbook";
import { ApiResponse, status } from "../api.response";
import { api } from "../axios";

function getBaseUrl() {
  return "/api/ai";
}

async function callApi(
  text: string | undefined,
): Promise<ApiResponse<string>> {
  const { data } = await api.post<ApiResponse<string>>(getBaseUrl(), {
    prompt: text,
  });

  if (data.status === status.ERROR) {
    throw new Error("AI request failed");
  }

  return data;
}

export async function improveText(
  requestType: "server" | "client",
  text: string
): Promise<ApiResponse<string> | string> {
  if (!text) {
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
      const prompt = await buildPrompt(text);
      return prompt;
    },

    client: async () => {
      // process prompt on client side
      const prompt = await buildPrompt(text); // this line can be removed for serverside processing
      const response = await callApi(prompt);
      return response;
    },
  };

  return await requests[requestType]();
}

export async function produceLogbookDetails(
  requestType: "server" | "client",
  text: string
): Promise<ApiResponse<ExpectedProduceLogbookDetailsResponse | string> | string> {
  if (!text) {
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
      const prompt = await buildPrompt(text);
      return prompt as unknown;
    },

    client: async () => {
      // process prompt on client side
      const prompt = await buildPrompt(text); // this line can be removed for serverside processing
      const response = await callApi(prompt);
      const parsedResponseData = JSON.parse(response.data) as ExpectedProduceLogbookDetailsResponse;
      return {...response, data: parsedResponseData} as ApiResponse<ExpectedProduceLogbookDetailsResponse>;
    },
  };

  return await requests[requestType]() as Promise<ApiResponse<string> | string>;
}
