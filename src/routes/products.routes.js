const router = require('express').Router();
const productsController = require('../controllers/products.controller');

const authJwt = require('../midlewares/authJwt');

router.get('/', authJwt.verifyToken, productsController.getProducts);
router.get('/:id', authJwt.verifyToken, productsController.getProductById);
router.post('/', [authJwt.verifyToken, authJwt.isModerator], productsController.createProduct);
router.put('/:id', [authJwt.verifyToken, authJwt.isModerator], productsController.updateProductById);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], productsController.deleteProductById);

module.exports = router;