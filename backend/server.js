const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: " http://localhost:5000",
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const insightsRoutes = require("./routes/insightsRoutes");

app.use("/api", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/insights", insightsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});