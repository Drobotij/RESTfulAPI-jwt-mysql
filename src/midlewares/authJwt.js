const jwt = require('jsonwebtoken');
const config = require('../config');
const conexion = require('../database');

const authJwtController = {
    verifyToken: (req, res, next) => { //funcion que verifica el token

        try {

            const token = req.headers['x-access-token'];

            if (!token) return res.status(401).json({ msg: 'NO se ingreso el token' });

            const decodedToken = jwt.verify(token, config.SECRET); //decoding token
            req.userId = decodedToken.id;
            conexion.query(` 
                SELECT * FROM users
                WHERE id=${decodedToken.id} 
            `, (err, rows, fields) => { //busca la id que estaba en el token en la base de datos
                if (err) throw err;

                if (rows[0]) { //si existe el token sigue

                    next();

                } else {
                    res.status(404).json({ msg: 'El token es incorrecto' });
                }
            });

        } catch (error) {
            res.status(401).json({ msg: "Acceso denegado" });
        }

    },
    isAdmin: (req, res, next) => { //verifica si el token ingresado es de un admin
        conexion.query(`
            SELECT roles.name FROM roles 
            INNER JOIN users ON users.role=roles.id 
            WHERE users.id=${req.userId}
        `, (err, rows, fields) => {

            if (err) throw err;
            if (rows[0].name === 'admin') {
                next();
            } else {
                res.status(403).json({ msg: 'No tiene permiso para realizar esa accion.' });
            }
        });
    },
    isModerator: (req, res, next) => { //verifica si el token ingresado es de un moderador
        conexion.query(`
            SELECT roles.name FROM roles 
            INNER JOIN users ON users.role=roles.id 
            WHERE users.id=${req.userId}
        `, (err, rows, fields) => {

            if (err) throw err;
            if (rows[0].name === 'moderator' || rows[0].name === 'admin') {
                next();
            } else {
                res.status(403).json({ msg: 'No tiene permiso para realizar esa accion.' });
            }
        });
    }

}
module.exports = authJwtController;