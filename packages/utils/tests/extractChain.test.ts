import { expect, expectTypeOf, test } from 'vitest'

import * as chains from './fixtures/chains'
import { extractChain } from '../src/chain/extractChain'

test('default', async () => {
  const mainnet = extractChain({
    chains: Object.values(chains),
    id: 1,
  })
  expectTypeOf(mainnet).toEqualTypeOf<typeof chains.aptos>()
  expect(mainnet).toMatchInlineSnapshot(`
    {
      "blockExplorers": {
        "default": {
          "name": "Aptos Explorer",
          "url": "https://explorer.aptoslabs.com",
        },
      },
      "id": 1,
      "indexerUrls": {
        "default": {
          "http": [
            "https://api.mainnet.aptoslabs.com/v1/graphql",
          ],
        },
      },
      "modules": {
        "aptosFramework": {
          "address": "0x1",
          "blockCreated": 123456789,
        },
      },
      "name": "Aptos",
      "nativeCurrency": {
        "decimals": 8,
        "name": "Aptos Coin",
        "symbol": "APT",
      },
      "rpcUrls": {
        "default": {
          "http": [
            "https://mainnet.aptoslabs.com/v1",
            "https://api.mainnet.aptoslabs.com/v1",
          ],
        },
      },
    }
  `)

  const movement = extractChain({
    chains: Object.values(chains),
    id: 126,
  })
  expectTypeOf(movement).toEqualTypeOf<typeof chains.movement>()
  expect(movement).toMatchInlineSnapshot(`
    {
      "blockExplorers": {
        "default": {
          "name": "Movement Explorer",
          "url": "https://explorer.movementnetwork.xyz",
        },
      },
      "id": 126,
      "indexerUrls": {
        "default": {
          "http": [
            "https://indexer.mainnet.movementnetwork.xyz/v1/graphql",
            "https://rpc.sentio.xyz/movement-indexer/v1/graphql",
          ],
        },
      },
      "modules": {
        "aptosFramework": {
          "address": "0x1",
          "blockCreated": 1,
        },
      },
      "name": "Movement",
      "nativeCurrency": {
        "decimals": 8,
        "name": "Move Coin",
        "symbol": "MOVE",
      },
      "rpcUrls": {
        "default": {
          "http": [
            "https://mainnet.movementnetwork.xyz/v1",
            "https://rpc.movement.bh.rocks/v1",
            "https://movement.blockpi.network/rpc/v1/public/v1",
            "https://movement.lava.build/",
            "https://movement-rpc.nodeops.network/v1",
            "https://rpc.sentio.xyz/movement/v1",
            "https://movement.hellomoon.io/v1",
            "https://rpc.ankr.com/http/movement_mainnet/v1",
          ],
        },
      },
    }
  `)
})
