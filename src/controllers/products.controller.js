const conexion = require('../database');
const conexionDB = require('../database');

const productsController = {
    createProduct: (req, res) => {

        const { name, category, price, imgURL } = req.body;
        if (name && category && price && imgURL) {
            conexionDB.query(`
                INSERT INTO 
                products(name,category,price,imgURL)
                VALUES('${name}','${category}', ${parseInt(price)}, '${imgURL}')
            
            `, (err, rows, fields) => {
                if (err) throw err;
                res.status(201).json({ msg: 'Se registro un producto correctamente' });
            });
        } else {

            res.status(500).json({ msg: "Se nesesitan todos los parametros" });
        }


    },
    getProductById: (req, res) => {
        const { id } = req.params;

        if (id) {
            conexionDB.query(`
                SELECT * FROM products
                WHERE id=${id} 
            `, (err, rows, fields) => {
                if (err) throw err;
                res.status(200).json(rows[0]);
            });
        } else {
            res.json({ msg: 'Falta el id' });
        }
    },
    updateProductById: (req, res) => {
        const { name, category, price, imgURL } = req.body;
        const { id } = req.params;
        if (name && category && price && imgURL && id) {
            conexionDB.query(`
                UPDATE products
                SET name='${name}', category='${category}', price=${parseInt(price)}, imgURL='${imgURL}'
                WHERE id=${id}
                
            `, (err, rows, fields) => {
                if (err) throw err;
                res.status(200).json({ msg: 'Se actualizo un producto correctamente' });
            });
        } else {

            res.status(500).json({ msg: "Se nesesitan todos los parametros" });
        }
    },
    deleteProductById: (req, res) => {
        const { id } = req.params;

        if (id) {
            conexionDB.query(`
                SELECT * FROM products
                WHERE id=${id}
            `, (err, rows, fields) => {

                if (err) throw err;

                if (rows[0]) {

                    conexionDB.query(`
                        DELETE FROM products
                        WHERE id=${id} 
                    `, (err, rows, fields) => {
                        if (err) throw err;
                        res.status(204).json({ msg: 'Se elimino el producto con id ' + id + ' correctamente' });
                    });

                } else {
                    res.status(404).json({ msg: 'No se encontro un producto con esa id' });
                }

            });

        } else {
            res.json({ msg: 'Falta el id' });
        }
    },
    getProducts: (req, res) => {
        conexionDB.query(`
            SELECT * FROM products
        `, (err, rows, fields) => {
            if (err) throw err;
            res.status(200).json(rows);
        });
    }
};


module.exports = productsController;