import {
  COIN_ABI,
  aptos,
  aptosAccountToAccountSource,
  createClient,
  toAccount,
} from 'octas';
import { Account as AptosAccount } from '@aptos-labs/ts-sdk';

export async function main() {
  const aptosAccount = AptosAccount.generate();
  const account = toAccount(aptosAccountToAccountSource(aptosAccount));
  const client = createClient({
    chain: aptos,
    account: account,
  });

  const coinModule = client.octaClient.getMethods(COIN_ABI, '0x1');
  const balance = await coinModule.view.paired_metadata({
    typeArguments: ['0x1::aptos_coin::AptosCoin'],
    functionArguments: [],
    //ledgerVersion: "1",
  });

  console.log(balance[0]);
}

main();
