const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'recieverOne';
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it('outputs the `amount` subtracted from the wallet balance', () => {
    expect(transaction.outputs.find(output => output.senderAddress === wallet.publicKey).balanceAmount)
      .toEqual(wallet.balance - amount);
  });

  it('outputs the `amount` added to the recipient', () => {
  expect(transaction.outputs.find(output => output.recipientAddress === recipient).amountSent)
    .toEqual(amount);
  });

  describe('transacting with an amount that exceeds the balance', () => {
  beforeEach(() => {
    amount = 50000;
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it('does not create the transaction', () => {
    expect(transaction).toEqual(undefined);
  });

  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  // test case which updates the existing transaction with a new transfer
  // and checking the transferred amount
  describe('and updating a transaction', () => {
  let nextAmount, nextRecipient;

  beforeEach(() => {
    nextAmount = 20;
    nextRecipient = 'second-receiver';
    transaction = transaction.update(wallet, nextRecipient, nextAmount);
  });

  it(`subtracts the next amount from the sender's output`, () => {
    expect(transaction.outputs.find(output => output.senderAddress === wallet.publicKey).balanceAmount)
      .toEqual(wallet.balance - amount - nextAmount);
  });

  it('outputs an amount for the next recipient', () => {
    expect(transaction.outputs.find(output => output.recipientAddress === nextRecipient).amountSent)
      .toEqual(nextAmount);
  });
  });


})
