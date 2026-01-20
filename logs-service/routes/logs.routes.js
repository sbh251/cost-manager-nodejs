const express = require('express');
const { listLogs } = require('../controllers/logs.controllers');

const router = express.Router();

router.get('/logs', listLogs);

module.exports = router;