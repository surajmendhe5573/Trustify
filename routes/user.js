const express= require('express');
const {signUp, login, getAllUsers, updateUser} = require('../controllers/user.controller');
const router= express.Router();
const authenticate= require('../middleware/auth.middleware');

router.post('/signup', signUp);
router.post('/login', login);
router.get('/', authenticate, getAllUsers);
router.put('/update/:id', authenticate, updateUser);


module.exports= router;