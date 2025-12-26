import { Chain } from '@octas/types';
import type { Config } from '../createConfig';
import type { IsNarrowable, Merge } from './utils';

/** Filters {@link Config} chains by {@link chainId} or simplifies if no `ChainFormatters` are present. */
export type SelectChains<
  config extends Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
> = Config extends config
  ? readonly [Chain] // chains not inferrable, return default
  : IsNarrowable<chainId, config['chains'][number]['id']> extends true
    ? readonly [Extract<config['chains'][number], { id: chainId }>] // select specific chain
    : // return default chain with ID set to union (allows for more simple type since the only thing that is different is the chain ID for each chain)
      readonly [Merge<Chain, { id: config['chains'][number]['id'] }>];
