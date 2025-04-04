import {
  ChainDoesNotSupportModule,
  type ChainDoesNotSupportModuleErrorType,
} from '@octas/errors'
import { Chain, ChainModule } from '@octas/types'

export type GetChainModuleAddressErrorType =
  ChainDoesNotSupportModuleErrorType

export function getChainModuleAddress({
  blockHeight,
  chain,
  module: name,
}: {
  blockHeight?: bigint | undefined
  chain: Chain
  module: string
}) {
  const module = (chain?.modules as Record<string, ChainModule>)?.[name]
  if (!module)
    throw new ChainDoesNotSupportModule({
      chain,
      module: { name },
    })

  if (
    blockHeight &&
    module.blockCreated &&
    module.blockCreated > blockHeight
  )
    throw new ChainDoesNotSupportModule({
      blockHeight,
      chain,
      module: {
        name,
        blockCreated: module.blockCreated,
      },
    })

  return module.address
}
