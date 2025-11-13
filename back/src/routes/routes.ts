// back/src/routes/routes.ts

const express = require('express');
const router = express.Router();
import { requireAuth } from '../middleware/requireAuth'
import { upload } from '../middleware/multer';

import * as user from '../controller/userController'
router.post('/addUser', user.addClient); //ok
router.post('/login', user.login); //ok
router.post('/forgotPassword', user.forgotPassword); //same as the down
router.post('/resetPassword', user.resetPassword); //à voir et à développer
router.get('/getAdhesion/vendor', user.adhesionVendor);
router.put('/adhesionDecision/:idMagasin', user.updateVendorStatus);
router.delete('/deleteAdhesion/:idMagasin', user.deleteAdhesion);
router.get('/getAllUser/:adminId', user.getAllUsers);


import * as product from '../controller/productController'
router.get('/getCategories', product.getCategories); //ok
router.post('/addProduct', upload.array("images", 5), product.createProduct);  //ok
router.post('/addProductLocation', upload.array("images", 5), product.createLocation); //ok
router.get('/getProductbyMerchand/:magasinId', product.getProductsByCommercant); //ok
router.delete('/deleteProduct/:productId', product.deleteProduct); //ok
router.post('/modifyProduct/:productId', upload.array("images", 5), product.updateProduct); //ok
router.post('/productbyMerchand/search/:commercantId', product.searchProductsbyCommercant); //ok

import * as sponsor from '../controller/sponsorController'
router.post('/sponsor/create', sponsor.createSponsor); //ok
router.get('/sponsors/:magasinId', sponsor.getSponsorsByVendor); //ok
router.put('/sponsor/resend/:id', sponsor.resendSponsor); //ok
router.delete('/sponsor/delete/:id', sponsor.deleteSponsor); //ok
router.post('/sponsors/filter/:magasinId', sponsor.filterSponsorsByVendor);

export default router;