import { Assign, Chain, Prettify } from "@octas/types";

export function defineChain<
  const chain extends Chain,
>(chain: chain): Prettify<Assign<Chain<undefined>, chain>> {
  return {
    ...chain,
  } as Assign<Chain<undefined>, chain>;
}