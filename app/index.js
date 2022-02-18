const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');

const HTTP_PORT =  process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json());

app.get('/blocks',(req,res)=>{
  // bc.addBlock('two');
  res.json(bc.chain);
})

app.post('/mine',(req,res)=>{
  const block = bc.addBlock(req.body.data);
  console.log(`new block added ${block.toString()}`);
  // to syn chains after each mine
  p2pServer.syncChains();
  res.redirect('/blocks');
})

app.listen(HTTP_PORT,()=>{
  console.log(`Listening to ${HTTP_PORT} port`);
});
p2pServer.listen();
