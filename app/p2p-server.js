const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer{
  constructor(blockchain, transactionPool){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen(){
    // opens a Web socket for this app
    const server = new Websocket.Server({ port : P2P_PORT});
    server.on('connection', socket => this.connectSocket(socket));
    // connects to the other web sockets
    this.connectPeers();
    console.log(`Listening to p2p connection ${P2P_PORT}`);
  }

  connectSocket(socket){
    //connects the ws
    this.sockets.push(socket);
    console.log('Socket is connected');
    //syns the chain with the data in the socket
    this.messageHandler(socket);
    //sends the socket to all the peers
    this.sendChain(socket);
  }

  connectPeers(){
    //peers list is got from when each app is started
    peers.forEach(peer =>{
      //ws://localhost:5001
      const socket = new Websocket(peer);
      socket.on('open',()=>{
        this.connectSocket(socket);
      });
    });
  }

  messageHandler(socket){
    socket.on('message',message =>{
      const data = JSON.parse(message);
      console.log('data',data);
      switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
        }
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  syncChains(){
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }

  broadcastTransaction(transaction) {
  this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clear_transactions
    })));
}
}

module.exports = P2pServer;
