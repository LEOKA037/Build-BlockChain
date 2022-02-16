const Blockchain = require('./index.js');
const Block = require('./block.js');

describe('Blockchain',()=>{

  let bc,bc2;

  beforeEach(()=>{
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('starts with genesis block', ()=>{
    expect(bc.chain[0].data).toEqual(Block.genesis().data);
  });

  it('add a new block',()=>{
    const newData = 'addOne';
    bc.addBlock(newData);
    expect(bc.chain[bc.chain.length-1].data).toEqual(newData);
  });

  it('check if valid chain',()=>{
    bc2.addBlock('addTwo');
    expect(bc2.isValidChain(bc.chain)).toBe(true);
  });

  it('check if first block is genesis',()=>{
    bc2.chain[0].data = 'addThree';
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('check if previous block is not valid',()=>{
    bc2.addBlock('addFour');
    bc2.chain[0].data = 'addFive';
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('check if the new chain is valid',()=>{
    bc.addBlock('FirstBlock');
    bc.addBlock('SecondBlock');
    // expect(bc.isValidChain(bc.chain)).toBe(true);
    // expect(bc2.chain.length).toEqual(1);
    // expect(bc.chain.length).toEqual(3);
    // expect(bc2.isValidChain(bc2.chain)).toBe(true);
    bc2.replaceChain(bc.chain);
    expect(bc2.chain.length).toEqual(3);
    expect(bc2.chain).toEqual(bc2.chain);

    bc.addBlock('ThirdBlock');
    bc.replaceChain(bc2.chain);
    expect(bc.chain.length).toEqual(4);
    // expect(bc2.chain.length).toEqual(3);
    // expect(bc.isValidChain(bc2.chain)).toBe(true);
    // expect(bc.chain[bc.chain.length-1].data).toEqual('SecondBlock');
  });
});
