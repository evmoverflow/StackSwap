'use strict';

const owner = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';

const addresses = require('./const/addresses');
const { assemble } = require('./lib/evm');
const { abiFn, bruteFunc } = require('./lib/abi');

const fs = require('fs');
const read = (path) => fs.readFileSync(path).toString('utf8');
const write = (path, data) => fs.writeFileSync(path, ''+data);

const setVars = function(data, params = {}) {
  let d = data;
  const entries = Object.entries(params);
  for(const [ k, v ] of entries) {
    d = d.replaceAll(new RegExp(`\\$${k}`, 'g'), v);
  }
  return d;
};

// ---

const main = read('./asm/main.s');
const revert = read('./asm/revert.s');

const swap_tft_none_noshift = read('./asm/swap_tft_none_noshift.s');
const swap_tft_none = read('./asm/swap_tft_none.s');
const swap_tftf_none = read('./asm/swap_tftf_none.s');
const swap_tft_adjust = read('./asm/swap_tft_adjust.s');
const swap_tftf_adjust = read('./asm/swap_tftf_adjust.s');

const swap_tft_mul = setVars(swap_tft_adjust, { op: 'mul' });
const swap_tftf_mul = setVars(swap_tftf_adjust, { op: 'mul' });
const swap_tft_div = setVars(swap_tft_adjust, { op: 'div' });
const swap_tftf_div = setVars(swap_tftf_adjust, { op: 'div' });

const swapT2C = setVars(swap_tft_none_noshift, { token0: addresses['USDT'], token1: addresses['USDC'] });
const swapC2T = setVars(swap_tft_none, { id: 1, token0: addresses['USDC'], token1: addresses['USDT'] });
const swapD2B = setVars(swap_tft_none, { id: 2, token0: addresses['DAI'], token1: addresses['BUSD'] });
const swapB2D = setVars(swap_tftf_none, { id: 3, token0: addresses['BUSD'], token1: addresses['DAI'] });

const swapT2B = setVars(swap_tft_mul, { id: 4, token0: addresses['USDT'], token1: addresses['BUSD'] });
const swapC2B = setVars(swap_tft_mul, { id: 5, token0: addresses['USDC'], token1: addresses['BUSD'] });
const swapT2D = setVars(swap_tftf_mul, { id: 6, token0: addresses['USDT'], token1: addresses['DAI'] });
const swapC2D = setVars(swap_tftf_mul, { id: 7, token0: addresses['USDC'], token1: addresses['DAI'] });

const swapD2C = setVars(swap_tft_div, { id: 8, token0: addresses['DAI'], token1: addresses['USDC'] });
const swapB2C = setVars(swap_tft_div, { id: 9, token0: addresses['BUSD'], token1: addresses['USDC'] });
const swapD2T = setVars(swap_tftf_div, { id: 10, token0: addresses['DAI'], token1: addresses['USDT'] });
const swapB2T = setVars(swap_tftf_div, { id: 11, token0: addresses['BUSD'], token1: addresses['USDT'] });

const getFee = read('./asm/getFee.s');
const getReturn = setVars(read('./asm/getReturn.s'), { padding: 'invalid\r\n'.repeat(34) });

const $adjustFees_Out = setVars(read('./asm/$adjustFees_Out.s'), { owner });
const $adjustFees_In = setVars(read('./asm/$adjustFees_In.s'), { owner, jump: (0x0f00 + 0x2b) });
const $adjustBalance = setVars(read('./asm/$adjustBalance.s'), { owner });

const jumpTable = [
  [ 0x0000, main ],
  [ 0x0100, swapT2C ],
  [ 0x0200, swapC2T ],
  [ 0x0300, swapD2B ],
  [ 0x0400, swapB2D ],
  [ 0x0500, swapT2B ],
  [ 0x0600, swapC2B ],
  [ 0x0700, swapT2D ],
  [ 0x0800, swapC2D ],
  [ 0x0900, swapD2C ],
  [ 0x0a00, swapB2C ],
  [ 0x0b00, swapD2T ],
  [ 0x0c00, swapB2T ],
  [ 0x0d00, getFee ],
  [ 0x0e00, getReturn ],
  [ 0x0f00, $adjustFees_Out ],
  [ 0x0f80, $adjustBalance ],
  [ 0x1000, revert ],
  [ 0x1100, revert ],
  [ 0x1200, revert ],
  [ 0x1300, revert ],
  [ 0x1400, revert ],
  [ 0x1500, revert ],
  [ 0x1600, revert ],
  [ 0x1700, revert ],
  [ 0x1800, revert ],
  [ 0x1900, revert ],
  [ 0x1a00, revert ],
  [ 0x1b00, revert ],
  [ 0x1c00, revert ],
  [ 0x1f00, $adjustFees_In ],
  [ 0x1f80, revert ],
];

// ---
// Assemble

let appBin = '';
let appAsm = '';
try {
  
for(const [ offset, code ] of jumpTable) {
  const n = appBin.length / 2;
  if(n > offset) throw new Error('Function overflows into the next offset.');
  appBin += 'fe'.repeat(offset - n);
  appAsm += 'invalid\r\n'.repeat(offset - n);
  
  try {
    const bin = assemble(offset, code);
    appBin += bin;
    appAsm += code;
    console.log(`0x${offset.toString(16)} -> ${bin.length / 2} bytes`);
  }
  catch(e) {
    console.log(offset, e);
    throw e;
  }
}

}
catch(e) {
  return console.log('fail.', e);
}
//console.log(appAsm);
write('./dist/debug.s', appAsm);
console.log('- debug.s wrote!');

// ---
// Remix debug contract

const debugLines = appBin.match(/.{1,250}/g).map((k, i) => { return `verbatim_0i_0o(hex'${k}')`; }).join('\n');
const debugYul = `object 'StackSwap' {
  code {
    datacopy(0, dataoffset('app'), datasize('app'))
    return (0, datasize('app'))
  }
  object 'app' {
    code {
${debugLines}
    }
  }
}
`;
write('./dist/debug.sol', debugYul);
console.log('- debug.sol wrote!');

// ---
// Contract ABI

const fnTable = {
  'swapT2C': [ '100', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapC2T': [ '200', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapD2B': [ '300', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapB2D': [ '400', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapT2B': [ '500', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapC2B': [ '600', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapT2D': [ '700', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapC2D': [ '800', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapD2C': [ '900', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapB2C': [ 'a00', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapD2T': [ 'b00', [ 'nonpayable', '_amountIn:uint256' ] ],
  'swapB2T': [ 'c00', [ 'nonpayable', '_amountIn:uint256' ] ],
  'getFee': [ 'd00', [ 'view', '_id:uint256', 'uint256' ] ],
  'getReturn': [ 'e00', [ 'view', '_id:uint256,_amountIn:uint256', 'uint256' ] ],
  '$adjustFees': [ 'f00', [ 'payable', '_amount:uint256' ] ],
  '$adjustBalance': [ 'f80', [ 'nonpayable', '_token:address,_amount:uint256' ] ],
};

const fnNames = Object.fromEntries(Object.entries(fnTable).map(([name, [offset, params]]) => {
  console.log({ offset, params });
  return [ name, bruteFunc(name, params[1].split(',').map(k => (k.includes(':') ? k.split(':')[1] : k)), offset) ];
}));

const abiTable = Object.entries(fnTable).map(([name, [, params]]) => abiFn(fnNames[name], ...params));
console.log(abiTable);
write('./dist/abi.json', JSON.stringify(abiTable, null, 2));
console.log('- abi.json wrote!');

// ---
// Remix ABI debug contract

const debugABILines = Object.entries(fnTable).map(([name, [, [modifier, inputs = '', outputs = '']]]) => {
  const ins = inputs.split(',').map(k => k.includes(':') ? k.split(':').reverse().join(' ') : k).join(', ');
  const outs = outputs.split(',').map(k => k.includes(':') ? k.split(':').reverse().join(' ') : k).join(', ');
  const mod = (modifier === 'nonpayable' ? '' : ` ${modifier}`);
  const returns = outs.length ? ` returns (${outs})` : '';
  return `function ${fnNames[name]}(${ins}) external${mod}${returns} {}`;
}).join('\n');

const debugABI = `pragma solidity =0.8.7;

contract StackSwapABI {
${debugABILines}
}
`;
console.log(debugABI);
write('./dist/debugABI.sol', debugABI);
console.log('- debugABI.sol wrote!');

// ---
// Balance needed

const fees = [
  3000, // USDT-USDC = 0.03333%
  3000, // USDC-USDT = 0.03333%
  2000, // DAI-BUSD = 0.05%
  1500, // BUSD-DAI = 0.06666%
  2000, // USDT-BUSD = 0.05%
  2000, // USDC-BUSD = 0.05%
  1500, // USDT-DAI = 0.06666%
  1500, // USDC-DAI = 0.06666%
  3000, // DAI-USDC = 0.03333%
  2000, // BUSD-USDC = 0.05%
  3000, // DAI-USDT = 0.03333%
  2000, // BUSD-USDT = 0.05%
];
const balance = fees.reduce((r, v, i) => (r | (BigInt(v) / 100n) << (5n * BigInt(i))), 0n);
console.log({ balance });
write('./dist/balance.txt', balance);
console.log('- balance.txt wrote!');

// ---
// Deploy bytecode

const deployer = assemble(0, setVars(read('./asm/deployer.s'), { offset: 10, size: (appBin.length / 2) }));
const byteCode = deployer + appBin;
write('./dist/bytecode.txt', byteCode);
console.log('- bytecode.txt wrote!');
