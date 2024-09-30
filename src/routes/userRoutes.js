const express = require('express');
const userController = require('../controllers/userController'); // Adjust the path as needed
const { verifyToken, isUser } = require('../middlewares/user');

const router = express.Router();


router.post('/signup', userController.signup);
router.post('/login', userController.login); 
router.post('/register-seller', verifyToken, isUser, userController.registerseller); 

router.post('/forgot-password', userController.forgotPassword); 




module.exports = router;
