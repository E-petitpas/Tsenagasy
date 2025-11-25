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
router.get('/getAdhesion/vendor', user.adhesionVendor); // ok
router.put('/adhesionDecision/:idMagasin', user.updateVendorStatus); //ok
router.delete('/deleteAdhesion/:idMagasin', user.deleteAdhesion); //ok
router.get('/getAllUser/:adminId', user.getAllUsers); //ok


import * as product from '../controller/productController'
router.get('/getCategories', product.getCategories); //ok
router.post('/addProduct', upload.array("images", 5), product.createProduct);  //ok
router.post('/addProductLocation', upload.array("images", 5), product.createLocation); //ok
router.get('/getProductbyMerchand/:magasinId', product.getProductsByCommercant); //ok
router.delete('/deleteProduct/:productId', product.deleteProduct); //ok
router.post('/modifyProduct/:productId', upload.array("images", 5), product.updateProduct); //ok
router.post('/productbyMerchand/search/:commercantId', product.searchProductsbyCommercant); //ok
router.get('/popular-products/:magasinId', product.getPopularProducts); // ok
router.get('/admin/products', product.getAllProductsForAdmin); //ok
router.put('/admin/products/decision/:productId', product.updateProductStatus); //ok
router.delete('/admin/delete/:productId', product.deleteProduct); //ok

import * as sponsor from '../controller/sponsorController'
router.post('/sponsor/create', sponsor.createSponsor); //ok
router.get('/sponsors/:magasinId', sponsor.getSponsorsByVendor); //ok
router.put('/sponsor/resend/:id', sponsor.resendSponsor); //ok
router.delete('/sponsor/delete/:id', sponsor.deleteSponsor); //ok
router.post('/sponsors/filter/:magasinId', sponsor.filterSponsorsByVendor); //ok
router.get('/admin/sponsors', sponsor.getAllSponsors); //ok
router.put('/admin/sponsors/:id', sponsor.updateSponsorStatusAdmin); //ok
router.delete('/admin/delete/sponsors/:id', sponsor.deleteSponsor); //ok

import * as dashboard from '../controller/dashboardController'
router.get('/vendor/stats/:magasinId', dashboard.getVendorStats); //ok
router.get('/admin/stats', dashboard.getAdminStats); //ok
router.get('/api/user/:userId', dashboard.getUserProfile); //ok

export default router;