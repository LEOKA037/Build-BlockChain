const Block = require('./block');

// const block = new Block('time','lastHash','currentHash','data');
// console.log(block.toString());
// console.log(Block.genesis().toString());

const mineBlock1 = Block.mineBlock(Block.genesis(),"Second");
console.log(mineBlock1.toString());
