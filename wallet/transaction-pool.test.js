const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
  let tp, wallet, transaction, bc;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet,'first-reciever', 30);
    tp.updateOrAddTransaction(transaction);
  });

  it('adds a transaction to the pool', () => {
  expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {
  const oldTransaction = JSON.stringify(transaction);
  const newTransaction = transaction.update(wallet, 'second-reciever', 40);
  tp.updateOrAddTransaction(newTransaction);

  expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
    .not.toEqual(oldTransaction);
  });

})
