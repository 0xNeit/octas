import { COIN_ABI, aptos, createClient } from 'octas';

export async function main() {
  const client = createClient({
    chain: aptos,
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
