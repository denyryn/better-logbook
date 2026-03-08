import { AiTokenUsage } from "@/generated/prisma/client";
import { config } from "../config";

export class TokenCalculator {
  private usageData: AiTokenUsage[];

  constructor(usageData?: AiTokenUsage[]) {
    this.usageData = usageData ?? [];
  }

  calculateUsedTokens(): number {
    return this.usageData.reduce((acc, usage) => acc + usage.totalTokens, 0);
  }

  calculateUsagePercentage(): number {
    const totalTokens = this.calculateUsedTokens();
    const tokenLimit = config.ai.weeklyLimit;

    if (tokenLimit === 0) return 0;

    return Math.ceil(Math.min((totalTokens / tokenLimit) * 100, 100));
  }

  calculateRemainingTokens(): number {
    const totalTokens = this.calculateUsedTokens();
    const tokenLimit = config.ai.weeklyLimit;

    return Math.max(tokenLimit - totalTokens, 0);
  }

  calculateRemainingPercentage(): number {
    return 100 - this.calculateUsagePercentage();
  }
}
