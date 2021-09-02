# :swap_tftf_none
jumpdest

# _amount = calldataload(0x4)
push1 0x4
calldataload

# mstore(0x0, 0x23b872dd00000000000000000000000000000000000000000000000023b872dd)
push32 0x23b872dd00000000000000000000000000000000000000000000000023b872dd
msize
mstore

# mstore(0x20, caller())
caller
msize
mstore

# mstore(0x40, address())
address
msize
mstore

# mstore(0x60, _amount)
dup1
msize
mstore

# _res1 = call(gas(), $token0, 0, 0x1c, 0x64, 0, 0)
callvalue
callvalue
push1 0x64
push1 0x1c
callvalue
push20 $token0
gas
call

# mstore(0x4, address())
address
push1 0x4
mstore

# mstore(0x24, caller())
caller
push1 0x24
mstore

# mstore(0x44, _amount - (_amount / (and(shr($id, selfbalance()), 0x1f) * 100)))
push1 0x64
push1 0x1f
selfbalance
push1 %($id * 5)
shr
and
mul
dup3
div
dup3
sub
push1 0x44
mstore

# _res2 = call(gas(), $token1, 0, 0, 0x64, 0, 0)
callvalue
callvalue
push1 0x64
callvalue
callvalue
push20 $token1
gas
call

# jump((pc() + 4) + (and(res1, res2) * 4))
and
push1 0x2
shl
push2 %(pc + 4)
add
jump

# revert(0, 0)
jumpdest
callvalue
callvalue
revert

# stop()
jumpdest
stop
