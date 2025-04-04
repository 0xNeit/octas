import { defineChain } from '@octas/utils'

export const aptos = /*#__PURE__*/ defineChain({
  id: 1,
  name: 'Aptos',
  nativeCurrency: { name: 'Aptos Coin', symbol: 'APT', decimals: 8 },
  rpcUrls: {
    default: {
      http: [
        'https://mainnet.aptoslabs.com/v1',
        'https://api.mainnet.aptoslabs.com/v1'
      ]
    }
  },
  indexerUrls: {
    default: {
      http: ['https://api.mainnet.aptoslabs.com/v1/graphql']
    }
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.aptoslabs.com',
    }
  },
  modules: {
    aptosFramework: {
      address: '0x1',
      blockCreated: 1,
    }
  }
})