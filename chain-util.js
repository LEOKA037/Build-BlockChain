const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { v1: uuidv1 } = require('uuid');
const SHA256 = require('crypto-js/sha256');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id(){
    return uuidv1();
  }

  static hash(data) {
  return SHA256(JSON.stringify(data)).toString();
  }

  // the signature we create from private and data
  // is vertified using the public key , signature and data (hash)
  static verifySignature(publicKey, signature, dataHash) {
  return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }

}

module.exports = ChainUtil;