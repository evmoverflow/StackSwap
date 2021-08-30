# :swap_tft_none_noshift
jumpdest

# _amount = calldataload(0x4)
push1 0x4
calldataload

# mstore(0x0, 0xa9059cbb00000000000000000000000000000000000000000000000023b872dd)
push32 0xa9059cbb00000000000000000000000000000000000000000000000023b872dd
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

# mstore(0x4, caller())
caller
push1 0x4
mstore

# mstore(0x24, _amount - (_amount / (and(selfbalance(), 0x1f) * 100)))
push1 0x64
push1 0x1f
selfbalance
and
mul
dup2
div
dup2
sub
push1 0x24
mstore

# _res2 = call(gas(), $token1, 0, 0, 0x44, 0, 0)
callvalue
callvalue
push1 0x44
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
