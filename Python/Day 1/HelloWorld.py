print("Hello World!!!")

### Data Types 
a = 10
b = 20.00

d = "Python"
e = 2 + 4j 
f = [1,2,3,4]
g = (1,2,3,4)

### No Sub Types for Boolean Set Dictionary
c = True 
h = {1,2,3,4}
i = {1:'a', 2:'b', 3:'c'}

print(type(a)) # <class 'int'>
print(type(b)) # <class 'float'>
print(type(c)) # <class 'bool'>
print(type(d)) # <class 'str'>
print(type(e)) # <class 'complex'>
print(type(f)) # <class 'list'>
print(type(g)) # <class 'tuple'>
print(type(h)) # <class 'set'>
print(type(i)) # <class 'dict'>

import keyword
print(keyword.kwlist) # ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal','not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']


a = 15
b = 4
print("Addition:", a + b)  
print("Subtraction:", a - b) 
print("Multiplication:", a * b)  
print("Division:", a / b) # 3.75
print("Floor Division:", a // b) # 3  
print("Modulus:", a % b)  # 3
print("Exponentiation:", a ** b) # 50625

a = True
b = False
print(a and b) # F
print(a or b) # T
print(not a) # F

# bit wise 
a = 10
b = 4
print(a & b)
print(a | b)
print(~a)
print(a ^ b)
print(a >> 2)
print(a << 2)

a = 10
b = 20
c = a
print(a is not b) # T 
print(a is c) # T

x = 24
y = 20
my_list = [10, 20, 30, 40, 50]

if (x not in my_list):
    print("x is NOT present in given list") # THIS
else:
    print("x is present in given list")

if (y in my_list):
    print("y is present in given list") # THIS
else:
    print("y is NOT present in given list")


a, b = 10, 20
min = a if a < b else b  # [on_true] if [expression] else [on_false] 

print(min) # 10    


n = 4 
for i in range(0,n):
    print(i)          # 0 1 2 3

for i in range(0,n):
    for j in range(0,n):
        print(i , j)
    print(".")    

n = ["a","b","c"]
for i in range(len(n)):
    print(n[i])         # a b c





