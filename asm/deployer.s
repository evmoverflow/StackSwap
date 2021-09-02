# _size = $size
push2 $size

# codecopy(0, $offset, _size)
dup1
push1 $offset
msize
codecopy

# return(0, _size)
push1 0
return
