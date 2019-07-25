// Node.js - 동기와 비동기 그리고 콜백
const fs = require('fs');

console.log('A');
fs.readFile('../txt/sample.txt', 'utf-8', (err, result) => {
    console.log(result);
});
console.log('B');

