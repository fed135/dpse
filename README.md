# Dynamically Permutated Step Encryption

DPSE-256

---

## What is this

This is an encryption/hashing library. It transforms Buffers of data to make them impossible to read unless you have the right key.


## How does it work

`npm install dpse`

```

const dpse = require('dpse');

// Store this key somewhere
const myKey = dpse.keyGen();

const myData = new Buffer('Hello world!');

const myEncryptedData = dpse.encrypt(myData, myKey);

dpse.decrypt(myEncryptedData, myKey); // Hello world!

```

---

## AES-type permutations

1- Hash with key

2- Block rotation +

3- Block rotation -

4- Byteshift +

5- Byteshift -


## Encryption steps:

0- Have a payload and a key text/byte of at least 256 characters

1- Hash operation on bytes against the key in a 256 bit map (per byte encryption)

2- Create a permutation order, based on the key, of length 256

3- Perform 256 permutations

4- Sign with algo name, permutation number

5- Make sure that you spent at least 100ms decrypting

6- Output result 
