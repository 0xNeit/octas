import {
  BaseErrorType,
  ConnectorAlreadyConnectedError,
  ConnectorAlreadyConnectedErrorType,
  ErrorType,
} from '@octas/errors';
import { CreateConnectorFn } from '../connectors/createConnector';
import { Config, Connector } from '../createConfig';
import { ChainIdParameter } from '../types/properties';
import { Compute } from '../types/utils';
import { AccountInfo } from '@aptos-labs/wallet-standard';

export type ConnectParameters<
  config extends Config = Config,
  connector extends Connector | CreateConnectorFn =
    | Connector
    | CreateConnectorFn,
  parameters extends unknown | undefined =
    | (connector extends CreateConnectorFn
        ? Omit<
            NonNullable<Parameters<ReturnType<connector>['connect']>[0]>,
            'isReconnecting'
          >
        : never)
    | (connector extends Connector
        ? Omit<
            NonNullable<Parameters<connector['connect']>[0]>,
            'isReconnecting'
          >
        : never),
> = Compute<
  ChainIdParameter<config> & {
    connector: connector | CreateConnectorFn;
  }
> &
  parameters;

export type ConnectReturnType = {
  account: AccountInfo;
};

export type ConnectErrorType =
  | ConnectorAlreadyConnectedErrorType
  // connector.connect()
  // base
  | BaseErrorType
  | ErrorType;

/** https://khizab.dev/core/api/actions/connect */
export async function connect<
  config extends Config,
  connector extends Connector | CreateConnectorFn,
>(
  config: config,
  parameters: ConnectParameters<config, connector>
): Promise<ConnectReturnType> {
  // "Register" connector if not already created
  let connector: Connector;
  if (typeof parameters.connector === 'function') {
    connector = config._internal.connectors.setup(parameters.connector);
  } else connector = parameters.connector;

  // Check if connector is already connected
  if (connector.uid === config.state.current)
    throw new ConnectorAlreadyConnectedError();

  try {
    config.setState((x) => ({ ...x, status: 'connecting' }));
    connector.emitter.emit('message', { type: 'connecting' });

    const data = await connector.connect();

    connector.emitter.off('connect', config._internal.events.connect);
    connector.emitter.on('change', config._internal.events.change);
    connector.emitter.on('disconnect', config._internal.events.disconnect);

    await config.storage?.setItem('recentConnectorId', connector.name);
    config.setState((x) => ({
      ...x,
      connections: new Map(x.connections).set(connector.uid, {
        account: (data as any).args,
        connector: connector,
      }),
      current: connector.uid,
      status: 'connected',
    }));

    return { account: (data as any).args };
  } catch (error) {
    config.setState((x) => ({
      ...x,
      // Keep existing connector connected in case of error
      status: x.current ? 'connected' : 'disconnected',
    }));
    throw error;
  }
}
