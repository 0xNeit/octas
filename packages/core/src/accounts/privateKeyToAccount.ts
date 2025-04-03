import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount(
  privateKey: string,
): Account {
  const key = new Ed25519PrivateKey(privateKey)
  const account = Account.fromPrivateKey({ privateKey: key })
  return account
}