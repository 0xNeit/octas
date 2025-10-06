import { ErrorType } from '@octas/errors';
import { ed25519 } from '@noble/curves/ed25519.js';
import { Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

export type GeneratePrivateKeyErrorType = ErrorType;

/**
 * @description Generates a random private key.
 *
 * @returns A randomly generated private key.
 */
export function generatePrivateKey(): string {
  const keyPair = ed25519.utils.randomSecretKey();
  const privateKey = new Ed25519PrivateKey(keyPair);
  return privateKey.toHexString();
}
