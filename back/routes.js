const express = require('express');
const router = express.Router();

const user = require('./dist/controller/userController');
router.post('/addUser', user.addUser);

module.exports = router;