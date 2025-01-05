const express= require('express');
const {signUp, login, getAllUsers, updateUser} = require('../controllers/user.controller');
const router= express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/', getAllUsers);
router.put('/update/:id', updateUser);


module.exports= router;