import {
  ChainMismatchError,
  ChainMismatchErrorType,
  ChainNotFoundError,
  ChainNotFoundErrorType,
  ErrorType,
} from '@octas/errors';
import { Chain } from '@octas/types';

export type AssertCurrentChainParameters = {
  chain?: Chain | undefined;
  currentChainId: number;
};

export type AssertCurrentChainErrorType =
  | ChainNotFoundErrorType
  | ChainMismatchErrorType
  | ErrorType;

export function assertCurrentChain({
  chain,
  currentChainId,
}: AssertCurrentChainParameters): void {
  if (!chain) throw new ChainNotFoundError();
  if (currentChainId !== chain.id)
    throw new ChainMismatchError({ chain, currentChainId });
}
