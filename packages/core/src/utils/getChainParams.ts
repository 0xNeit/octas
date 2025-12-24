import { AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { Chain } from '@octas/types';

export type ChainParams = {
  fullnodeUrl: string;
  indexerUrl: string;
  chainId: number;
};

export function chainIdToNetwork(chainId: number): Network {
  switch (chainId) {
    case 1:
      return Network.MAINNET;
    case 2:
      return Network.TESTNET;
    default:
      return Network.CUSTOM;
  }
}

export function getChainParams(
  chain: Chain,
  fullnodeIndex?: number
): ChainParams {
  const mainnetConfig = new AptosConfig({
    network: chainIdToNetwork(chain.id),
  });
  const fullnodeUrl =
    chain.rpcUrls.default.http[0] ??
    chain.rpcUrls.default.http[fullnodeIndex ?? 0];
  const indexerUrl = chain.indexerUrls?.default.http[0];
  return {
    fullnodeUrl: fullnodeUrl ?? mainnetConfig.fullnode!,
    indexerUrl: indexerUrl ?? mainnetConfig.indexer!,
    chainId: chain.id,
  };
}
