const express = require("express");
const router = express.Router();

const {
  createAccount,
  depositAmmount,
  transferAmount,
} = require("../controller/user");

router.post("/accounts", createAccount);
router.post("/accounts/:id", depositAmmount);
router.post("/transfers", transferAmount);

module.exports = router;
