# :adjustFees_Out
jumpdest

# call(gas(), caller(), calldataload(0x4), 0, 0, 0, 0)
callvalue
callvalue
callvalue
callvalue
push1 0x4
calldataload
caller
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
msize
msize
revert

# stop()
jumpdest
stop
