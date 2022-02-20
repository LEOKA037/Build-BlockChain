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
}

module.exports = TransactionPool;
