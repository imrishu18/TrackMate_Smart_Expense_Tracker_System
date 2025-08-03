const db = require("../service/dbService");

exports.getCategoryBreakdown = async (req, res) => {
  const { userId, month, year } = req.query;
  if (!userId || !month || !year) {
    return res.status(400).json({ success: false, message: "Missing required params" });
  }

  try {
    const [results] = await db.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ? AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?
       GROUP BY category`,
      [userId, month, year]
    );
    res.json({ success: true, data: results });
  } catch (err) {
    console.error("❌ Error in getCategoryBreakdown:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.getMonthlySpendingTrend = async (req, res) => {
  const { userId, year } = req.query;
  if (!userId || !year) {
    return res.status(400).json({ success: false, message: "Missing required params" });
  }

  try {
    const [results] = await db.query(
      `SELECT MONTH(expense_date) AS month, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ? AND YEAR(expense_date) = ?
       GROUP BY MONTH(expense_date)
       ORDER BY month`,
      [userId, year]
    );
    res.json({ success: true, data: results });
  } catch (err) {
    console.error("❌ Error in getMonthlySpendingTrend:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.getExpensesByPaymentType = async (req, res) => {
  const { userId, month, year } = req.query;
  if (!userId || !month || !year) {
    return res.status(400).json({ success: false, message: "Missing required params" });
  }

  try {
    const [results] = await db.query(
      `SELECT payment_type, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ? AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?
       GROUP BY payment_type`,
      [userId, month, year]
    );
    res.json({ success: true, data: results });
  } catch (err) {
    console.error("❌ Error in getExpensesByPaymentType:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.getPeakSpendingMonth = async (req, res) => {
  const { userId, year } = req.query;
  if (!userId || !year) {
    return res.status(400).json({ success: false, message: "Missing required params" });
  }

  try {
    const [results] = await db.query(
      `SELECT MONTH(expense_date) AS month, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ? AND YEAR(expense_date) = ?
       GROUP BY MONTH(expense_date)
       ORDER BY total DESC
       LIMIT 1`,
      [userId, year]
    );
    res.json({ success: true, data: results[0] || null });
  } catch (err) {
    console.error("❌ Error in getPeakSpendingMonth:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};
