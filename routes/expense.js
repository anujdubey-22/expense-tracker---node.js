const express = require('express');
const app = express();
const controller = require('../controller/expense');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/get-expense', verifyToken, controller.getExpense);

router.post('/signup',controller.postUser);

router.post('/validate',controller.postValidate);

router.post('/post-expense',controller.postExpense);

router.post('/premium', verifyToken, controller.postPremium);

router.post('/updatetransactions',verifyToken,controller.postUpdatetransactions);

router.post('/failedTransaction', verifyToken, controller.postFailedTransaction);

router.delete('/delete-expense/:token',controller.deleteExpense);


module.exports = router;