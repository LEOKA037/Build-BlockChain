const Transaction = require('./transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
      let transactionWithId = this.transactions.find(t => t.id === transaction.id);

      if (transactionWithId) {
        this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
      } else {
        this.transactions.push(transaction);
      }
  }

  // check if a transaction exists in the pool
  existingTransaction(address) {
  return this.transactions.find(t => t.input.address === address);
  }

  validTransactions() {
  return this.transactions.filter(transaction => {
    const outputTotal = transaction.outputs.reduce((total, output) => {
      let currentTotal;
      if(output.amountSent != undefined || output.amountSent != null){
        currentTotal = total + output.amountSent;
      }
      else {
        currentTotal = total + output.balanceAmount;
      }
      return currentTotal;
    }, 0);

    if (transaction.input.amount !== outputTotal) {
      console.log(`Invalid transaction from ${transaction.input.address}.`);
      return;
    }

    if (!Transaction.verifyTransaction(transaction)) {
      console.log(`Invalid signature from ${transaction.input.address}.`);
      return;
    }

    return transaction;
  });
}

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
