const mysql = require('mysql');

const host = 'localhost';
const user = 'drobo';
const password = '*****';
const database = 'APIwithAuth';

const conexion = mysql.createConnection({
    host,
    user,
    password,
    database
});

conexion.connect((err) => {
    if (err) throw err;
    console.log('Base conectada correctamente');
});

module.exports = conexion;