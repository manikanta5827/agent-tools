/* 
 initialise the server info

 ->get the json config file of servers
 ->start those servers [ spawning if server is stdio]
 ->call initialise to get server info
*/

import { initialiseHttpServers } from "./transports/http-transport";
import {
  initialiseStdioServers,
  spawnStdioServers,
} from "./transports/stdio-transport";

/* 
 get all the tools

 ->get the list of all mcp servers available
 ->call [list/tools] from all mcp servers
 ->construct llm compatible tool schema from the tools schema and store it persistently
 -> so when asked it again send it from cache instead of asking again
 -> store the methods of each mcp server , so when specific tool is called, we can know from which server it is, so we  can send jrpc message to that server correctly
*/

/*
  call specific tool

  ->get the name of server which this tool belongs to
  ->construct jrpc message with the server name and tool name and send it according to the type of mcp [stdio, http]
  ->construct llm compatible response from mcp server jrpc message
*/

export const spawnMcpServers = async () => {
  // spawn if there are any stdio servers
  await spawnStdioServers();
};

export const initialiseMcpServers = async () => {
  let testInitialisationScript = {
    jsonrpc: "2.0",
    id: 0,
    method: "initialize",
    params: {
      protocolVersion: "2025-11-25",
      capabilities: {
        sampling: {},
        elicitation: {},
        roots: {
          listChanged: true,
        },
      },
      clientInfo: {
        name: "inspector-client",
        version: "0.18.0",
      },
    },
  };

  console.log("sending initialise requests to all mcp servers...");
  await initialiseStdioServers(testInitialisationScript);
  await initialiseHttpServers(testInitialisationScript);
  console.log("sended initialise requests to all mcp servers...");
};

export const getAllTools = async()=>{
  
}

(async () => {
  await spawnMcpServers();
  await initialiseMcpServers();
})();
