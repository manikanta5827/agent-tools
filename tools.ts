import type { ToolConfiguration } from "@aws-sdk/client-bedrock-runtime";

export const toolConfig: ToolConfiguration = {
  toolChoice: {
    tool: {
      name: "getWeather",
    },
  },
  tools: [
    {
      toolSpec: {
        name: "getWeather",
        description: "Get the weather of a city",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description:
                  "Name of the city to get the weather like Bengaluru, Hyderabad",
              },
            },
            required: ["city"],
          },
        },
      },
    },
    {
      toolSpec: {
        name: "getFactorial",
        description: "Get the factorial of a number",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              num: {
                type: "string",
                description: "Number to calculate the factorial like 2, 5, 10",
              },
            },
            required: ["num"],
          },
        },
      },
    },
  ],
};
