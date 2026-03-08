import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

import { AIProvider } from "./ai.provider.interface";
import { config } from "@/lib/config";
import { AiTokenUsage } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export class GoogleAIProvider implements AIProvider {
  private instance: GoogleGenAI;
  private userId: string;

  constructor(apiKey: string | undefined, userId: string | undefined) {
    if (!apiKey) {
      throw new Error("Google AI API key is required");
    }

    if (!userId) {
      throw new Error("User ID is required for logging AI usage");
    }

    this.userId = userId;
    this.instance = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  async log(usage: Partial<AiTokenUsage>) {
    await prisma.aiTokenUsage.create({
      data: {...usage, userId: this.userId} as AiTokenUsage
    })
  }

  async generate(prompt: string): Promise<string | undefined> {
    const response: GenerateContentResponse = await this.instance.models.generateContent({
      model: config.ai.googleai.model,
      contents: prompt,
    });

    await this.log({
      model: config.ai.googleai.model,
      promptTokens: response.usageMetadata?.promptTokenCount,
      completionTokens: response.usageMetadata?.candidatesTokenCount,
      totalTokens: response.usageMetadata?.totalTokenCount
    });

    return response.text;
  }
}
