const express = require("express");
const router = express.Router();

//import controllers

const { createUser, logUser } = require("../controllers/users");

router.post("/register", createUser);
router.post("/login", logUser);

module.exports = router;
