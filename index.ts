import { getGeminiData } from "./gemini-client.ts";
import { getWeather } from "./gemini-functions.ts";
import { setLightValues } from "./gemini-functions.ts";

// A chunk of model output
interface OutputPart {
  text?: string;
  functionCall?: {
    name: string;
    args: Record<string, any>;
  };
  functionResponse?: {
    name: string;
    response: any;
  };
}
// One element in the responses array
interface GenerationCandidate {
  content: {
    parts: OutputPart[];
  };
}

// Full response from generateContent
interface GeminiResponse {
  candidates: GenerationCandidate[];
}

type TextPart = {
  text: string;
};

type FunctionResponsePart = {
  functionResponse: {
    name: string;
    response: any;
  };
};

type Part = TextPart | FunctionResponsePart;

export type Message = {
  role: "user" | "model";
  parts: Part[];
};

const runAgent = async (userMessage: string): Promise<void> => {
  let messages: Message[] = [];
  messages = [
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const res = (await getGeminiData(messages)) as GeminiResponse;

  const candidate = res.candidates?.[0];
  if (!candidate) {
    console.error("No candidates returned");
    return;
  }

  const funcPart = candidate.content.parts.find((p) => p.functionCall);
  if (!funcPart?.functionCall) {
    console.log(candidate.content.parts.map((p) => p.text).join(""));
    return;
  }

  const { name, args } = funcPart.functionCall;
  console.log("Tool requested:", name, args);

  let toolResult;
  if (name === "get_weather") {
    toolResult = getWeather(args.city);
  } else if (name === "set_light_values") {
    toolResult = setLightValues(args.brightness, args.color_temp);
  } else {
    throw new Error("Unknown tool");
  }

  messages.push({
    role: "model",
    parts: [
      {
        functionResponse: {
          name,
          response: { result: toolResult },
        },
      },
    ],
  });

  const final = await getGeminiData(messages);
  console.log(final.text);
};

(async () => {
  await runAgent("get the weather of kochi");
})();
