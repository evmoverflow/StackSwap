# :$adjustFees_In
jumpdest

# jump($jump + (eq($owner, caller()) * 4))
push20 $owner
caller
eq
push1 0x2
shl
push2 $jump
add
jump
