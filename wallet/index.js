const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');

class Wallet{
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
    publicKey: ${this.publicKey.toString()}
    keyPair: ${this.keyPair.toString()}
    balance: ${this.balance}`
  }

  sign(dataHash){
    return this.keyPair.sign(dataHash);
  }

  /*
  this function is for creating a transaction
  */
  createTransaction(recipient, amount, blockchain, transactionPool) {

  this.balance = this.calculateBalance(blockchain);

  if (amount > this.balance) {
    console.log(`Amount: ${amount} exceceds current balance: ${this.balance}`);
    return;
  }

  let transaction = transactionPool.existingTransaction(this.publicKey);

  if (transaction) {
    transaction.update(this, recipient, amount);
  } else {
    transaction = Transaction.newTransaction(this, recipient, amount);
    transactionPool.updateOrAddTransaction(transaction);
  }

  return transaction;
  }

  static blockchainWallet() {
  const blockchainWallet = new this();
  blockchainWallet.address = 'blockchain-wallet';
  return blockchainWallet;
  }

  /*
  The logic of calulating the balance of a public key is

  Step 1: Find the most recent transaction "by" the wallet
          ie. finding the transaction whose transaction input timestamp is the largest
              and find the balance amount from the output of the most recent transaction
  Step 2: Find all the incoming tranactions "to" the wallet
          from the most recent transaction "by" the wallet
          and add that to the balance found in Step 1.
          ie. finding the transaction whose transaction input timestamp
              more than the timestamp of most recent trnasaction by the wallet
              and the input has a tranaction to the wallet.
              and add that amount to the balance amount found in Step 1.
  */
  calculateBalance(blockchain) {
    // console.log(`${JSON.stringify(blockchain)}`);
    let balance = this.balance;
    let transactions = [];
    blockchain.chain.forEach(block => block.data.forEach(transaction => {
      transactions.push(transaction);
    }));

    // console.log(`${JSON.stringify(transactions)}`);

    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publicKey);

    let startTime = 0;

    //Step 1
    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInputT.outputs.find(output => output.senderAddress === this.publicKey).balanceAmount;
      startTime = recentInputT.input.timestamp;
    }

    //Step 2
    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.recipientAddress === this.publicKey) {
            balance += output.amountSent;
          }
        });
      }
    });

    return balance;
  }


}

module.exports = Wallet;
