"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = void 0;
const wormhole_sdk_1 = require("@certusone/wormhole-sdk");
const wormhole_sdk_wasm_1 = require("@certusone/wormhole-sdk-wasm");
const dotenv_1 = __importDefault(require("dotenv"));
function validateEnvironment() {
    (0, wormhole_sdk_wasm_1.setDefaultWasm)('node');
    dotenv_1.default.config({ path: '.env' });
    const supportedChains = [];
    supportedChains.push(configNeon());
    return { supportedChains };
}
exports.validateEnvironment = validateEnvironment;
function configNeon() {
    if (!process.env.NEON_ETH_RPC_URL) {
        console.error('Missing environment variable NEON_ETH_RPC_URL');
        process.exit(1);
    }
    if (!process.env.NEON_PRIVATE_KEY) {
        console.error('Missing environment variable NEON_PRIVATE_KEY');
        process.exit(1);
    }
    if (!process.env.NEON_TOKEN_BRIDGE_ADDRESS) {
        console.error('Missing environment variable NEON_TOKEN_BRIDGE_ADDRESS');
        process.exit(1);
    }
    return {
        chainId: wormhole_sdk_1.CHAIN_ID_NEON,
        nodeUrl: process.env.NEON_ETH_RPC_URL,
        walletPrivateKey: process.env.NEON_PRIVATE_KEY,
        tokenBridgeAddress: process.env.NEON_TOKEN_BRIDGE_ADDRESS
    };
}
