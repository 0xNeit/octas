import { defineChain } from '@octas/utils';

export const cedraTestnet = /*#__PURE__*/ defineChain({
  id: 2,
  name: 'Cedra Testnet',
  nativeCurrency: { name: 'Cedra Coin', symbol: 'CED', decimals: 8 },
  rpcUrls: {
    default: {
      http: ['https://testnet.cedra.dev/v1'],
    },
  },
  indexerUrls: {
    default: {
      http: ['https://graphql.cedra.dev/v1/graphql'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Cedra Explorer',
      url: 'https://cedrascan.com',
    },
  },
  modules: {
    cedraFramework: {
      address: '0x1',
      blockCreated: 1,
    },
  },
});
