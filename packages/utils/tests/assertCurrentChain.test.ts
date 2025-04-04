import { expect, test } from "vitest";
import { aptos, movement } from "./fixtures/chains";
import { assertCurrentChain } from "../src/chain/assertCurrentChain";

test('matching chains', () => {
  assertCurrentChain({ currentChainId: aptos.id, chain: aptos })
})