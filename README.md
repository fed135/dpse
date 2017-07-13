Dynamically Permutted Step Encryption

DPSE-1024

---

Permutations:

1- Hash with key
2- Block rotation +
3- Block rotation -
4- Byteshift +
5- Byteshift -

Steps:

0- Have a payload and a key text/byte of at least 1024 characters
1- Hash operation on bytes against the key in a 256 bit map (per byte encryption)
2- Create a permutation order, based on the key, of length 1024
3- Perform 1024 permutations
4- Sign with algo name, permutation number
5- Make sure that you spent at least 100ms decrypting
6- Output result 
