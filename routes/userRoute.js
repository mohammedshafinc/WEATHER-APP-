const express = require("express");

const router = express.Router();

const { userRegistration } = require("../controller/userController");

router.post("/registration", userRegistration);
router.post("/login", userLogin);

module.exports = router;
