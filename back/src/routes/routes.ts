// back/src/routes/routes.ts

const express = require('express');
const router = express.Router();
import { requireAuth } from '../middleware/requireAuth'
import { upload } from '../middleware/multer';

import * as user from '../controller/userController'
router.post('/addUser', user.addClient);
router.post('/login', user.login);
router.post('/forgotPassword', user.forgotPassword);
router.post('/resetPassword', user.resetPassword);
router.get('/getAllUser', user.getAllUsers);

import * as product from '../controller/productController'
router.get('/getCategories', product.getCategories);
router.post('/addProduct', upload.array("images", 5), product.createProduct);
router.get('/getProductbyMerchand/:commercantId', product.getProductsByCommercant);
router.delete('/deleteProduct/:productId', product.deleteProduct);
router.post('/modifyProduct/:productId', upload.array("images", 5), product.updateProduct);
router.post('/productbyMerchand/search/:commercantId', product.searchProductsbyCommercant);

export default router;