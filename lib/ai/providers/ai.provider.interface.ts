import { AiTokenUsage } from "@/generated/prisma/client";

export type AIProviderPrompts = {
  system: string[];
  user: string[];
};

export interface AIProvider {
  generate(prompts: AIProviderPrompts): Promise<string | undefined>;
  log(usage: Partial<AiTokenUsage>): Promise<void>;
}
