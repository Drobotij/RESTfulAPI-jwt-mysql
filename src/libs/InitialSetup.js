const conexion = require('../database');

const crearRoles = function crearRoles() {

    conexion.query(`SELECT * FROM roles`, (err, rows, fields) => {
        if (err) throw err;

        if (rows[0]) { //si ya existen los roles
            console.log('No se crearon nuevos roles');
            return;

        } else { //si no existen los crea

            conexion.query(`
                INSERT INTO 
                roles(name)
                VALUES('admin'),('moderator'),('user')
            
             `, (err) => {
                if (err) throw err;
                console.log('Se crearon nuevos roles')
                return;
            })

        }
    });

};

module.exports = crearRoles;