import { Abi, AbiTable, DefaultAbiTable } from '@octas/abi';
import { Address } from '@octas/types';
import { OctaClient } from '../client';

export type GetModuleParameters<
  abi extends Abi = Abi,
  client extends OctaClient<AbiTable> = OctaClient<DefaultAbiTable>,
  address extends Address = Address,
> = {
  /** Module ABI */
  abi: abi;
  /** Module address */
  address: address;
  /** Aptos client */
  client: client;
};

export function getModule<
  address extends Address,
  const abi extends Abi,
  const client extends OctaClient<AbiTable>,
>({
  abi,
  address,
  client: client_,
}: GetModuleParameters<abi, client, address>) {
  const module = client_.getMethods(abi, address);

  return module;
}
