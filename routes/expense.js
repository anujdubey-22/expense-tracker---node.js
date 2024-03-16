const express = require('express');
const app = express();
const controller = require('../controller/expese');

const router = express.Router();

router.post('/signup',controller.userPost);

router.post('/validate',controller.validatePost)


module.exports = router;