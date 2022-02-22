const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction{
  constructor(){
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  /*
  this function is to update an existing transaction
  ie. adding more transfers to the same transaction
  if sender sents amount to multiple receipents
  */
  update(senderWallet, recipient, amount) {
  const senderOutput = this.outputs.find(output => output.senderAddress === senderWallet.publicKey);

  if (amount > senderOutput.balanceAmount) {
    console.log(`Amount: ${amount} exceeds balance.`);
    return;
  }

  senderOutput.balanceAmount = senderOutput.balanceAmount - amount;
  this.outputs.push({ amountSent: amount, recipientAddress : recipient });
  Transaction.signTransaction(this, senderWallet);

  return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
  const transaction = new this();
  transaction.outputs.push(...outputs);
  Transaction.signTransaction(transaction, senderWallet);
  return transaction;
  }

  static newTransaction(senderWallet,recipient,amount){

    if(amount > senderWallet.balance){
      console.log(`Amount ${amount} is more than balance`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      //first will be the sender's details : balance and public key
      {balanceAmount : senderWallet.balance - amount, senderAddress : senderWallet.publicKey},
      //first will be the reciever's details : amount transfered and public key
      { amountSent: amount, recipientAddress : recipient}
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
  return Transaction.transactionWithOutputs(blockchainWallet, [{
    amountSent: MINING_REWARD, recipientAddress: minerWallet.publicKey
  }]);
  }

  // sets the input of the transaction
  static signTransaction(transaction,senderWallet){
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    }
  }

  static verifyTransaction(transaction) {
  return ChainUtil.verifySignature(
    transaction.input.address,
    transaction.input.signature,
    ChainUtil.hash(transaction.outputs)
  );
  }


  toString(){
    return `id : ${this.id}
    input : ${this.input}
    outputs : ${JSON.stringify(this.outputs)}`;
  }

}

module.exports = Transaction;
