const fs = require('fs');
fs.readFile('../txt/sample.txt', 'utf8', (err , data) => {
    if(err)throw err;
    console.log(data);
});