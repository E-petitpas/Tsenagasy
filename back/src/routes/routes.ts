// back/src/routes/routes.ts

const express = require('express');
const router = express.Router();
import { requireAuth } from '../middleware/requireAuth'

import * as user from '../controller/userController'
router.post('/addUser', user.addClient);
router.post('/login', user.login);
router.post('/forgotPassword', user.forgotPassword);
router.post('/resetPassword', user.resetPassword);

export default router;