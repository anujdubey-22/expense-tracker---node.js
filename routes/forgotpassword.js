const express = require("express");
const forgotController = require("../controller/forgotpassword");

const router = express.Router();

router.post("./forgotpassword", forgotController.postForgotpasswaord);

router.post("/resetpassword", forgotController.postResetpassword);

router.post("/updatepassword/:id", forgotController.postUpdatepassword);

module.exports = router;
