'use strict';

const keccak256 = require('keccak256');

const mapParams = function(params) {
  return params.map(k => {
    const [ name, type ] = (k.includes(':') ? k.split(':') : ['', k]);
    return { name, type, internalType: type };
  });
};

const abiFn = function(name, stateMutability = 'nonpayable', inputs = '', outputs = '') {
  return {
    name,
    type: 'function',
    stateMutability,
    inputs: mapParams(inputs.split(',').filter(k => k.length)),
    outputs: mapParams(outputs.split(',').filter(k => k.length))
  };
};

const bruteFunc = function(_name, _types, _value) {
  let i = 0;
  for(;;) {
    const n = `${_name}_${String(i++).padStart(5,'0')}`;
    const k = keccak256(`${n}(${_types})`).toString('hex').substr(0, 3)
    if(k === _value) {
      return n;
    }
  }
};

module.exports = {
  abiFn,
  bruteFunc,
};
