const express = require('express');
const router = express.Router();

const loginRequired = require('../../middlewares/loginRequired');
const ctrl = require('./chat.ctrl');

router.get('/', loginRequired, ctrl.index);

module.exports = router;