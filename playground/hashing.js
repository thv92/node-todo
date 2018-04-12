// const {SHA256} = require('crypto-js');
// let message = 'I am user Number 3';
// let hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

const jwt = require('jsonwebtoken');

let data = {
    id: 5
};

const token = jwt.sign(data, '123');

console.log(token);

const decoded = jwt.verify(token, '123');
console.log('Decoded:',decoded);