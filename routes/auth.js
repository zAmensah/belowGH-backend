const router = require('express').Router();

const checkJWT = require('../helpers/check-jwt');

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  userProfile,
} = require('../controllers/auth');

router.post('/register', register);

router.post('/login', login);

router.put('/forgot-password', forgotPassword);

router.put('/reset-password', resetPassword);

router.get('/profile', checkJWT, userProfile);

module.exports = router;
