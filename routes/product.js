const router = require('express').Router();

const checkJWT = require('../helpers/check-jwt');
const multer = require('../helpers/multer');

const {
  addProduct,
  allProducts,
  singleProduct,
  singleAdminProduct,
  updateProduct,
  setCover,
  productViews,
  deletePhoto,
  deleteProduct,
  limitProduct,
  cartProducts,
} = require('../controllers/product');
const {checkAdmin} = require('../controllers/auth');

router
  .route('/product')
  .get(allProducts)
  .post(checkJWT, checkAdmin, multer.array('photos'), addProduct);

router.get('/product/:id', productViews, singleProduct);

router.get('/product/admin/:id', checkJWT, checkAdmin, singleAdminProduct);

router.put('/product/cover/:id', checkJWT, checkAdmin, setCover);

router.put('/product/update/:id', checkJWT, checkAdmin, updateProduct);

router.put('/product/delete-photo/:id', checkJWT, checkAdmin, deletePhoto);

router.delete('/product/delete/:id', checkJWT, checkAdmin, deleteProduct);

router.get('/home/product', limitProduct);

router.get('/cart/product', cartProducts);

module.exports = router;
