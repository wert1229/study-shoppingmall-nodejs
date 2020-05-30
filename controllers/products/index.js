const express = require('express');
const router = express.Router();

const loginRequired = require('../../middlewares/loginRequired');
const ctrl = require('./products.ctrl');

router.get('/:id', ctrl.get_product);

router.post('/like/:product_id(\\d+)', loginRequired, ctrl.post_like);

router.delete('/like/:product_id(\\d+)', loginRequired, ctrl.delete_like);

module.exports = router;