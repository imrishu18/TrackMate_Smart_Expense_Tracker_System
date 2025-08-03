const express = require("express");
const router = express.Router();
const insightsController = require("../controller/insightsController");

router.get("/category", insightsController.getCategoryBreakdown);
router.get("/monthly-trend", insightsController.getMonthlySpendingTrend);
router.get("/payment-type", insightsController.getExpensesByPaymentType);
router.get("/peak-month", insightsController.getPeakSpendingMonth);

module.exports = router;
