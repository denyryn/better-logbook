import { AiTokenUsage } from "@/generated/prisma/client";
import { config } from "../config";

export class TokenCalculator {
  private usageData: AiTokenUsage[] | undefined;

  constructor(usageData: AiTokenUsage[] | undefined) {
    if (!usageData) throw Error("Ai usage token data invalid.")
    this.usageData = usageData;
  }

  calculateUsedTokens() {
    const usedTokens = this.usageData?.reduce((acc, usage) => acc + usage.totalTokens, 0);
    return usedTokens;
  }

  calculateUsagePercentage(): number {
    const totalTokens = this.calculateUsedTokens();
    if (!totalTokens) throw Error("Total token invalid")

    const tokenLimit = config.ai.weeklyLimit;
    if (tokenLimit === 0) return 0; // Avoid division by zero
    return (totalTokens / tokenLimit) * 100;
  }

  calculateRemainingTokens(): number {
    const totalTokens = this.calculateUsedTokens();
    if (!totalTokens) throw Error("Total token invalid")

    const tokenLimit = config.ai.weeklyLimit;
    return Math.max(tokenLimit - totalTokens, 0); // Ensure it doesn't go negative
  }

  calculateRemainingPercentage(): number {
    const remainingTokens = this.calculateRemainingTokens();
    return 100 - remainingTokens;
  }
}
