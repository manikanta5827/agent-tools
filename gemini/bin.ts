// import configFile from "../mcp-client/gemini.json";
import { setTimeout as sleep } from "node:timers/promises";
// const jsonFile = Bun.file("./mcp-client/gemini.json");
// const configFile = await jsonFile.json();

// for (const [key, value] of Object.entries(configFile.mcpServers)) {
//     console.log('mcp server :: ', key);
//     console.log('command :: ', value.command)
//     value.args.forEach(arg => {
//         console.log(arg)
//     })
// }

process.stdout.write("Loading...");
await sleep(2000);

process.stdout.write("\rProgress: 50%");
await sleep(2000);

process.stdout.write("\rProgress: 75%");
await sleep(2000);

process.stdout.write("\rdone");
