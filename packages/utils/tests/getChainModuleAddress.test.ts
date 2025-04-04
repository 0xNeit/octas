import { expect, test } from 'vitest'

import { aptos, movement, aptosTestnet } from './fixtures/chains'

import { getChainModuleAddress } from '../src/chain/getChainModuleAddress'
import { version } from '../src/version'

test('default', () => {
  expect(
    getChainModuleAddress({
      chain: aptos,
      module: 'aptosFramework',
    }),
  ).toMatchInlineSnapshot('"0x1"')
  expect(
    getChainModuleAddress({
      chain: movement,
      module: 'aptosFramework',
    }),
  ).toMatchInlineSnapshot('"0x1"')
  expect(
    getChainModuleAddress({
      chain: aptosTestnet,
      module: 'aptosFramework',
    }),
  ).toMatchInlineSnapshot('"0x1"')
})

test('no contract', () => {
  expect(() =>
    getChainModuleAddress({
      chain: {
        ...aptos,
        modules: {},
      },
      module: 'aptosFramework',
    }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ChainDoesNotSupportModule: Chain "Aptos" does not support module "aptosFramework".

    This could be due to any of the following:
    - The chain does not have the module "aptosFramework" configured.

    Version: octas@${version}]
  `)
})

test('block number is less than created block number', () => {
  expect(() =>
    getChainModuleAddress({
      blockHeight: 69420n,
      chain: {
        ...aptos,
        modules: {
          aptosFramework: {
            ...aptos.modules.aptosFramework,
            blockCreated: 123456789,
          },
        },
      },
      module: 'aptosFramework',
    }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ChainDoesNotSupportModule: Chain "Aptos" does not support module "aptosFramework".

    This could be due to any of the following:
    - The module "aptosFramework" was not deployed until block 123456789 (current block 69420).

    Version: octas@${version}]
  `)
})
