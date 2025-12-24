import { Chain } from '@octas/types';
import { Emitter } from '../createEmitter';
import { Compute } from '../types/utils';
import { Storage } from '../createStorage';
import {
  AccountInfo,
  AptosChangeNetworkMethod,
  AptosConnectMethod,
  AptosDisconnectMethod,
  AptosGetAccountMethod,
  AptosGetNetworkMethod,
  AptosOnAccountChangeMethod,
  AptosOnNetworkChangeMethod,
  AptosOpenInMobileAppMethod,
  AptosSignAndSubmitTransactionMethod,
  AptosSignMessageMethod,
  AptosSignTransactionMethod,
  AptosWallet,
} from '@aptos-labs/wallet-standard';

export type ConnectorEventMap = {
  change: AccountInfo;
  connect: AccountInfo;
  disconnect: never;
  error: { error: Error };
  message: { type: string; data?: unknown | undefined };
};

export type CreateConnectorFn<
  properties extends Record<string, unknown> = Record<string, unknown>,
  storageItem extends Record<string, unknown> = Record<string, unknown>,
> = (config: {
  chains: readonly [Chain, ...Chain[]];
  emitter: Emitter<ConnectorEventMap>;
  storage?: Compute<Storage<storageItem>> | null | undefined;
}) => Compute<
  AptosWallet &
    properties & {
      chain: Chain;
      setup?(): Promise<void>;
      hasFeature: (name: string) => boolean;
      connect: AptosConnectMethod;
      disconnect: AptosDisconnectMethod;
      network: AptosGetNetworkMethod;
      account: AptosGetAccountMethod;
      changeNetwork: AptosChangeNetworkMethod;
      openInMobileApp: AptosOpenInMobileAppMethod;
      onAccountChange: AptosOnAccountChangeMethod;
      onNetworkChange: AptosOnNetworkChangeMethod;
      signAndSubmitTransaction: AptosSignAndSubmitTransactionMethod;
      signTransaction: AptosSignTransactionMethod;
      signMessage: AptosSignMessageMethod;
      isAuthorized(): Promise<boolean>;
    }
>;

export function createConnector<
  properties extends Record<string, unknown> = Record<string, unknown>,
  storageItem extends Record<string, unknown> = Record<string, unknown>,
  createConnectorFn extends CreateConnectorFn<
    properties,
    storageItem
  > = CreateConnectorFn<properties, storageItem>,
>(createConnectorFn: createConnectorFn) {
  return createConnectorFn;
}
