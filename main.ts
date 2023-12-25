import { Account, Aptos, AptosConfig, Ed25519PrivateKey, InputGenerateTransactionOptions, Network, SignedTransaction } from "@aptos-labs/ts-sdk";
import { AptosClient } from "aptos";
import 'dotenv/config'
import moment from 'moment'

const TOKENS = require("./tokens.json");
// InputGenerateTransactionOptions
const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const TOKEN = process.argv[2];
if(!TOKENS.includes(TOKEN)) {
  console.log("请输入正确的token名称");
  process.exit();
}
console.log("APT20项目名称:", process.argv[2]);
// with custom configuration
(async() => {
  const aptosConfig = new AptosConfig({ network: Network.MAINNET});
  const aptos = new Aptos(aptosConfig); // default to devnet

  const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY || "");
  const account = Account.fromPrivateKey({ privateKey });
  console.log("账户地址:", account.accountAddress.toString());
  let count = 0;
  const ledgerInfo = await aptos.getLedgerInfo();
  while(true) {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        // function: "0x1fc2f33ab6b624e3e632ba861b755fd8e61d2c2e6cf8292e415880b4c198224d::apts::mint",
        // function: "0x1fc2f33ab6b624e3e632ba861b755fd8e61d2c2e6cf8292e415880b4c198224d::apts::mint",
        function: "0x1fc2f33ab6b624e3e632ba861b755fd8e61d2c2e6cf8292e415880b4c198224d::apts::mint",
        typeArguments: [],
        // functionArguments: ["APTS"],
        // functionArguments: ["move"],
        functionArguments: [TOKEN],
      },
      options: {
        // accountSequenceNumber: nonce+1,
        expireTimestamp: Date.now() + 60*1000,
        // maxGasAmount: 3000
      }
    });
    
    // using signAndSubmit combined
    const committedTransaction = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    });
    // console.log(JSON.stringify(committedTransaction));
    // await committedTransaction.
    await aptos.waitForTransaction({
      transactionHash: committedTransaction.hash,
      options: {
        timeoutSecs: 60
      }
    });
    console.log(moment().format("MM-DD HH:mm:ss"), "交易次数", count,"交易hash:", committedTransaction.hash);
    count++;
    await sleep(1000);
  }
  
})();

