import { expect, test } from "vitest";
import { aptos, movement } from "./fixtures/chains";
import { assertCurrentChain } from "../src/chain/assertCurrentChain";
import { version } from "../src/version";

test('matching chains', () => {
  assertCurrentChain({ currentChainId: aptos.id, chain: aptos })
  assertCurrentChain({ currentChainId: movement.id, chain: movement })
})

test('chain mismatch', () => {
  expect(() =>
    assertCurrentChain({ currentChainId: aptos.id, chain: movement }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ChainMismatchError: The current chain of the wallet (id: 1) does not match the target chain for the transaction (id: 126 – Movement).

    Current Chain ID:  1
    Expected Chain ID: 126 – Movement

    Version: octas@${version}]
  `)
  expect(() =>
    assertCurrentChain({ currentChainId: movement.id, chain: aptos }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ChainMismatchError: The current chain of the wallet (id: 126) does not match the target chain for the transaction (id: 1 – Aptos).

    Current Chain ID:  126
    Expected Chain ID: 1 – Aptos

    Version: octas@${version}]
  `)
})

test('no chain', () => {
  expect(() =>
    assertCurrentChain({ currentChainId: aptos.id }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ChainNotFoundError: No chain was provided to the request.
    Please provide a chain with the \`chain\` argument on the Action, or by supplying a \`chain\` to WalletClient.

    Version: octas@${version}]
  `)
  expect(() =>
    assertCurrentChain({ currentChainId: movement.id }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ChainNotFoundError: No chain was provided to the request.
    Please provide a chain with the \`chain\` argument on the Action, or by supplying a \`chain\` to WalletClient.

    Version: octas@${version}]
  `)
})

