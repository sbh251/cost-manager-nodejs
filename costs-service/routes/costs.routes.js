const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { addCostSchema , addCost } = require('../controllers/costs.controllers');
const { getReport } = require('../controllers/report.controllers');

const router = express.Router();

router.post('/add', validate(addCostSchema), addCost);
router.get('/report', getReport);

module.exports = router;