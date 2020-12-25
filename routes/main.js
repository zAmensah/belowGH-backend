const router = require('express').Router();

const checkJWT = require('../helpers/check-jwt');
const multer = require('../helpers/multer');

const {
  addCategory,
  allCategory,
  singleCategory,
  updateCategory,
  feature,
  removeFavorite,
  addFavorite,
  getFavorite,
  checkFavorite,
  addHeader,
  deleteHeader,
  getHeaders,
  editHeaders,
  getFeature,
} = require('../controllers/main');
const {checkAdmin} = require('../controllers/auth');

// category section
router
  .route('/category')
  .get(allCategory)
  .post(checkJWT, checkAdmin, addCategory);

router.get('/category/:id', singleCategory);

router.put('/category/update/:id', updateCategory);

// feature section
router.put('/feature/:id', checkJWT, checkAdmin, feature);

router.get('/feature', getFeature);

// favorites section
router
  .route('/favorite')
  .get(checkJWT, getFavorite)
  .put(checkJWT, removeFavorite, addFavorite);

router.get('/favorite/:id', checkJWT, checkFavorite);

// header section
router
  .route('/header')
  .get(getHeaders)
  .post(checkJWT, checkAdmin, multer.single('photo'), addHeader);

router
  .route('/header/:id')
  .put(checkJWT, checkAdmin, editHeaders)
  .delete(checkJWT, checkAdmin, deleteHeader);

module.exports = router;
