const conexion = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const authController = {
    signin: (req, res) => {
        const { email, password } = req.body;

        conexion.query(`
            SELECT users.id, users.email, users.password, users.username,roles.name FROM users 
            INNER JOIN roles ON users.role=roles.id 
            WHERE users.email='${email}'

        `, async(err, rows, fields) => {
            if (err) throw err;

            if (rows[0]) {
                if (await comparePassword(password, rows[0].password)) {

                    const token = jwt.sign({ id: rows[0].id }, config.SECRET, {
                        expiresIn: 86400 //24 hs
                    });

                    res.status(200).json({
                        msg: 'todo correcto',
                        user: {
                            username: rows[0].username,
                            email: rows[0].email,
                            role: rows[0].name
                        },
                        token
                    })
                } else {
                    res.status(401).json({ msg: 'Contraseña incorrecta' });
                }
            } else {
                res.status(400).json({ msg: 'El correo es incorrecto' });
            }
        });
    },
    signup: async(req, res) => {

        const { username, email, password, roles } = req.body;

        if (username && email && password) {


            conexion.query(`SELECT * FROM users WHERE email='${email}'`, async(err, rows, fields) => {

                if (err) throw err;

                if (rows[0]) { //exixte el correo que trata de registrar?

                    res.json({ msg: 'Ese email ya esta en uso' });

                } else { //no existe el usuario 

                    const encryptedPassword = await encryptPassword(password); //encriptar contra

                    if (roles) { //en caso de que ingrese un rol
                        conexion.query(`
                            SELECT id FROM roles
                            WHERE name='${roles}'
                        `, (err, rows, fields) => {
                            if (err) throw err;

                            if (rows[0]) {

                                const id = rows[0].id

                                conexion.query(`
                            
                                    INSERT INTO 
                                    users(username, email, password, role)
                                    VALUES('${username}', '${email}', '${encryptedPassword.toString()}', ${id})
            
                                `, (err, rows, fields) => {
                                    if (err) throw err;

                                    const token = jwt.sign({ id: rows.insertId }, config.SECRET, {
                                        expiresIn: 86400 //24 hs
                                    }); //creando el token
                                    res.status(200).json({ msg: 'se creo el usuaio correctamente', token });



                                });

                            } else {
                                res.json({ msg: 'El rol que ingreso no esta permitido' })
                            }

                        });

                    } else { //si no ingresa un rol por defecto se le pone 'user'

                        conexion.query(`
                            SELECT id FROM roles
                            WHERE name='user'
                        `, (err, rows, fields) => {
                            if (err) throw err;
                            const id = rows[0].id

                            conexion.query(`
                        
                                INSERT INTO 
                                users(username, email, password, role)
                                VALUES('${username}', '${email}', '${encryptedPassword.toString()}', ${id})
        
                            `, (err, rows, fields) => {
                                if (err) throw err;

                                const token = jwt.sign({ id: rows.insertId }, config.SECRET, {
                                    expiresIn: 86400 //24 hs
                                }); //creando el token
                                res.status(200).json({ msg: 'se creo el usuaio correctamente', token });



                            });

                        });

                    }

                }

            });

        } else {
            res.json({ MSG: 'se requieren todos los parametros' });
        }
    }

};

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
}

async function comparePassword(password, receivedPassword) {
    return await bcrypt.compare(password, receivedPassword);
}


module.exports = authController;