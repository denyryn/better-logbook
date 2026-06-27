
import { config } from "../config";
import { AIProviderPrompts } from "./providers/ai.provider.interface";

type Role = "system" | "user" | "administrator";

export class AIPromptBuilder {
  private prompt: Array<{ role: Role; content: string }>;
  private defaultOutputFormat = {
    content: "output",
  };

  constructor() {
    this.prompt = [];
  }

  base() {
    this.prompt.push({role: "system", content : `You are a helpful assistant for ${config.app.name}.`});
    this.prompt.push({role: "system", content : `Answer accurately and concisely.`});
    this.prompt.push(
      {role: "system", content : `Return only the result using the EXPECTED_OUTPUT_FORMAT.`},
    );
    return this;
  }

  addInstruction(instruction: { role: Role; content: string }): AIPromptBuilder {
    this.prompt.push(instruction);
    return this;
  }

  formatOutput<T = string>(
    expectedOutput?: Record<string, T> | string,
  ): AIPromptBuilder {
    if (expectedOutput) {
      this.prompt.push({role: "system", content: "EXPECTED_OUTPUT_FORMAT : " + expectedOutput});
    } else {
      this.prompt.push(
        {role: "system", content: "EXPECTED_OUTPUT_FORMAT : " + JSON.stringify(this.defaultOutputFormat)}
      );
    }
    return this;
  }

  systemMessages(): string[] {
    return this.prompt.filter(p => p.role === "system").map(p => p.content);
  }

  userMessages(): string[] {
    return this.prompt.filter(p => p.role === "user").map(p => p.content);
  }

  toPrompts(): AIProviderPrompts {
    return {
      system: this.systemMessages(),
      user: this.userMessages(),
    };
  }

  async execute(): Promise<string> {
    return this.prompt
      .map((p) => `${p.role}: ${p.content}`)
      .join("\n");
  }
}
