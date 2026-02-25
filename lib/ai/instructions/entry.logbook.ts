import { AIPromptBuilder } from "../ai.prompt";

export type ExpectedImprovedLogbookEntryResponse = string;
export type ExpectedProduceLogbookDetailsResponse = {
  title: string;
  tags: string[] | undefined;
}

export async function improveLogbookEntryInstructions(text : string) {
  const builder = new AIPromptBuilder("user");

  builder.base();
  builder.addInstruction(`Improve the following logbook text:\n${text}`);
  builder.formatOutput("plain text");

  return await builder.execute();
}

export async function produceLogbookDetailsInstructions(text : string) {
  const builder = new AIPromptBuilder("user");

  const mockOutput = {
    title: "This is title",
    tags: ["tag1", "tag2"],
  }

  builder.base();
  builder.addInstruction(`Extract the following details from this logbook entry:\n${text}.`);
  builder.addInstruction(` into 1. Title that represents the main topic\n2. A list of relevant general tags that can be used for categorization and search`);
  builder.formatOutput(JSON.stringify(mockOutput));

  return await builder.execute();
}
