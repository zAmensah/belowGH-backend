const router = require('express').Router();

const checkJWT = require('../helpers/check-jwt');

const {addReview} = require('../controllers/review');

router.post('/review/:id', checkJWT, addReview);

module.exports = router;
