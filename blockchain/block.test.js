const Block = require('./block.js');

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
})
