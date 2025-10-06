import { Abi } from './abi';

/**
 * Checks if type is {@link Abi}.
 *
 * @param abi - {@link Abi} to check
 * @returns Boolean for whether {@link abi} is {@link Abi}
 */
export type IsAbi<abi> = abi extends Abi ? true : false;
