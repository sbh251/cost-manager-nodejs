const express = require("express");
const { getAbout } = require('../controllers/about.controllers');

const router = express.Router();

router.get('/about', getAbout);

module.exports = router;