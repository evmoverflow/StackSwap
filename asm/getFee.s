# :getFee
jumpdest

# mstore(0, (and(shr(calldataload(0x4), selfbalance()), 0x1f) * 100))
push1 0x64
push1 0x1f
selfbalance
push1 0x5
push1 0x4
calldataload
mul
shr
and
mul
msize
mstore

# return(0, 0x20)
msize
callvalue
return
