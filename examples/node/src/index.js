"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const octas_1 = require("octas");
async function main() {
    const octaClient = new octas_1.OctaClient(octas_1.aptos);
    const coinModule = octaClient.getMethods(octas_1.COIN_ABI, '0x1');
    const balance = await coinModule.view.paired_metadata({
        typeArguments: ['0x1::aptos_coin::AptosCoin'],
        functionArguments: [],
        //ledgerVersion: "1",
    });
    console.log(balance[0]);
}
main();
