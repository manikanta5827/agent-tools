import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type {
  ConverseCommandInput,
  ConverseCommandOutput,
  Message,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({});

const modelId: string = "deepseek.v3-v1:0"; // amazon nova lite

export async function runConverse(
  messages: Message[],
  toolConfig: ConverseCommandInput["toolConfig"]
) {
  const input: ConverseCommandInput = {
    modelId: modelId,
    messages: messages,
    toolConfig: toolConfig,
    inferenceConfig: {
      temperature: 0.5,
      topP: 1.0,
    },
  };

  const command = new ConverseCommand(input);

  try {
    const response: ConverseCommandOutput = await client.send(command);
    const assistantMessage = response.output?.message;

    // console.log(assistantMessage);

    // The response is a structured object, extract the text content
    if (
      assistantMessage &&
      assistantMessage.content &&
      assistantMessage.content.length > 0
    ) {
      return assistantMessage.content[0]?.text;
    }
    return "No response from LLM";
  } catch (err) {
    console.error("Error calling Bedrock Converse API:", err);
  }
}
