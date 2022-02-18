// const Block = require('./block');
//
// // const block = new Block('time','lastHash','currentHash','data');
// // console.log(block.toString());
// // console.log(Block.genesis().toString());
//
// const mineBlock1 = Block.mineBlock(Block.genesis(),"Second");
// console.log(mineBlock1.toString());

// const Blockchain = require('./blockchain');
//
// const bc = new Blockchain();
//
//
// for(let i =0;i<10;i++){
//   console.log(bc.addBlock(`data ${i}`).toString());
// }

const Wallet = require('./wallet');
const Transaction = require('./wallet/transaction');

const wallet = new Wallet();
console.log(wallet.toString());
const amount = 50;
const recipient = 'recieverOne';
const transaction = Transaction.newTransaction(wallet, recipient, amount);
console.log(transaction.toString());
