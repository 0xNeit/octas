import { BaseError } from './base';

export type ChainNotConfiguredErrorType = ChainNotConfiguredError & {
  name: 'ChainNotConfiguredError';
};
export class ChainNotConfiguredError extends BaseError {
  override name = 'ChainNotConfiguredError';
  constructor() {
    super('Chain not configured.');
  }
}

export type ConnectorAlreadyConnectedErrorType =
  ConnectorAlreadyConnectedError & {
    name: 'ConnectorAlreadyConnectedError';
  };
export class ConnectorAlreadyConnectedError extends BaseError {
  override name = 'ConnectorAlreadyConnectedError';
  constructor() {
    super('Connector already connected.');
  }
}

export type ConnectorNotConnectedErrorType = ConnectorNotConnectedError & {
  name: 'ConnectorNotConnectedError';
};
export class ConnectorNotConnectedError extends BaseError {
  override name = 'ConnectorNotConnectedError';
  constructor() {
    super('Connector not connected.');
  }
}
