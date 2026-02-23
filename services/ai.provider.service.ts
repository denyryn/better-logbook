import { AIProvider } from "../lib/ai/providers/ai.provider.interface";

export class AIProviderService {
  private provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  async ask(prompt: string): Promise<string | undefined> {
    return await this.provider.generate(prompt);
  }
}
