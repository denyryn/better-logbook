import { AIPromptBuilder } from "../ai.prompt";
import { AIProviderPrompts } from "../providers/ai.provider.interface";

export type ExpectedImprovedLogbookEntryResponse = string;
export type ExpectedProduceLogbookDetailsResponse = {
  title: string;
  tags: string[] | undefined;
}

export async function improveLogbookEntryInstructions(text : string): Promise<AIProviderPrompts> {
  const builder = new AIPromptBuilder();

  builder.base();
  builder.addInstruction({role: "system", content: `Improve the following logbook text:\n${text}`} );
  builder.formatOutput("plain text");

  return builder.toPrompts();
}

export async function produceLogbookDetailsInstructions(text : string): Promise<AIProviderPrompts> {
  const builder = new AIPromptBuilder();

  const mockOutput = {
    title: "This is title",
    tags: ["tag1", "tag2"],
  }

  builder.base();
  builder.addInstruction({role: "system", content: `Extract the following details from this logbook entry:\n${text}.` });
  builder.addInstruction({role: "system", content: ` into 1. Title that represents the main topic\n2. A list of relevant general tags that can be used for categorization and search`});
  builder.formatOutput(JSON.stringify(mockOutput));

  return builder.toPrompts();
}
