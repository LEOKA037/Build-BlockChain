const Block = require('./block.js');
const DIFFICULTY = require('../config.js');

describe('Block',()=>{
  let data,lastBlock,localBlock;

  beforeEach(()=>{
    data = 'test Data';
    lastBlock = Block.genesis();
    localBlock = Block.mineBlock(lastBlock,data);
  });

  it('sets `data` to match the input', ()=>{
    expect(localBlock.data).toEqual(data);
  });

  it('set the `lastHash` to match the last hash of the block', ()=>{
    expect(localBlock.lastHash).toEqual(lastBlock.hash);
  });

  it('DIFFICULTY level check',()=>{
    expect(localBlock.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
  });

  it('DIFFICULTY dynamic',()=>{

    expect(Block.adjustDifficutly(localBlock,localBlock.timestamp+36000)).toEqual(localBlock.difficutly-1);
  });
})
