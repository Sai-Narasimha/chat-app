const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  findUser,
} = require("../Controller/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

module.exports = router;
