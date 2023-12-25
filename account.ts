import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const account = Account.generate();
console.log("钱包地址", account.accountAddress.toString())
console.log("钱包私钥", account.privateKey.toString())

const naccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(account.privateKey.toString())
});

console.log("钱包地址:", naccount.accountAddress.toString())