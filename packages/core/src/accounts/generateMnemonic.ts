import type { ErrorType } from '@octas/errors';
import { generateMnemonic as generateMnemonic_ } from '@scure/bip39';

export type GenerateMnemonicErrorType = ErrorType;

/**
 * @description Generates a random mnemonic phrase with a given wordlist.
 *
 * @param wordlist The wordlist to use for generating the mnemonic phrase.
 * @param strength mnemonic strength 128-256 bits
 *
 * @returns A randomly generated mnemonic phrase.
 */
export function generateMnemonic(
  wordlist: string[],
  strength?: number | undefined
): string {
  return generateMnemonic_(wordlist, strength);
}
