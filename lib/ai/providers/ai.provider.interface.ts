import { AiTokenUsage } from "@/generated/prisma/client";

export interface AIProvider {
  generate(prompt: string): Promise<string | undefined>;
  log(usage: Partial<AiTokenUsage>): Promise<void>;
}
