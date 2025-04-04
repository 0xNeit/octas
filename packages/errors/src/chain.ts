import { Chain } from '@octas/types';
import { BaseError } from './base';

export type ChainDoesNotSupportModuleErrorType = ChainDoesNotSupportModule & {
  name: 'ChainDoesNotSupportModule';
};
export class ChainDoesNotSupportModule extends BaseError {
  constructor({
    blockHeight,
    chain,
    module,
  }: {
    blockHeight?: bigint | undefined;
    chain: Chain;
    module: { name: string; blockCreated?: number | undefined };
  }) {
    super(`Chain "${chain.name}" does not support module "${module.name}".`, {
      metaMessages: [
        'This could be due to any of the following:',
        ...(blockHeight &&
        module.blockCreated &&
        module.blockCreated > blockHeight
          ? [
              `- The module "${module.name}" was not deployed until block ${module.blockCreated} (current block ${blockHeight}).`,
            ]
          : [
              `- The chain does not have the module "${module.name}" configured.`,
            ]),
      ],
      name: 'ChainDoesNotSupportModule',
    });
  }
}

export type ChainMismatchErrorType = ChainMismatchError & {
  name: 'ChainMismatchError';
};
export class ChainMismatchError extends BaseError {
  constructor({
    chain,
    currentChainId,
  }: {
    chain: Chain;
    currentChainId: number;
  }) {
    super(
      `The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} – ${chain.name}).`,
      {
        metaMessages: [
          `Current Chain ID:  ${currentChainId}`,
          `Expected Chain ID: ${chain.id} – ${chain.name}`,
        ],
        name: 'ChainMismatchError',
      }
    );
  }
}

export type ChainNotFoundErrorType = ChainNotFoundError & {
  name: 'ChainNotFoundError';
};
export class ChainNotFoundError extends BaseError {
  constructor() {
    super(
      [
        'No chain was provided to the request.',
        'Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient.',
      ].join('\n'),
      {
        name: 'ChainNotFoundError',
      }
    );
  }
}

export type InvalidChainIdErrorType = InvalidChainIdError & {
  name: 'InvalidChainIdError';
};
export class InvalidChainIdError extends BaseError {
  constructor({ chainId }: { chainId?: number | undefined }) {
    super(
      typeof chainId === 'number'
        ? `Chain ID "${chainId}" is invalid.`
        : 'Chain ID is invalid.',
      { name: 'InvalidChainIdError' }
    );
  }
}
