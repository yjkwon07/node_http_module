// Node.js - 동기와 비동기 그리고 콜백
const fs = require('fs');

// readFileSync
/*
console.log('A');
var result = fs.readFileSync('./sample.txt', 'utf8');
console.log(result);
console.log('C');
*/

// sync + callback
console.log('A');
fs.readFile('../txt/sample.txt', 'utf-8', (err, result) => {
    console.log(result);
});
console.log('C');


// first - class - citizen
// function a() {
//     console.log('A');
// }


// anoymous fucntion() 
var a  = function() { 
    console.log('A');
}

function slowfunc(callback) {
    callback();
}

slowfunc(a);