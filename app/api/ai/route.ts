import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { GoogleAIProvider } from "@/lib/ai/providers/ai.google";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { config } from "@/lib/config";
import { AIProviderService } from "@/services/ai.provider.service";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TokenCalculator } from "@/lib/ai/token.calculator";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await auth.api.getSession({ headers: request.headers })

  const ai = new AIProviderService(
    new GoogleAIProvider(config.ai.googleai.apiKey, session?.user.id),
  );

  try {
    const session = await auth.api.getSession({ headers: request.headers });

    const usages = await prisma.aiTokenUsage.findMany({
      where: {userId: session?.user.id}
    })

    const tokenCalculator = new TokenCalculator(usages);
    const remainingToken = tokenCalculator.calculateRemainingPercentage();

    if (remainingToken === 0) {
      return serverErrorResponse(undefined, "You are exceeded your AI usage limit.", StatusCodes.FORBIDDEN)
    }

    const { prompt } = body
    const response = await ai.ask(prompt as string);

    return serverSuccessResponse(
      response,
      "AI request processed successfully",
      StatusCodes.OK,
    );
  } catch (err) {
    console.error("AI request failed:", err);
    return serverErrorResponse(
      undefined,
      "Failed to process AI request",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
