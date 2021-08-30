'use strict';

const opcodes = require('../const/opcodes');

const assemble = function(base, code) {
  const ops = code.split('\r\n').map(l => {
    return l.replaceAll(/[\/\/|#].*/g, '').replaceAll(/^\s+/g, '').replaceAll(/\s+$/g, '').replaceAll(/\s\s+/g, ' ');
  }).filter(l => {
    return l.length;
  }).map(l => {
    const idx = l.indexOf(' ');
    return ((idx === -1) ? [ l ] : [ l.substr(0, idx), l.substr(idx + 1) ]);
  });
  console.log(ops);
  
  let bytes = '';
  for(const op of ops) {
    if(!opcodes.hasOwnProperty(op[0])) throw new Error(`Unknown opcode 0x${base.toString(16)}:${op[0]}.`);
    bytes += opcodes[op[0]];
    if(op.length > 1) {
      const n = parseInt(op[0].substr(4)) * 2;
      
      let val;
      if(op[1].startsWith('%')) {
        val = eval(op[1].substr(1).replaceAll(/pc/g, base + (bytes.length / 2)));
      }
      else {
        val = BigInt(op[1]);
      }
      
      const str = val.toString(16);
      if(str.length > n) throw new Error(`Integer overflow at push${n/2} 0x${str}.`);
      
      bytes += str.padStart(n, '0');
    }
  }
  return bytes;
};

module.exports = {
  assemble,
};
