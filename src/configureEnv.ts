import { ChainId, CHAIN_ID_NEON } from '@certusone/wormhole-sdk';
import { setDefaultWasm } from '@certusone/wormhole-sdk-wasm';
import dotenv from 'dotenv';

export type RelayerEnvironment = {
  supportedChains: ChainConfigInfo[];
};

export type ChainConfigInfo = {
  chainId: ChainId;
  nodeUrl: string;
  tokenBridgeAddress: string;
  walletPrivateKey: string;
};

export function validateEnvironment(): RelayerEnvironment {
  setDefaultWasm('node');
  dotenv.config({ path: '.env' });
  const supportedChains: ChainConfigInfo[] = [];
  supportedChains.push(configNeon());

  return { supportedChains };
}

function configNeon(): ChainConfigInfo {
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
    chainId: CHAIN_ID_NEON,
    nodeUrl: process.env.NEON_ETH_RPC_URL,
    walletPrivateKey: process.env.NEON_PRIVATE_KEY,
    tokenBridgeAddress: process.env.NEON_TOKEN_BRIDGE_ADDRESS,
  };
}
