import { ClientConfig } from '@aptos-labs/ts-sdk';
import { AbiTable, DefaultAbiTable } from '@octas/abi';
import { Address, Chain, Prettify } from '@octas/types';
import { uid } from '@octas/utils';
import { OctaClient } from './client';
import { Account } from './accounts/types';
import { parseAccount } from './utils/parseAccount';

type Client_Base<
  octaClient extends OctaClient<AbiTable> = OctaClient<AbiTable>,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  clientConfig extends ClientConfig | undefined = undefined,
> = {
  /** The Account of the Client. */
  account: account;
  /** The Aptos client. */
  octaClient: octaClient;
  /** Chain for the client. */
  chain: chain;
  /** A key for the client. */
  key: string;
  /** A name for the client. */
  name: string;
  /** The type of client. */
  type: string;
  /** A unique ID for the client. */
  uid: string;
  /** The client config. */
  clientConfig: clientConfig;
};

export type ClientParams<
  octaClient extends OctaClient<AbiTable> = OctaClient<AbiTable>,
  chain extends Chain = Chain,
  accountOrAddress extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  clientConfig extends ClientConfig | undefined = ClientConfig | undefined,
> = {
  /** The account for the client. */
  account?: accountOrAddress | Account | Address | undefined;
  /** Chain for the client. */
  chain: chain;
  /** A key for the client. */
  key?: string | undefined;
  /** A name for the client. */
  name?: string | undefined;
  /** The Aptos client. */
  octaClient?: octaClient;
  /** The type of client. */
  type?: string | undefined;
  /** The client config. */
  clientConfig?: clientConfig;
};

export type Client<
  octaClient extends OctaClient<AbiTable> = OctaClient<AbiTable>,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  clientConfig extends ClientConfig | undefined = ClientConfig | undefined,
> = Client_Base<octaClient, chain, account, clientConfig>;

export function createClient<
  octaClient extends OctaClient<AbiTable>,
  chain extends Chain = Chain,
  accountOrAddress extends Account | Address | undefined = undefined,
  clientConfig extends ClientConfig | undefined = undefined,
>(
  parameters: ClientParams<octaClient, chain, accountOrAddress, clientConfig>
): Prettify<
  Client<
    octaClient,
    chain,
    accountOrAddress extends Address ? Account : accountOrAddress,
    clientConfig
  >
>;

export function createClient(parameters: ClientParams): Client {
  const {
    chain,
    clientConfig,
    key = 'base',
    name = 'Base Client',
    type = 'base',
  } = parameters;

  const client = new OctaClient<DefaultAbiTable>(chain, clientConfig);
  const account = parameters.account
    ? parseAccount(parameters.account)
    : undefined;

  return {
    account,
    octaClient: client,
    chain,
    key,
    name,
    type,
    uid: uid(),
    clientConfig,
  };
}
