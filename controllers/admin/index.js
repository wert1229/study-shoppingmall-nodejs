const express = require('express');
const router = express.Router();
const paginate = require('express-paginate');

const loginRequired = require('../../middlewares/loginRequired');
const csrf = require('../../middlewares/csrf')
const multer = require('../../middlewares/multer');
const thumbnail = require('../../middlewares/thumbnail');
const ctrl = require('./admin.ctrl');

router.get('/', ctrl.index);

router.get('/products', paginate.middleware(3, 50), ctrl.get_products);

router.get('/products/detail/:id', ctrl.get_detail); 

router.get('/products/write', loginRequired, csrf, ctrl.get_write);

router.post('/products/write', loginRequired, multer.single('thumbnail'), csrf, ctrl.post_write); 

router.get('/products/edit/:id', csrf, ctrl.get_edit);

router.post('/products/edit/:id', multer.single('thumbnail'), thumbnail, csrf, ctrl.post_edit);

router.get('/products/delete/:id', ctrl.get_delete);

router.post('/products/detail/:id', ctrl.post_delete); 

router.get('/products/delete/:product_id/:memo_id', ctrl.get_delete_memo);

router.post('/products/ajax_summernote', loginRequired, multer.single('thumbnail'), ctrl.post_summernote);

module.exports = router;