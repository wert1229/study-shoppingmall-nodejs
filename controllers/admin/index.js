const express = require('express');
const router = express.Router();
const paginate = require('express-paginate');

const adminRequired = require('../../middlewares/adminRequired');
const csrf = require('../../middlewares/csrf')
const multer = require('../../middlewares/multer');
const thumbnail = require('../../middlewares/thumbnail');
const ctrl = require('./admin.ctrl');

router.get('/', ctrl.index);

router.get('/products', paginate.middleware(3, 50), ctrl.get_products);

router.use(adminRequired);

router.get('/products/detail/:id', ctrl.get_detail); 

router.get('/products/write', csrf, ctrl.get_write);

router.post('/products/write', multer.single('thumbnail'), csrf, ctrl.post_write); 

router.get('/products/edit/:id', csrf, ctrl.get_edit);

router.post('/products/edit/:id', multer.single('thumbnail'), thumbnail, csrf, ctrl.post_edit);

router.get('/products/delete/:id', ctrl.get_delete);

router.post('/products/detail/:id', ctrl.post_delete); 

router.get('/products/delete/:product_id/:memo_id', ctrl.get_delete_memo);

router.post('/products/ajax_summernote', multer.single('thumbnail'), ctrl.post_summernote);

router.get('/order', ctrl.get_order);

router.get('/order/edit/:id', ctrl.get_order_edit );

router.post('/order/edit/:id', ctrl.post_order_edit );

router.get('/statistics', ctrl.statistics);

router.post('/tag', ctrl.write_tag);

router.delete('/tag/:product_id/:tag_id', ctrl.delete_tag);

module.exports = router;