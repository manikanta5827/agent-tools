import { myEmitter } from "../../gemini/emitter";
import configFile from "../gemini.json";
import type { mcpServerSchema, stdioArgs } from "./types";
import { pendingRequests } from "../event-emitters";

let stdio_servers_pipe = new Map();
let stdio_servers_info = new Map();

export const spawnStdioServers = async () => {
  console.log("spawn stdio server is triggered...");
  for (const [key, value] of Object.entries(configFile.mcpServers)) {
    const serverSchema = value as stdioArgs;
    const transport = serverSchema.transport;
    const command = serverSchema.command;
    const args = serverSchema.args;
    const server_name = key;

    if (transport === "stdio") {
      // spawn the servers and store their stdouts
      const commands = [command, ...args];

      console.log(commands);
      const spawn = Bun.spawn({
        cmd: commands,
        stdin: "pipe",
        stdout: "pipe",
      });

      stdio_servers_pipe.set(server_name, spawn);
    }
  }
  listenStdioOutput();
};

export const initialiseStdioServers = async (data: any) => {
  console.log("intialise stdio server triggered...");
  for (const [server_name, stdio] of stdio_servers_pipe) {
    stdio.stdin.write(JSON.stringify(data) + "\n");
  }
};

export const getAllToolsFromStdioServers = async () => {
  console.log("get all tools from stdio servers is triggered...");

  let payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {
      _meta: {
        progressToken: 1,
      },
    },
  };

  for (const [server_name, stdio] of stdio_servers_pipe) {
    stdio.stdin.write(JSON.stringify(payload) + "\n");
  }

  return new Promise(resolve=>{
    pendingRequests.set("get_all_tools", {
      resolver: resolve,
      
    })
  })
};

export const listenStdioOutput = async () => {
  console.log("listen stdio output is triggered...");
  for (const [server_name, stdio] of stdio_servers_pipe) {
    (async () => {
      const reader = stdio.stdout.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const data = JSON.parse(decoder.decode(value).trim());

        if (data.result?.serverInfo) {
          stdio_servers_info.set(data.result.serverInfo.name, data.result);
        }

        if ("id" in data) {
          myEmitter.emit("mcp_response", data);
        }
      }
    })();
  }
  console.log("listen stdio output is completed");
};
