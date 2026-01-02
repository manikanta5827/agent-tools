import { runConverse } from "./bedrock-converse-api.ts";
import { toolConfig } from "./tools.ts";
import type { Message } from "@aws-sdk/client-bedrock-runtime";

const runAgent = async (userMessage: string): Promise<void> => {
  let messages: Message[] = [];
  messages = [
    {
      role: "user",
      content: [{ text: userMessage }],
    },
  ];

  const res = await runConverse(messages, toolConfig);

  console.log(res);
};

(async () => {
  await runAgent("list all the tools");
})();
