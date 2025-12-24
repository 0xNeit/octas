import { Abi, AbiTable } from '@octas/abi';
import { Address, Chain } from '@octas/types';
import { OctaClient } from '../client';
import { Account } from '../accounts';
import { Client } from '../createClient';

type KeyedClient<
  octaClient extends OctaClient<AbiTable> = OctaClient<AbiTable>,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> =
  | {
      public?: Client<octaClient, chain> | undefined;
      wallet: Client<octaClient, chain, account>;
    }
  | {
      public: Client<octaClient, chain>;
      wallet?: Client<octaClient, chain, account> | undefined;
    };

export type GetModuleParameters<
  octaClient extends OctaClient<AbiTable> = OctaClient<AbiTable>,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  abi extends Abi = Abi,
  client extends
    | Client<octaClient, chain, account>
    | KeyedClient<octaClient, chain, account> =
    | Client<octaClient, chain, account>
    | KeyedClient<octaClient, chain, account>,
  address extends Address = Address,
> = {
  /** Module ABI */
  abi: abi;
  /** Module address */
  address: address;
  /** The client */
  client: client;
};

export function getModule<
  octaClient extends OctaClient<AbiTable>,
  address extends Address,
  const abi extends Abi,
  const client extends
    | Client<octaClient, chain, account>
    | KeyedClient<octaClient, chain, account>,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>({
  abi,
  address,
  client: client_,
}: GetModuleParameters<octaClient, chain, account, abi, client, address>) {
  const client = client_ as
    | Client<octaClient, chain, account>
    | KeyedClient<octaClient, chain, account>;

  const [publicClient, walletClient] = (() => {
    if (!client) return [undefined, undefined];
    if ('public' in client && 'wallet' in client)
      return [client.public as Client, client.wallet as Client];
    if ('public' in client) return [client.public as Client, undefined];
    if ('wallet' in client) return [undefined, client.wallet as Client];
    return [client, client];
  })();

  if (publicClient) {
    return publicClient.octaClient.getMethods(abi, address);
  }

  if (walletClient) {
    return walletClient.octaClient.getMethods(abi, address);
  }

  throw new Error('No client provided');
}
