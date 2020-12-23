const router = require('express').Router();

const {isAdmin} = require('../controllers/user');
const checkJWT = require('../helpers/check-jwt');

router.get('/tesst', checkJWT, isAdmin);

module.exports = router;
