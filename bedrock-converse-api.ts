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

const modelId: string = "google.gemma-3-27b-it"; // amazon nova lite

export async function runConverse(
  messages: Message[],
  toolConfig: ConverseCommandInput["toolConfig"]
) {
  let paylaod: ConverseCommandInput = {
    system: [
      {
        text: "You are a helpful AI assistant. Use the provided tools for any factual or external tasks. Do not guess information that tools can provide.",
      },
    ],
    modelId: modelId,
    messages: messages,
    toolConfig: toolConfig,
    inferenceConfig: {
      temperature: 0.5,
      topP: 1.0,
    },
  };

  console.log("payload :: ", JSON.stringify(paylaod, null, 2));
  const command = new ConverseCommand(paylaod);

  try {
    const response: ConverseCommandOutput = await client.send(command);
    const assistantMessage = response.output?.message;
    console.log("response :: ", JSON.stringify(response, null, 2));
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
