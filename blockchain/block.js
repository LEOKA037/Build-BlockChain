const SHA256 = require('crypto-js/sha256');
const {DIFFICULTY, MINE_RATE} = require('../config');

class Block{
  constructor(timestamp,lastHash,hash,data,nonce,difficutly){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficutly=difficutly || DIFFICULTY;
  }

  toString(){
    return `Block -
      Timestamp: ${this.timestamp}
      LastHash: ${this.lastHash.substring(0,10)}
      Hash: ${this.hash.substring(0,10)}
      Nonce: ${this.nonce}
      Data: ${this.data}
      Difficutly: ${this.difficutly}`
   }

   static genesis(){
     return new this('Genesis Time','0000000','00000001',['First Genesis Block Data'],0,0);
   }

   static mineBlock(lastBlock,data){
     let currentHash,timestamp;

     const lastHash = lastBlock.hash;
     let nonce = 0;

     let {difficutly} = lastBlock;

     do{
       nonce++;
       timestamp = Date.now();
       difficutly = Block.adjustDifficutly(lastBlock,timestamp);
       currentHash = Block.hash(timestamp,lastHash,data,nonce,difficutly);
     } while(currentHash.substring(0,difficutly) != '0'.repeat(difficutly));

     return new this(timestamp,lastHash,currentHash,data,nonce,difficutly);
   }

   static adjustDifficutly(lastBlock,currentTimestamp){
     let {difficutly} = lastBlock;
     if(lastBlock.timestamp + MINE_RATE > currentTimestamp){
       return difficutly+1;
     }
     return difficutly-1;

   }

   static hash(timestamp,lastHash,data,nonce,difficutly){

     return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficutly}`).toString();

   }

   static blockHash(block){
     const {timestamp,lastHash,data,nonce,difficutly} = block;
     return Block.hash(timestamp,lastHash,data,nonce,difficutly);
   }


}

 module.exports = Block;
