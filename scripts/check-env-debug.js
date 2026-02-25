import { resolve } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const pk = process.env.PRIVATE_KEY;
const rpc = process.env.AMOY_RPC_URL;

console.log("PRIVATE_KEY loaded:", !!pk && pk.length > 0);
console.log("AMOY_RPC_URL loaded:", !!rpc && rpc.length > 0);
if (pk) console.log("PRIVATE_KEY starts with 0x:", pk.startsWith("0x"));
