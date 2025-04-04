import { expect, test } from 'vitest'

import * as exports from '../src/index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "assertCurrentChain",
      "defineChain",
      "extractChain",
      "getChainModuleAddress",
      "version",
    ]
  `)
})
