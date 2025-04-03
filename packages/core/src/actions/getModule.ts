import { Account, Aptos } from '@aptos-labs/ts-sdk';
import { Abi } from '@octas/abi';
import { Address, Chain } from '@octas/types';

export type GetModuleParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  abi extends Abi = Abi,
  client extends Aptos = Aptos,
  address extends Address = Address,
> = {
  /** Module ABI */
  abi: abi;
  /** Module address */
  address: address;
  /** Aptos client */
  client: client;
  /** Chain config */
  chain: chain;
  /** Account */
  account: account;
};
