import { Address } from './misc';
import { IsUndefined, Prettify } from './utils';

export type Chain<
  custom extends Record<string, unknown> | undefined =
    | Record<string, unknown>
    | undefined,
> = {
  /** Collection of block explorers */
  blockExplorers?:
    | {
        [key: string]: ChainBlockExplorer;
        default: ChainBlockExplorer;
      }
    | undefined;
  /** Collection of modules */
  modules?:
    | Prettify<{
        [key: string]: ChainModule | undefined;
      }>
    | undefined;
  /** ID in number form */
  id: number;
  /** Human-readable name */
  name: string;
  /** Currency used by chain */
  nativeCurrency: ChainNativeCurrency;
  /** Collection of RPC endpoints */
  rpcUrls: {
    [key: string]: ChainRpcUrls;
    default: ChainRpcUrls;
  };
  /** Collection of indexer endpoints */
  indexerUrls?: {
    [key: string]: ChainIndexerUrls;
    default: ChainIndexerUrls;
  } | undefined;
  /** Flag for test networks */
  testnet?: boolean | undefined;
} & ChainConfig<custom>;

/////////////////////////////////////////////////////////////////////
// Config
/////////////////////////////////////////////////////////////////////

export type ChainConfig<
  custom extends Record<string, unknown> | undefined =
    | Record<string, unknown>
    | undefined,
> = {
  /** Custom chain data. */
  custom?: custom | undefined;
};

export type DeriveChain<
  chain extends Chain | undefined,
  chainOverride extends Chain | undefined,
> = chainOverride extends Chain ? chainOverride : chain;

export type GetChainParameter<
  chain extends Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
> =
  IsUndefined<chain> extends true
    ? { chain: chainOverride | null }
    : { chain?: chainOverride | null | undefined };

/////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////

type ChainBlockExplorer = {
  name: string;
  url: string;
  apiUrl?: string | undefined;
};

export type ChainModule = {
  address: Address;
  blockCreated?: number | undefined;
};

type ChainNativeCurrency = {
  name: string;
  /** 2-6 characters long */
  symbol: string;
  decimals: number;
};

type ChainRpcUrls = {
  http: readonly string[];
  webSocket?: readonly string[] | undefined;
};

type ChainIndexerUrls = {
  http: readonly string[];
};
