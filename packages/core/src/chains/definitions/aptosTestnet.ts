import { defineChain } from '@octas/utils'

export const aptosTestnet = /*#__PURE__*/ defineChain({
  id: 2,
  name: 'Aptos Testnet',
  nativeCurrency: { name: 'Aptos Coin', symbol: 'APT', decimals: 8 },
  rpcUrls: {
    default: {
      http: [
        'https://testnet.aptoslabs.com/v1',
        'https://api.testnet.aptoslabs.com/v1'
      ]
    }
  },
  indexerUrls: {
    default: {
      http: ['https://api.testnet.aptoslabs.com/v1/graphql']
    }
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.aptoslabs.com/?network=testnet',
    }
  },
  modules: {
    aptosFramework: {
      address: '0x1',
      blockCreated: 0,
    }
  }
})