import { defineChain } from '@octas/utils'

export const movement = /*#__PURE__*/ defineChain({
  id: 126,
  name: 'Movement',
  nativeCurrency: { name: 'Move Coin', symbol: 'MOVE', decimals: 8 },
  rpcUrls: {
    default: {
      http: [
        'https://mainnet.movementnetwork.xyz/v1',
        'https://rpc.movement.bh.rocks/v1',
        'https://movement.blockpi.network/rpc/v1/public/v1',
        'https://movement.lava.build/',
        'https://movement-rpc.nodeops.network/v1',
        'https://rpc.sentio.xyz/movement/v1',
        'https://movement.hellomoon.io/v1',
        'https://rpc.ankr.com/http/movement_mainnet/v1'
      ]
    }
  },
  indexerUrls: {
    default: {
      http: [
        'https://indexer.mainnet.movementnetwork.xyz/v1/graphql',
        'https://rpc.sentio.xyz/movement-indexer/v1/graphql'
      ]
    }
  },
  blockExplorers: {
    default: {
      name: 'Movement Explorer',
      url: 'https://explorer.movementnetwork.xyz',
    }
  },
  modules: {
    aptosFramework: {
      address: '0x1',
      blockCreated: 0,
    }
  }
})