const authController = require("../controllers/auth.controller.js");
const express = require("express");
const router = express.Router();

router.post("/", authController.index);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
