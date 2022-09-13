const path = require('path');
const express = require('express');
const router = express.Router();
//const rootDir = require('../util/path');
const apiController = require('../controllers/api');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// main get route
router.get('/index', apiController.getIndex);
router.get('/category', apiController.getCategory);
router.get('/portfolio', apiController.getPort);
router.get('/portfolio_search', apiController.getOnePort);

module.exports = router;