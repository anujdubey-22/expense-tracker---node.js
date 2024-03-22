const express =  require('express');
const { route } = require('./expense');
const forgotController = require('../controller/forgot');

const router =  express.Router();

router.post('./forgotpassword', forgotController.postForgot);

module.exports = router ;