const express = require('express');
const router = express.Router();
const upload = require('../coudinaryConfig');
const productController = require('../controller/productController');

router.post('/addProduct',upload.single('imageUrl'),productController.addProduct);
router.get('/getLiveProducts',productController.getLiveProducts);
router.get('/getUserProducts',productController.getUserProducts);
router.post('/updateProduct', upload.single("imageUrl"),productController.updateProduct);
router.post('/deleteProduct',productController.deleteProduct);

module.exports = router;