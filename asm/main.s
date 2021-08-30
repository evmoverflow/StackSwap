# jump(shl(12, gt(callvalue(), 0)) + shr(244, calldataload(0)))
msize
calldataload
push1 0xf4
shr
msize
callvalue
gt
push1 0x0c
shl
add
jump
