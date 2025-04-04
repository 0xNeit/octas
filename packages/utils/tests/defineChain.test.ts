import { expect, test } from 'vitest'

import { defineChain } from '../src/chain/defineChain'

test('default', () => {
  expect(
    defineChain({
      id: 126,
      name: 'Movement',
      network: 'movement',
      nativeCurrency: { name: 'Movement', symbol: 'MOVE', decimals: 8 },
      rpcUrls: {
        default: { http: ['https://mainnet.movementnetwork.xyz/v1'] },
      },
    }),
  ).toMatchInlineSnapshot(`
      {
        "id": 126,
        "name": "Movement",
        "nativeCurrency": {
          "decimals": 8,
          "name": "Movement",
          "symbol": "MOVE",
        },
        "network": "movement",
        "rpcUrls": {
          "default": {
            "http": [
              "https://mainnet.movementnetwork.xyz/v1",
            ],
          },
        },
      }
    `)
})
