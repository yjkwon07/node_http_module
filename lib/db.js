const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'B_board'
});
db.connect();

module.exports = db;