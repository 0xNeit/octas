import {
  Account,
  AccountAddressInput,
  Aptos,
  CommittedTransactionResponse,
  LedgerVersionArg,
  MoveValue,
  PublicKey,
  UserTransactionResponse,
  WaitForTransactionOptions,
} from '@aptos-labs/ts-sdk';
import {
  Abi,
  AbiEntryClient,
  AbiResourceClient,
  AbiSimulateClient,
  AbiTable,
  AbiViewClient,
  DefaultAbiTable,
} from '@octas/abi';
import { EntryPayload, ViewPayload } from './types/client';
import { createViewPayload } from './actions/createViewPayload';
import { Address } from '@octas/types';
import { createEntryPayload } from './actions/createEntryPayload';

export function createOctaClient<TAbiTable extends AbiTable = DefaultAbiTable>(
  aptos: Aptos
): OctaClient<TAbiTable> {
  return new OctaClient<TAbiTable>(aptos);
}

export class OctaClient<TAbiTable extends AbiTable> {
  private aptos: Aptos;
  private readClient?: Aptos;

  constructor(aptos: Aptos, readClient?: Aptos) {
    this.aptos = aptos;
    this.readClient = readClient;
  }

  public async view<TReturn extends MoveValue[]>(args: {
    payload: ViewPayload<TReturn>;
    options?: LedgerVersionArg;
  }): Promise<TReturn> {
    const result = await this.aptos.view(args);
    return result as TReturn;
  }

  public async submitTransaction(args: {
    signer: Account;
    payload: EntryPayload;
    options?: WaitForTransactionOptions;
  }): Promise<CommittedTransactionResponse> {
    const transaction = await this.aptos.transaction.build.simple({
      sender: args.signer.accountAddress.toString(),
      data: {
        function: args.payload.function,
        typeArguments: args.payload.typeArguments,
        functionArguments: args.payload.functionArguments,
      },
    });

    const transactionResponse =
      await this.aptos.transaction.signAndSubmitTransaction({
        signer: args.signer,
        transaction,
      });

    let resolvedTxn: CommittedTransactionResponse;

    if (this.readClient) {
      resolvedTxn = await this.readClient.waitForTransaction({
        transactionHash: transactionResponse.hash,
        options: args.options ?? {},
      });
    } else {
      resolvedTxn = await this.aptos.waitForTransaction({
        transactionHash: transactionResponse.hash,
        options: args.options ?? {},
      });
    }

    return resolvedTxn;
  }

  public async simulateTransaction(args: {
    publicKey: PublicKey;
    sender: AccountAddressInput;
    payload: EntryPayload;
  }): Promise<UserTransactionResponse> {
    const transaction = await this.aptos.transaction.build.simple({
      sender: args.sender,
      data: {
        function: args.payload.function,
        typeArguments: args.payload.typeArguments,
        functionArguments: args.payload.functionArguments,
      },
    });

    const response = await this.aptos.transaction.simulate.simple({
      signerPublicKey: args.publicKey,
      transaction,
    });

    return response[0] as UserTransactionResponse;
  }

  public async fetchABI<T extends Abi>(
    address: string,
    moduleName: string
  ): Promise<T> {
    const abi = await this.aptos.getAccountModule({
      accountAddress: address,
      moduleName: moduleName,
    });

    return abi.abi as unknown as T;
  }

  public getMethods<T extends Abi>(abi: T, address?: string) {
    const view = new Proxy({} as AbiViewClient<T>, {
      get: (_, prop) => {
        const functionName = prop.toString();
        return (...args: any[]) => {
          const payload = createViewPayload(abi, {
            address: (address ?? abi.address) as Address,
            function: functionName,
            typeArguments: args[0].typeArguments,
            functionArguments: args[0].functionArguments,
          });

          return this.view({
            payload,
            options: {
              ledgerVersion: args[0].ledgerVersion,
            },
          });
        };
      },
    });

    const entry = new Proxy({} as AbiEntryClient<T>, {
      get: (_, prop) => {
        const functionName = prop.toString();

        return (...args: any[]) => {
          const payload = createEntryPayload(abi, {
            address: (address ?? abi.address) as `0x${string}`,
            function: functionName,
            typeArguments: args[0].typeArguments,
            functionArguments: args[0].functionArguments,
          });

          return this.submitTransaction({
            signer: args[0].account,
            payload,
          });
        };
      },
    });

    const simulate = new Proxy({} as AbiSimulateClient<T>, {
      get: (_, prop) => {
        const functionName = prop.toString();

        return (...args: any[]) => {
          const payload = createEntryPayload(abi, {
            address: (address ?? abi.address) as `0x${string}`,
            function: functionName,
            typeArguments: args[0].typeArguments,
            functionArguments: args[0].functionArguments,
          });

          const account: Account = args[0].account;
          return this.simulateTransaction({
            publicKey: account.publicKey,
            sender: account.accountAddress.toString(),
            payload,
          });
        };
      },
    });

    const resource = new Proxy({} as AbiResourceClient<TAbiTable, T>, {
      get: (_, prop) => {
        let structName = prop.toString();
        return (...args: any[]) => {
          if (args[0].typeArguments.length !== 0) {
            structName += `<${args[0].typeArguments.join(',')}>`;
          }

          const account: AccountAddressInput = args[0].account;

          return this.aptos.getAccountResource({
            accountAddress: account,
            resourceType: `${address ?? abi.address}::${abi.name}::${structName}`,
            options: {
              ledgerVersion: args[0].ledgerVersion,
            },
          });
        };
      },
    });

    return {
      view,
      entry,
      simulate,
      resource,
    };
  }
}
