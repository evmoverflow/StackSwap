# :$adjustBalance
jumpdest

# mstore(0x0, 0xa9059cbb)
push4 0xa9059cbb
msize
mstore

# mstore(0x20, caller())
caller
msize
mstore

# mstore(0x40, calldataload(0x24))
push1 0x24
calldataload
msize
mstore

# call(gas(), calldataload(0x4), 0, 0x1c, 0x44, 0, 0)
callvalue
callvalue
push1 0x44
push1 0x1c
callvalue
push1 0x4
calldataload
gas
call

# jump((pc() + 4) + (eq($owner, caller()) * 4))
push20 $owner
caller
eq
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
