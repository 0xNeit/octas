"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const octas_1 = require("octas");
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
async function main() {
    const aptosAccount = ts_sdk_1.Account.generate();
    const account = (0, octas_1.toAccount)((0, octas_1.aptosAccountToAccountSource)(aptosAccount));
    const client = (0, octas_1.createClient)({
        chain: octas_1.aptos,
        account: account,
    });
    const coinModule = client.octaClient.getMethods(octas_1.COIN_ABI, '0x1');
    const balance = await coinModule.view.paired_metadata({
        typeArguments: ['0x1::aptos_coin::AptosCoin'],
        functionArguments: [],
        //ledgerVersion: "1",
    });
    console.log(balance[0]);
}
main();
