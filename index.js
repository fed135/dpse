/** Password encryption */

'use strict';

/* Local variables -----------------------------------------------------------*/

const STEPS_IN = [mapBytesIn, byteShift, byteUnshift, byteRotate, byteUnrotate];
const STEPS_OUT = [mapBytesOut, byteUnshift, byteShift, byteUnrotate, byteRotate];

const BASE = 256;
const MIN_WAIT_IN = 100;
const MIN_WAIT_OUT = 100;

const KEY_HEADER = `DPSE-${BASE} `;

/* Methods -------------------------------------------------------------------*/

/** @private */
function mapKeyIn(key) {
  const seed = Number(key.join(''));
  const list = new Array(BASE);
  const dict = new Array(BASE);

  for (let i = 0; i < BASE; i++) {
    const temp = list[i] || i;
    const rand = (seed % (i+1) + i) % BASE;
    list[i] = list[rand] || rand;
    list[rand] = temp;
  }

  list.forEach((val, index) => dict[val] = index);

  return dict;
}

/** @private */
function mapKeyOut(key) {
  const seed = Number(key.join(''));
  const dict = new Array(BASE);

  for (let i = 0; i < BASE; i++) {
    const temp = dict[i] || i;
    const rand = (seed % (i+1) + i) % BASE;
    dict[i] = dict[rand] || rand;
    dict[rand] = temp;
  }

  return dict;
}

/** @private */
function parseKey(rawKey) {
    return toUint8(String(rawKey).replace(KEY_HEADER, ''));
}

/** @private */
function toUint8(str) {
  return str.toString()
    .split('')
    .map(char => char.charCodeAt(0) % BASE);
}

/** @private */
function mapByteIn(keyMap, val) {
  return keyMap[val];
}

/** @private */
function mapByteOut(keyMap, val) {
  return keyMap[val];
}

/** @private */
function mapBytesIn(bytes, key) {
    return bytes.map(mapByteIn.bind(null, key));
}

/** @private */
function mapBytesOut(bytes, key) {
    return bytes.map(mapByteOut.bind(null, key));
}

/** @private */
function byteShift(bytes) {
    bytes.push(bytes.shift());
    return bytes;
}

/** @private */
function byteUnshift(bytes) {
    bytes.unshift(bytes.pop());
    return bytes;
}


/** @private */
function byteRotate(bytes) {
    return bytes.map(byte => (byte + 1) % BASE);
}

/** @private */
function byteUnrotate(bytes) {
    return bytes.map(byte => {
        if (byte === 0) return BASE;
        return byte - 1;
    });
}

/** @private */
function runSteps(steps, bytes, key) {
    let result = Array.from(bytes);
    for (let i = 0; i < steps.length; i++) {
        if (i in steps) {
            console.log(steps[i]);
            result = steps[i](result, key);
        }
    }
    return result;
}

/**
 * @param {UInt8Array} bytes The bytes to encrypt
 * @param {String} key The password for the encryption (BASE Characters)
 * @returns {UInt8Array} The encrypted bytes
 */
function encrypt(bytes, rawKey) {
  const parsedKey = parseKey(rawKey);
  const parsedKeyMap = mapKeyIn(parsedKey);
  const steps = [mapBytesIn].concat(parsedKey.map(keyByte => STEPS_IN[keyByte % 5]));
  const startTime = Date.now();

  const ret = Buffer.from(runSteps(steps, bytes, parsedKeyMap));
  while(startTime + MIN_WAIT_IN > Date.now()) true;
  return ret;
}

/**
 * @param {UInt8Array} bytes The bytes to decrypt
 * @param {String} key The password
 * @returns {UInt8Array} The decrypted bytes
 */
function decrypt(bytes, rawKey) {
  const parsedKey = parseKey(rawKey);
  const parsedKeyMap = mapKeyOut(parsedKey);
  const steps = [mapBytesOut].concat(parsedKey.map(keyByte => STEPS_OUT[keyByte % 5]));
  const startTime = Date.now();

  const ret = Buffer.from(runSteps(steps, bytes, parsedKeyMap));
  while(startTime + MIN_WAIT_OUT > Date.now()) true;
  return ret;
}

/**
 * @returns {String} A BASE Characters length key
 */
function keyGen() {
    let ret = KEY_HEADER;

    for (let i = 0; i < BASE; i++) {
        ret += String.fromCharCode(Math.round(Math.random() * BASE));
    }

    return ret;
}

/* Exports -------------------------------------------------------------------*/

module.exports = { encrypt, decrypt, keyGen };