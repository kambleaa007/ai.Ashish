
# Pass by Reference and Pass by Value

def myFun(x):
    x[0] = 20

b = [10, 11, 12, 13]
myFun(b)
print(b) # [20, 11, 12, 13]

def myFun2(x):
    x = 20

a = 10
myFun2(a)
print(a) # 10

# Note: Python uses pass-by-object-reference, where functions receive references to objects instead of actual copies.





