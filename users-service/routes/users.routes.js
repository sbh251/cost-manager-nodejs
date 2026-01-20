const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { addUserSchema, addUser, listUsers, getUserDetails } = require('../controllers/users.controllers.js');

const router = express.Router();

router.get('/users', listUsers);
router.get('/users/:id', getUserDetails);
router.post('/add', validate(addUserSchema), addUser);

module.exports = router;