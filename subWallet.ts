import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import * as fs from 'node:fs';

type Wallet = {
  privateKey: string;
  address: string;
}

const wallets: Wallet[] = [];

for(let i = 0 ; i < 50 ;i++) {
  const account = Account.generate();
  console.log("钱包地址", account.accountAddress.toString());
  console.log("钱包私钥", account.privateKey.toString());
  wallets.push({
    privateKey: account.privateKey.toString(),
    address: account.accountAddress.toString(),
  });
}

fs.writeFileSync("./sub-wallet.json", JSON.stringify(wallets, null ,4));

console.log("生成50个钱包地址完成，私钥和地址保存在sub-wallet.json文件中");