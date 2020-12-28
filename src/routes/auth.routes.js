const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authJwt = require('../midlewares/authJwt');

router.post('/signin', authController.signin);

router.post('/signup', [authJwt.verifyToken, authJwt.isAdmin], authController.signup);
module.exports = router;