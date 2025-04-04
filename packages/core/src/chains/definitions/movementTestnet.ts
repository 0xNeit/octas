import { defineChain } from '@octas/utils'

export const movementTestnet = /*#__PURE__*/ defineChain({
  id: 250,
  name: 'Movement Testnet',
  nativeCurrency: { name: 'Move Coin', symbol: 'MOVE', decimals: 8 },
  rpcUrls: {
    default: {
      http: [
        'https://testnet.bardock.movementnetwork.xyz/v1',
        'https://rpc.sentio.xyz/movement-testnet/v1',
      ]
    }
  },
  indexerUrls: {
    default: {
      http: [
        'https://indexer.mainnet.movementnetwork.xyz/v1/graphql',
        'https://rpc.sentio.xyz/movement-testnet-indexer/v1/graphql'
      ]
    }
  },
  blockExplorers: {
    default: {
      name: 'Movement Explorer',
      url: 'https://explorer.movementnetwork.xyz/?network=bardock+testnet',
    }
  },
  modules: {
    aptosFramework: {
      address: '0x1',
      blockCreated: 0,
    }
  }
})