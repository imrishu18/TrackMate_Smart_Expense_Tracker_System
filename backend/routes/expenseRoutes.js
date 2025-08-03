const express = require("express");
const router = express.Router();
const {
  addExpense,
  getMonthlySummary,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} = require("../controller/expenseController");

router.post("/", addExpense);
router.get("/summary", getMonthlySummary);
router.get("/all", getAllExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
