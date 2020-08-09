import datetime
import time
import sys

p = 73237431696005972674723595250817150843


def sqrt_mod_p_verify(y, x, p):
    if pow(y, 2) % p == x % p:
        return True
    else:
        return False
        
        
def mod_verif(y, x, t):

    for i in range(t):
        y = pow(int(y), 2, p)
        
    if not quad_res(y, p):
        y = (-y) % p
        
    if x % p == y or (-x) % p == y:
        return True
    else:
        return False


#[0]前者算出來的值, [2]blockhash, [1]花了幾回合
mod_verif(sys[0], sys[2], sys[1])