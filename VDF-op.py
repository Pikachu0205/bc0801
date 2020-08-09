import datetime
import time
import sys

p = 73237431696005972674723595250817150843


def sqrt_mod_p_verify(y, x, p):
    if pow(y, 2) % p == x % p:
        return True
    else:
        return False


def quad_res(x, p):
    return pow(x, (p - 1) // 2, p) == 1


def mod_sqrt_op(x, p):
    if quad_res(x, p):
        pass
    else:
        y = pow(x, (p + 1) // 4, p)
    return y


def mod_op(x):  # hash operation on an int with t iternations
    x = x % p
    var = 1
    counter = 0;
    
    while var == 1 :
        x = mod_sqrt_op(x, p)
        counter++
        
    ret = [x, counter]
    return ret


y = mod_op(sys.argv[1])