import { GoogleGenAI } from "@google/genai";

import { AIProvider } from "./ai.provider.interface";

export class GoogleAIProvider implements AIProvider {
  private instance: GoogleGenAI;

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error("Google AI API key is required");
    }

    this.instance = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  async generate(prompt: string): Promise<string | undefined> {
    const response = await this.instance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  }
}
