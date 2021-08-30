# :getReturn
jumpdest

# _id = calldataload(0x4)
push1 0x4
calldataload

# _amount = calldataload(0x24)
push1 0x24
calldataload

# jump((pc() + 4) + (((_id < 8) << 1) | (_id < 4)))
push1 0x8
dup3
lt
chainid
shl
push1 0x4
dup4
lt
or
push1 0x5
shl
push2 %(pc + 4)
add
jump

# :div
jumpdest

# _amount = _amount / 1e12
push5 0xe8d4a51000
dup2
div

# mstore(0x24, _amount - (_amount / (and(shr(($id * 5), selfbalance()), 0x1f) * 100)))
push1 0x64
push1 0x1f
selfbalance
push1 0x5
dup7
mul
shr
and
mul
dup2
div
dup2
sub
msize
mstore

# return(0, 0x20)
msize
callvalue
return

# padding
$padding

# :mul
jumpdest

# _amount = _amount * 1e12
push5 0xe8d4a51000
dup2
mul

# mstore(0x24, _amount - (_amount / (and(shr(($id * 5), selfbalance()), 0x1f) * 100)))
push1 0x64
push1 0x1f
selfbalance
push1 0x5
dup7
mul
shr
and
mul
dup2
div
dup2
sub
msize
mstore

# return(0, 0x20)
msize
callvalue
return

# padding
invalid
invalid

# :noadjust
jumpdest

# mstore(0x24, _amount - (_amount / (and(shr(($id * 5), selfbalance()), 0x1f) * 100)))
push1 0x64
push1 0x1f
selfbalance
push1 0x5
dup6
mul
shr
and
mul
dup2
div
dup2
sub
msize
mstore

# return(0, 0x20)
msize
callvalue
return
