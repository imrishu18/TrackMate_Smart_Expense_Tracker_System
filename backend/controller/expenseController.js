const db = require("../service/dbService");

// Add Expense
exports.addExpense = async (req, res) => {
  const { userId, expense_date, expense_name, amount, payment_type, category } = req.body;

  if (!userId || !expense_date || !expense_name || !amount || !payment_type || !category) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO expenses (user_id, expense_date, expense_name, amount, payment_type, category) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, expense_date, expense_name, amount, payment_type, category]
    );
    res.status(201).json({ success: true, message: "Expense added successfully" });
  } catch (err) {
    console.error("Add Expense Error:", err);
    res.status(500).json({ success: false, message: "Server error while adding expense" });
  }
};

// Monthly Summary
exports.getMonthlySummary = async (req, res) => {
  const { userId, month } = req.query;

  if (!userId || !month) {
    return res.status(400).json({ success: false, message: "User ID and month are required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND DATE_FORMAT(expense_date, '%Y-%m') = ?",
      [userId, month]
    );
    res.json({ success: true, total: rows[0].total || 0 });
  } catch (err) {
    console.error("Monthly Summary Error:", err);
    res.status(500).json({ success: false, message: "Server error while fetching summary" });
  }
};

// All Expenses
exports.getAllExpenses = async (req, res) => {
  const { userId, month, year } = req.query;

  let query = "SELECT * FROM expenses WHERE user_id = ?";
  let values = [userId];

  if (month && year) {
    query += " AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?";
    values.push(month, year);
  }

  try {
    const [rows] = await db.query(query, values);
    res.json({ success: true, expenses: rows });
  } catch (err) {
    console.error("Get Expenses Error:", err);
    res.status(500).json({ success: false, message: "Server error while fetching expenses" });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { expense_name, amount, payment_type, expense_date, category } = req.body;

  if (!expense_name || !amount || !payment_type || !expense_date || !category) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await db.query(
      "UPDATE expenses SET expense_name = ?, amount = ?, payment_type = ?, expense_date = ?, category = ? WHERE id = ?",
      [expense_name, amount, payment_type, expense_date, category, id]
    );
    res.json({ success: true, message: "Expense updated" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Server error while updating" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM expenses WHERE id = ?", [id]);
    res.json({ success: true, message: "Expense deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Server error while deleting" });
  }
};
